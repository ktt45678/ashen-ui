import {
  ComponentHarness,
  HarnessPredicate,
  type BaseHarnessFilters,
  type TestKey,
} from '@angular/cdk/testing';

export interface SnTabHarnessFilters extends BaseHarnessFilters {
  /** Match on the tab's label text. */
  label?: string | RegExp;
  /** Match on selected state. */
  selected?: boolean;
}

/** Drives one tab in an `<sn-tabs>`. Reached through {@link SnTabsHarness}. */
export class SnTabHarness extends ComponentHarness {
  static readonly hostSelector = '.sn-tab-button';

  static with(filters: SnTabHarnessFilters = {}): HarnessPredicate<SnTabHarness> {
    return new HarnessPredicate(SnTabHarness, filters)
      .addOption('label', filters.label, (harness, label) =>
        HarnessPredicate.stringMatches(harness.getLabel(), label),
      )
      .addOption(
        'selected',
        filters.selected,
        async (harness, selected) => (await harness.isSelected()) === selected,
      );
  }

  private readonly label = this.locatorFor('.sn-tab-label');

  async getLabel(): Promise<string> {
    return (await this.label()).text();
  }

  async isSelected(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-selected').then((v) => v === 'true');
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host()).getProperty<boolean>('disabled');
  }

  async select(): Promise<void> {
    return (await this.host()).click();
  }

  async focus(): Promise<void> {
    return (await this.host()).focus();
  }

  async isFocused(): Promise<boolean> {
    return (await this.host()).isFocused();
  }
}

/**
 * Drives an `<sn-tabs>`.
 *
 * ```ts
 * const tabs = await loader.getHarness(SnTabsHarness);
 * await tabs.selectTab({ label: 'Billing' });
 * expect(await tabs.getSelectedLabel()).toBe('Billing');
 * expect(await tabs.getPanelText()).toContain('Invoices');
 * ```
 */
export class SnTabsHarness extends ComponentHarness {
  static readonly hostSelector = 'sn-tabs';

  static with(filters: BaseHarnessFilters = {}): HarnessPredicate<SnTabsHarness> {
    return new HarnessPredicate(SnTabsHarness, filters);
  }

  private readonly tabList = this.locatorFor('[role="tablist"]');
  /** Only the selected tab's panel is in the DOM. */
  private readonly panel = this.locatorForOptional('[role="tabpanel"]');

  async getTabs(filters: SnTabHarnessFilters = {}): Promise<SnTabHarness[]> {
    return this.locatorForAll(SnTabHarness.with(filters))();
  }

  async getLabels(): Promise<string[]> {
    return Promise.all((await this.getTabs()).map((t) => t.getLabel()));
  }

  async getSelectedLabel(): Promise<string | null> {
    const [selected] = await this.getTabs({ selected: true });
    return selected ? selected.getLabel() : null;
  }

  async selectTab(filters: SnTabHarnessFilters): Promise<void> {
    const [tab] = await this.getTabs(filters);
    if (!tab) throw new Error(`No tab matching ${JSON.stringify(filters)}.`);
    await tab.select();
  }

  /** The visible panel's text, or null when no tab is selected. */
  async getPanelText(): Promise<string | null> {
    const panel = await this.panel();
    return panel ? panel.text() : null;
  }

  /**
   * Send a key to the tab strip. Selection follows focus here, so this is how
   * to exercise the keyboard path rather than the click path.
   *
   * ```ts
   * await tabs.sendKey(TestKey.RIGHT_ARROW);
   * ```
   */
  async sendKey(key: TestKey): Promise<void> {
    return (await this.tabList()).sendKeys(key);
  }
}
