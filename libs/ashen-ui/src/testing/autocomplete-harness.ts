import {
  ComponentHarness,
  HarnessPredicate,
  type BaseHarnessFilters,
  type HarnessLoader,
  type TestKey,
} from '@angular/cdk/testing';
import { SnOptionHarness, type SnOptionHarnessFilters } from './option-harness';

export interface SnAutocompleteHarnessFilters extends BaseHarnessFilters {
  /** Match on the input's `aria-label`. */
  ariaLabel?: string | RegExp;
  /** Match on the input's current text. */
  value?: string | RegExp;
}

/**
 * Drives an `<sn-autocomplete>`.
 *
 * ```ts
 * const city = await loader.getHarness(SnAutocompleteHarness);
 * await city.type('lon');
 * expect(await city.getOptionTexts()).toEqual(['London']);
 * await city.selectOption({ text: 'London' });
 * ```
 *
 * **Provide `provideSnAnimations('disabled')` in tests**, as for Select.
 */
export class SnAutocompleteHarness extends ComponentHarness {
  static readonly hostSelector = 'sn-autocomplete';

  static with(
    filters: SnAutocompleteHarnessFilters = {},
  ): HarnessPredicate<SnAutocompleteHarness> {
    return new HarnessPredicate(SnAutocompleteHarness, filters)
      .addOption('ariaLabel', filters.ariaLabel, (harness, label) =>
        HarnessPredicate.stringMatches(harness.getAriaLabel(), label),
      )
      .addOption('value', filters.value, (harness, value) =>
        HarnessPredicate.stringMatches(harness.getValue(), value),
      );
  }

  private readonly input = this.locatorFor('input.sn-autocomplete-input');

  async getValue(): Promise<string> {
    return (await this.input()).getProperty<string>('value');
  }

  async getAriaLabel(): Promise<string | null> {
    return (await this.input()).getAttribute('aria-label');
  }

  async getPlaceholder(): Promise<string | null> {
    return (await this.input()).getAttribute('placeholder');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.input()).getProperty<boolean>('disabled');
  }

  async isOpen(): Promise<boolean> {
    return (await this.input()).getAttribute('aria-expanded').then((v) => v === 'true');
  }

  async focus(): Promise<void> {
    return (await this.input()).focus();
  }

  async blur(): Promise<void> {
    return (await this.input()).blur();
  }

  async isFocused(): Promise<boolean> {
    return (await this.input()).isFocused();
  }

  /** Replace what is typed, which is what filters the panel. */
  async type(text: string): Promise<void> {
    const input = await this.input();
    await input.clear();
    await input.sendKeys(text);
  }

  async clear(): Promise<void> {
    return (await this.input()).clear();
  }

  async sendKey(key: TestKey): Promise<void> {
    return (await this.input()).sendKeys(key);
  }

  /** Options currently matching. The panel only exists while it has some. */
  async getOptions(filters: SnOptionHarnessFilters = {}): Promise<SnOptionHarness[]> {
    const panel = await this.getPanel();
    return panel ? panel.getAllHarnesses(SnOptionHarness.with(filters)) : [];
  }

  async getOptionTexts(): Promise<string[]> {
    return Promise.all((await this.getOptions()).map((o) => o.getText()));
  }

  async selectOption(filters: SnOptionHarnessFilters): Promise<void> {
    const [option] = await this.getOptions(filters);
    if (!option) throw new Error(`No option matching ${JSON.stringify(filters)}.`);
    await option.click();
  }

  /**
   * A loader for this autocomplete's panel, or null when it is closed. Found
   * through the input's `aria-controls`, since the panel is in the overlay
   * container alongside every other one on the page.
   */
  private async getPanel(): Promise<HarnessLoader | null> {
    if (!(await this.isOpen())) return null;
    const id = await (await this.input()).getAttribute('aria-controls');
    if (!id) return null;
    return this.documentRootLocatorFactory().harnessLoaderForOptional(`#${id}`);
  }
}
