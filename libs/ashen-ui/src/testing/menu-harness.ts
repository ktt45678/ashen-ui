import {
  ComponentHarness,
  HarnessPredicate,
  TestKey,
  type BaseHarnessFilters,
  type HarnessLoader,
} from '@angular/cdk/testing';

export interface SnMenuItemHarnessFilters extends BaseHarnessFilters {
  /** Match on the item's text. */
  text?: string | RegExp;
}

export interface SnMenuHarnessFilters extends BaseHarnessFilters {
  /** Match on the trigger's own text. */
  triggerText?: string | RegExp;
}

/** One `role="menuitem"` in an open menu. Reached through {@link SnMenuHarness}. */
export class SnMenuItemHarness extends ComponentHarness {
  static readonly hostSelector = '.sn-menu-item';

  static with(filters: SnMenuItemHarnessFilters = {}): HarnessPredicate<SnMenuItemHarness> {
    return new HarnessPredicate(SnMenuItemHarness, filters).addOption(
      'text',
      filters.text,
      (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text),
    );
  }

  /** The item's words. Icons are excluded; a ligature icon's text is its name. */
  async getText(): Promise<string> {
    return (await this.host()).text({ exclude: '.sn-icon' });
  }

  async isDisabled(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-disabled').then((v) => v === 'true');
  }

  async click(): Promise<void> {
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
 * Drives a menu through its trigger, which is where an app's test starts.
 *
 * ```ts
 * const menu = await loader.getHarness(SnMenuHarness.with({ triggerText: 'Actions' }));
 * await menu.open();
 * await menu.clickItem({ text: 'Duplicate' });
 * ```
 *
 * **Provide `provideSnAnimations('disabled')` in tests.** The menu detaches on
 * a timer; `close()` waits for it either way, but with animations on that wait
 * is the exit duration.
 */
export class SnMenuHarness extends ComponentHarness {
  static readonly hostSelector = '.sn-menu-trigger';

  static with(filters: SnMenuHarnessFilters = {}): HarnessPredicate<SnMenuHarness> {
    return new HarnessPredicate(SnMenuHarness, filters).addOption(
      'triggerText',
      filters.triggerText,
      (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text),
    );
  }

  async getTriggerText(): Promise<string> {
    return (await this.host()).text({ exclude: '.sn-icon' });
  }

  async isOpen(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-expanded').then((v) => v === 'true');
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) await (await this.host()).click();
  }

  async close(): Promise<void> {
    if (!(await this.isOpen())) return;
    await (await this.host()).sendKeys(TestKey.ESCAPE);
    await this.waitUntilClosed();
  }

  async sendKey(key: TestKey): Promise<void> {
    return (await this.host()).sendKeys(key);
  }

  /** Items in this menu's panel. Opens it first, since a closed menu has none. */
  async getItems(filters: SnMenuItemHarnessFilters = {}): Promise<SnMenuItemHarness[]> {
    await this.open();
    return (await this.getPanel()).getAllHarnesses(SnMenuItemHarness.with(filters));
  }

  async getItemTexts(): Promise<string[]> {
    return Promise.all((await this.getItems()).map((i) => i.getText()));
  }

  /** Click one item. The menu closes itself afterwards, as it does for a user. */
  async clickItem(filters: SnMenuItemHarnessFilters): Promise<void> {
    const [item] = await this.getItems(filters);
    if (!item) throw new Error(`No menu item matching ${JSON.stringify(filters)}.`);
    await item.click();
    await this.waitUntilClosed();
  }

  /** The panel, found through the trigger's `aria-controls`. */
  private async getPanel(): Promise<HarnessLoader> {
    const id = await (await this.host()).getAttribute('aria-controls');
    if (!id) throw new Error('The menu trigger has no aria-controls, so its panel is unreachable.');
    return this.documentRootLocatorFactory().harnessLoaderFor(`#${id}`);
  }

  private async waitUntilClosed(): Promise<void> {
    const deadline = Date.now() + 1000;
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 5));
      await this.forceStabilize();
      if (!(await this.isOpen())) return;
    }
    throw new Error('The menu did not close within 1s.');
  }
}
