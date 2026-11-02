import { ComponentHarness, HarnessPredicate, type BaseHarnessFilters } from '@angular/cdk/testing';

export interface SnDialogHarnessFilters extends BaseHarnessFilters {
  /** Match on the dialog's title text. */
  title?: string | RegExp;
}

/**
 * Drives an open `<sn-dialog>`.
 *
 * The panel renders in place rather than through a portal, so this is found
 * from the fixture's own loader like any other component. A closed dialog is
 * not in the DOM at all, which is why `getHarnessOrNull` is the way to assert
 * one is gone.
 *
 * ```ts
 * const dialog = await loader.getHarness(SnDialogHarness);
 * expect(await dialog.getTitle()).toBe('Delete project');
 * await dialog.close();
 * expect(await loader.getHarnessOrNull(SnDialogHarness)).toBeNull();
 * ```
 *
 * **Provide `provideSnAnimations('disabled')` in tests**, or every close waits
 * out the exit animation before the panel leaves the DOM.
 */
export class SnDialogHarness extends ComponentHarness {
  static readonly hostSelector = '.sn-dialog-panel';

  static with(filters: SnDialogHarnessFilters = {}): HarnessPredicate<SnDialogHarness> {
    return new HarnessPredicate(SnDialogHarness, filters).addOption(
      'title',
      filters.title,
      (harness, title) => HarnessPredicate.stringMatches(harness.getTitle(), title),
    );
  }

  private readonly titleEl = this.locatorFor('.sn-dialog-title');
  private readonly bodyEl = this.locatorForOptional('.sn-dialog-body');
  private readonly closeButton = this.locatorForOptional('.sn-dialog-close-button');

  async getTitle(): Promise<string> {
    return (await this.titleEl()).text({ exclude: '.sn-icon' });
  }

  async getContentText(): Promise<string> {
    const body = await this.bodyEl();
    return body ? body.text() : '';
  }

  async isModal(): Promise<boolean> {
    return (await this.host()).getAttribute('aria-modal').then((v) => v === 'true');
  }

  /** Dismiss with the header's close button. Throws when the dialog has none. */
  async close(): Promise<void> {
    const button = await this.closeButton();
    if (!button) throw new Error('This dialog has no close button.');
    await button.click();
  }

  /** Click a footer button by its text, which is how a test confirms or cancels. */
  async clickFooterButton(text: string | RegExp): Promise<void> {
    const buttons = await this.locatorForAll('.sn-dialog-footer button')();
    for (const button of buttons) {
      if (await HarnessPredicate.stringMatches(button.text({ exclude: '.sn-icon' }), text)) {
        await button.click();
        return;
      }
    }
    throw new Error(`No footer button matching ${text}.`);
  }
}
