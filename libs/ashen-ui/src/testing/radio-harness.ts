import {
  ComponentHarness,
  HarnessPredicate,
  type BaseHarnessFilters,
  type TestKey,
} from '@angular/cdk/testing';

export interface SnRadioButtonHarnessFilters extends BaseHarnessFilters {
  /** Match on the button's label text. */
  label?: string | RegExp;
  /** Match on checked state. */
  checked?: boolean;
}

export interface SnRadioGroupHarnessFilters extends BaseHarnessFilters {
  /** Match on the group's `aria-label`. */
  ariaLabel?: string | RegExp;
}

/** Drives one `<sn-radio>`. Usually reached through {@link SnRadioGroupHarness}. */
export class SnRadioButtonHarness extends ComponentHarness {
  static readonly hostSelector = 'sn-radio';

  static with(filters: SnRadioButtonHarnessFilters = {}): HarnessPredicate<SnRadioButtonHarness> {
    return new HarnessPredicate(SnRadioButtonHarness, filters)
      .addOption('label', filters.label, (harness, label) =>
        HarnessPredicate.stringMatches(harness.getLabelText(), label),
      )
      .addOption(
        'checked',
        filters.checked,
        async (harness, checked) => (await harness.isChecked()) === checked,
      );
  }

  private readonly label = this.locatorFor('.sn-radio-button-label');

  async getLabelText(): Promise<string> {
    return (await this.label()).text();
  }

  async isChecked(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-checked').then((v) => v === 'true');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-disabled').then((v) => v === 'true');
  }

  async isFocused(): Promise<boolean> {
    return (await this.host()).isFocused();
  }

  async focus(): Promise<void> {
    return (await this.host()).focus();
  }

  /** Select this button. Already-selected stays selected: a radio never clears itself. */
  async check(): Promise<void> {
    if (!(await this.isChecked())) await (await this.host()).click();
  }

  /**
   * Move selection with an arrow key, which is how a keyboard user moves
   * between radios and is not the same code path as a click.
   *
   * ```ts
   * await button.sendKey(TestKey.DOWN_ARROW);
   * ```
   */
  async sendKey(key: TestKey): Promise<void> {
    return (await this.host()).sendKeys(key);
  }
}

/**
 * Drives an `<sn-radio-group>` and the buttons inside it.
 *
 * ```ts
 * const group = await loader.getHarness(SnRadioGroupHarness);
 * await group.checkByLabel('Weekly');
 * expect(await group.getCheckedLabel()).toBe('Weekly');
 * ```
 */
export class SnRadioGroupHarness extends ComponentHarness {
  static readonly hostSelector = 'sn-radio-group';

  static with(filters: SnRadioGroupHarnessFilters = {}): HarnessPredicate<SnRadioGroupHarness> {
    return new HarnessPredicate(SnRadioGroupHarness, filters).addOption(
      'ariaLabel',
      filters.ariaLabel,
      (harness, label) => HarnessPredicate.stringMatches(harness.getAriaLabel(), label),
    );
  }

  private readonly buttons = this.locatorForAll(SnRadioButtonHarness);

  async getAriaLabel(): Promise<string | null> {
    return (await this.host()).getAttribute('aria-label');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-disabled').then((v) => v === 'true');
  }

  async getButtons(
    filters: SnRadioButtonHarnessFilters = {},
  ): Promise<SnRadioButtonHarness[]> {
    return this.locatorForAll(SnRadioButtonHarness.with(filters))();
  }

  async getLabels(): Promise<string[]> {
    return Promise.all((await this.buttons()).map((b) => b.getLabelText()));
  }

  /** The checked button's label, or null when nothing is selected. */
  async getCheckedLabel(): Promise<string | null> {
    const checked = await this.getButtons({ checked: true });
    return checked.length ? checked[0].getLabelText() : null;
  }

  async checkByLabel(label: string | RegExp): Promise<void> {
    const [button] = await this.getButtons({ label });
    if (!button) throw new Error(`No sn-radio matching label ${label} in this group.`);
    await button.check();
  }
}
