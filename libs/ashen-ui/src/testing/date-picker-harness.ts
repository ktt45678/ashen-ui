import {
  ComponentHarness,
  HarnessPredicate,
  type BaseHarnessFilters,
  type TestElement,
  type TestKey,
} from '@angular/cdk/testing';

export interface SnDatePickerHarnessFilters extends BaseHarnessFilters {
  /** Match on the trigger's `aria-label`. */
  ariaLabel?: string | RegExp;
  /** Match on the formatted date the trigger shows. */
  valueText?: string | RegExp;
}

/**
 * Drives an `<sn-date-picker>`.
 *
 * ```ts
 * const picker = await loader.getHarness(SnDatePickerHarness);
 * await picker.next();
 * await picker.pickDay(14);
 * expect(await picker.getValueText()).toBe('14/03/2026');
 * ```
 *
 * **Provide `provideSnAnimations('disabled')` in tests**, as for Select: the
 * panel detaches only after its exit animation.
 */
export class SnDatePickerHarness extends ComponentHarness {
  static readonly hostSelector = 'sn-date-picker';

  static with(filters: SnDatePickerHarnessFilters = {}): HarnessPredicate<SnDatePickerHarness> {
    return new HarnessPredicate(SnDatePickerHarness, filters)
      .addOption('ariaLabel', filters.ariaLabel, (harness, label) =>
        HarnessPredicate.stringMatches(harness.getAriaLabel(), label),
      )
      .addOption('valueText', filters.valueText, (harness, text) =>
        HarnessPredicate.stringMatches(harness.getValueText(), text),
      );
  }

  private readonly trigger = this.locatorFor('.sn-date-picker-trigger');

  async getAriaLabel(): Promise<string | null> {
    return (await this.trigger()).getAttribute('aria-label');
  }

  /** The formatted date, or the placeholder while nothing is chosen. */
  async getValueText(): Promise<string> {
    return (await this.locatorFor('.sn-select-value')()).text();
  }

  async isEmpty(): Promise<boolean> {
    return (await this.locatorFor('.sn-select-value')()).hasClass('sn-select-placeholder');
  }

  async isOpen(): Promise<boolean> {
    return (await this.trigger()).getAttribute('aria-expanded').then((v) => v === 'true');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.trigger()).getProperty<boolean>('disabled');
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await (await this.trigger()).click();
  }

  async close(): Promise<void> {
    if (!(await this.isOpen())) return;
    await (await this.trigger()).click();
    await this.waitUntilClosed();
  }

  async sendKey(key: TestKey): Promise<void> {
    return (await this.trigger()).sendKeys(key);
  }

  /** The panel's header, e.g. "March 2026". Opens the panel first. */
  async getHeaderText(): Promise<string> {
    const header = await this.inPanel('.sn-date-picker-header-center');
    return header!.text({ exclude: '.sn-icon' });
  }

  /** Step the view back: one month in day mode, one year in month mode. */
  async previous(): Promise<void> {
    await this.clickNav(0);
  }

  async next(): Promise<void> {
    await this.clickNav(1);
  }

  /** The day numbers the month on view shows. */
  async getDayLabels(): Promise<string[]> {
    const cells = await this.allInPanel('.sn-date-picker-grid-days button');
    return Promise.all(cells.map((c) => c.text()));
  }

  /** Pick a day in the month on view. The panel closes itself, as for a user. */
  async pickDay(day: number): Promise<void> {
    const cell = await this.inPanel(`.sn-date-picker-grid-days button[data-day="${day}"]`);
    if (!cell) throw new Error(`Day ${day} is not in the month on view.`);
    await cell.click();
    await this.waitUntilClosed();
  }

  /** The selected day's number, or null when the selection is not on view. */
  async getSelectedDay(): Promise<number | null> {
    const cell = await this.inPanel('.sn-date-picker-grid-days .sn-date-picker-cell-selected');
    return cell ? Number(await cell.getAttribute('data-day')) : null;
  }

  private async clickNav(index: 0 | 1): Promise<void> {
    const buttons = await this.allInPanel('.sn-date-picker-nav-btn');
    await buttons[index].click();
  }

  /**
   * Scope a selector to this picker's own panel. The panel is in the overlay
   * container, so an unscoped query would find any other open panel's cells.
   */
  private async panelSelector(selector: string): Promise<string> {
    await this.open();
    const id = await (await this.trigger()).getAttribute('aria-controls');
    if (!id) throw new Error('The date picker trigger has no aria-controls.');
    return `#${id} ${selector}`;
  }

  private async inPanel(selector: string): Promise<TestElement | null> {
    return this.documentRootLocatorFactory().locatorForOptional(
      await this.panelSelector(selector),
    )();
  }

  private async allInPanel(selector: string): Promise<TestElement[]> {
    return this.documentRootLocatorFactory().locatorForAll(await this.panelSelector(selector))();
  }

  private async waitUntilClosed(): Promise<void> {
    const deadline = Date.now() + 1000;
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 5));
      await this.forceStabilize();
      if (!(await this.isOpen())) return;
    }
    throw new Error('The date picker panel did not close within 1s.');
  }
}
