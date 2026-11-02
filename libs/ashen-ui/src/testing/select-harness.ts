import {
  ComponentHarness,
  HarnessPredicate,
  type BaseHarnessFilters,
  type ComponentHarnessConstructor,
  type HarnessLoader,
  type TestKey,
} from '@angular/cdk/testing';
import { SnOptionHarness, type SnOptionHarnessFilters } from './option-harness';

export interface SnSelectHarnessFilters extends BaseHarnessFilters {
  /** Match on the trigger's `aria-label`. */
  ariaLabel?: string | RegExp;
  /** Match on the text the trigger currently shows. */
  valueText?: string | RegExp;
}

/**
 * What Select and MultiSelect share: one `role="combobox"` trigger, and a
 * panel that lives in the overlay container rather than inside the host.
 *
 * The panel is found through the trigger's `aria-controls`, so several selects
 * on one page never see each other's options.
 *
 * **Provide `provideSnAnimations('disabled')` in tests.** The close path
 * detaches the overlay from a timer, and with animations on that timer is the
 * exit duration. `close()` waits either way, but every close costs that long.
 */
abstract class SnSelectHarnessBase extends ComponentHarness {
  protected readonly trigger = this.locatorFor('.sn-select-trigger');

  async isOpen(): Promise<boolean> {
    return (await this.trigger()).getAttribute('aria-expanded').then((v) => v === 'true');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.trigger()).getProperty<boolean>('disabled');
  }

  async getAriaLabel(): Promise<string | null> {
    return (await this.trigger()).getAttribute('aria-label');
  }

  /** What the trigger shows: the selection, or the placeholder when empty. */
  async getValueText(): Promise<string> {
    return (await this.locatorFor('.sn-select-value')()).text();
  }

  async isEmpty(): Promise<boolean> {
    return (await this.locatorFor('.sn-select-value')()).hasClass('sn-select-placeholder');
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await (await this.trigger()).click();
  }

  async close(): Promise<void> {
    if (!(await this.isOpen())) return;
    await (await this.trigger()).click();
    await this.waitUntilClosed();
  }

  async focus(): Promise<void> {
    return (await this.trigger()).focus();
  }

  async isFocused(): Promise<boolean> {
    return (await this.trigger()).isFocused();
  }

  /** Send a key to the trigger, which is where the select's keyboard lives. */
  async sendKey(key: TestKey): Promise<void> {
    return (await this.trigger()).sendKeys(key);
  }

  /** Options currently in the panel. Opens it first, since a closed panel has none. */
  async getOptions(filters: SnOptionHarnessFilters = {}): Promise<SnOptionHarness[]> {
    await this.open();
    const panel = await this.getPanel();
    return panel.getAllHarnesses(SnOptionHarness.with(filters));
  }

  async getOptionTexts(): Promise<string[]> {
    return Promise.all((await this.getOptions()).map((o) => o.getText()));
  }

  /**
   * A loader scoped to this select's own panel, found through the trigger's
   * `aria-controls`. Scoping matters: the panel is in the overlay container,
   * where every other open panel on the page is too.
   */
  protected async getPanel(): Promise<HarnessLoader> {
    const id = await (await this.trigger()).getAttribute('aria-controls');
    if (!id) {
      throw new Error('The select trigger has no aria-controls, so its panel cannot be found.');
    }
    return this.documentRootLocatorFactory().harnessLoaderFor(`#${id}`);
  }

  /**
   * The overlay detaches from a timer, so stabilizing the fixture is not
   * enough on its own. With `provideSnAnimations('disabled')` this returns on
   * the first tick; with animations on it waits out the exit duration.
   */
  protected async waitUntilClosed(): Promise<void> {
    const deadline = Date.now() + 1000;
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 5));
      await this.forceStabilize();
      if (!(await this.isOpen())) return;
    }
    throw new Error('The select panel did not close within 1s.');
  }
}

/**
 * Drives an `<sn-select>`.
 *
 * ```ts
 * const select = await loader.getHarness(SnSelectHarness.with({ ariaLabel: 'Language' }));
 * await select.selectOption({ text: 'Tiếng Việt' });
 * expect(await select.getValueText()).toBe('Tiếng Việt');
 * ```
 */
export class SnSelectHarness extends SnSelectHarnessBase {
  static readonly hostSelector = 'sn-select';

  static with(filters: SnSelectHarnessFilters = {}): HarnessPredicate<SnSelectHarness> {
    return selectPredicate(SnSelectHarness, filters);
  }

  /** Pick one option. The panel closes itself afterwards, as it does for a user. */
  async selectOption(filters: SnOptionHarnessFilters): Promise<void> {
    const [option] = await this.getOptions(filters);
    if (!option) throw new Error(`No option matching ${JSON.stringify(filters)}.`);
    await option.click();
    await this.waitUntilClosed();
  }
}

/**
 * Drives an `<sn-multi-select>`.
 *
 * ```ts
 * const langs = await loader.getHarness(SnMultiSelectHarness);
 * await langs.selectOptions({ text: 'English' }, { text: 'Norsk' });
 * expect(await langs.getSelectedTexts()).toEqual(['English', 'Norsk']);
 * ```
 */
export class SnMultiSelectHarness extends SnSelectHarnessBase {
  static readonly hostSelector = 'sn-multi-select';

  static with(filters: SnSelectHarnessFilters = {}): HarnessPredicate<SnMultiSelectHarness> {
    return selectPredicate(SnMultiSelectHarness, filters);
  }

  /** Toggle each of these options in turn. The panel stays open throughout. */
  async selectOptions(...filters: SnOptionHarnessFilters[]): Promise<void> {
    await this.open();
    for (const filter of filters) {
      const [option] = await this.getOptions(filter);
      if (!option) throw new Error(`No option matching ${JSON.stringify(filter)}.`);
      await option.click();
    }
  }

  async getSelectedTexts(): Promise<string[]> {
    const selected = await this.getOptions({ selected: true });
    return Promise.all(selected.map((o) => o.getText()));
  }

  /** The labels of the chips the trigger shows, which can be fewer than the selection. */
  async getChipTexts(): Promise<string[]> {
    const chips = await this.locatorForAll('.sn-multi-select-chips sn-chip')();
    // Excluding icons drops the remove button's glyph from each label.
    return Promise.all(chips.map((c) => c.text({ exclude: '.sn-icon' })));
  }
}

function selectPredicate<T extends SnSelectHarnessBase>(
  type: ComponentHarnessConstructor<T>,
  filters: SnSelectHarnessFilters,
): HarnessPredicate<T> {
  return new HarnessPredicate<T>(type, filters)
    .addOption('ariaLabel', filters.ariaLabel, (harness, label) =>
      HarnessPredicate.stringMatches(harness.getAriaLabel(), label),
    )
    .addOption('valueText', filters.valueText, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getValueText(), text),
    );
}
