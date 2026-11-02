import { ComponentHarness, HarnessPredicate, type BaseHarnessFilters } from '@angular/cdk/testing';

export interface SnToggleHarnessFilters extends BaseHarnessFilters {
  /** Match on the toggle's label text. */
  label?: string | RegExp;
  /** Match on checked state. */
  checked?: boolean;
}

/**
 * Drives an `<sn-toggle>`.
 *
 * ```ts
 * const toggle = await loader.getHarness(SnToggleHarness.with({ label: 'Dark mode' }));
 * await toggle.check();
 * expect(await toggle.isChecked()).toBe(true);
 * ```
 */
export class SnToggleHarness extends ComponentHarness {
  static readonly hostSelector = 'sn-toggle';

  static with(filters: SnToggleHarnessFilters = {}): HarnessPredicate<SnToggleHarness> {
    return new HarnessPredicate(SnToggleHarness, filters)
      .addOption('label', filters.label, (harness, label) =>
        HarnessPredicate.stringMatches(harness.getLabelText(), label),
      )
      .addOption(
        'checked',
        filters.checked,
        async (harness, checked) => (await harness.isChecked()) === checked,
      );
  }

  private readonly label = this.locatorFor('.sn-toggle-label');

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

  async blur(): Promise<void> {
    return (await this.host()).blur();
  }

  /** Flip regardless of current state. A no-op while disabled, as for a user. */
  async toggle(): Promise<void> {
    return (await this.host()).click();
  }

  async check(): Promise<void> {
    if (!(await this.isChecked())) await this.toggle();
  }

  async uncheck(): Promise<void> {
    if (await this.isChecked()) await this.toggle();
  }
}
