import { ComponentHarness, HarnessPredicate, type BaseHarnessFilters } from '@angular/cdk/testing';

export interface SnOptionHarnessFilters extends BaseHarnessFilters {
  /** Match on the option's text. */
  text?: string | RegExp;
  /** Match on selected state. */
  selected?: boolean;
}

/**
 * One `role="option"` row in a Select, MultiSelect, AutoComplete or Listbox
 * panel. The four render the same option markup, so they share this harness.
 */
export class SnOptionHarness extends ComponentHarness {
  static readonly hostSelector = '.sn-listbox-option';

  static with(filters: SnOptionHarnessFilters = {}): HarnessPredicate<SnOptionHarness> {
    return new HarnessPredicate(SnOptionHarness, filters)
      .addOption('text', filters.text, (harness, text) =>
        HarnessPredicate.stringMatches(harness.getText(), text),
      )
      .addOption(
        'selected',
        filters.selected,
        async (harness, selected) => (await harness.isSelected()) === selected,
      );
  }

  /**
   * The option's label. Icons are excluded: a selected option renders its
   * check as a ligature, so the raw text would read "Englishcheck".
   */
  async getText(): Promise<string> {
    return (await this.host()).text({ exclude: '.sn-icon' });
  }

  async isSelected(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-selected').then((v) => v === 'true');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-disabled').then((v) => v === 'true');
  }

  /** True while this is the option the arrow keys have landed on. */
  async isActive(): Promise<boolean> {
    return (await this.host()).hasClass('sn-listbox-option-active');
  }

  async click(): Promise<void> {
    return (await this.host()).click();
  }
}
