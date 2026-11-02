import { ComponentHarness, HarnessPredicate, type BaseHarnessFilters } from '@angular/cdk/testing';

export interface SnCheckboxHarnessFilters extends BaseHarnessFilters {
  /** Match on the checkbox's label text. */
  label?: string | RegExp;
  /** Match on checked state. */
  checked?: boolean;
}

/**
 * Drives an `<sn-checkbox>` from a consuming app's tests without that app
 * needing to know the component's markup.
 *
 * ```ts
 * const box = await loader.getHarness(SnCheckboxHarness.with({ label: 'Accept terms' }));
 * await box.check();
 * expect(await box.isChecked()).toBe(true);
 * ```
 *
 * Without a harness an app's tests reach for `.sn-checkbox-box`, which turns
 * this library's internal markup into public API that can never change.
 */
export class SnCheckboxHarness extends ComponentHarness {
  static readonly hostSelector = 'sn-checkbox';

  static with(filters: SnCheckboxHarnessFilters = {}): HarnessPredicate<SnCheckboxHarness> {
    return new HarnessPredicate(SnCheckboxHarness, filters)
      .addOption('label', filters.label, (harness, label) =>
        HarnessPredicate.stringMatches(harness.getLabelText(), label),
      )
      .addOption(
        'checked',
        filters.checked,
        async (harness, checked) => (await harness.isChecked()) === checked,
      );
  }

  private readonly label = this.locatorFor('.sn-checkbox-label');

  async getLabelText(): Promise<string> {
    return (await this.label()).text();
  }

  /** Indeterminate reports `false` here. See {@link isIndeterminate}. */
  async isChecked(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-checked').then((v) => v === 'true');
  }

  async isIndeterminate(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-checked').then((v) => v === 'mixed');
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

  /** Toggle regardless of current state. A no-op while disabled, as for a user. */
  async toggle(): Promise<void> {
    return (await this.host()).click();
  }

  async check(): Promise<void> {
    // Indeterminate counts as unchecked, and toggling from it lands on checked,
    // matching what the component does to a user's click.
    if (!(await this.isChecked())) await this.toggle();
  }

  async uncheck(): Promise<void> {
    if (await this.isChecked()) await this.toggle();
    // From indeterminate, one toggle goes to checked; a second clears it.
    else if (await this.isIndeterminate()) {
      await this.toggle();
      await this.toggle();
    }
  }
}
