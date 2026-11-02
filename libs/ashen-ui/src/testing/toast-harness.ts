import { ComponentHarness, HarnessPredicate, type BaseHarnessFilters } from '@angular/cdk/testing';
import type { ToastSeverity } from 'ashen-ui/toast';

export interface SnToastHarnessFilters extends BaseHarnessFilters {
  /** Match on the toast's summary line. */
  summary?: string | RegExp;
  /** Match on severity. */
  severity?: ToastSeverity;
}

/** One toast in the outlet. Reached through {@link SnToastOutletHarness}. */
export class SnToastHarness extends ComponentHarness {
  static readonly hostSelector = '.sn-toast-item';

  static with(filters: SnToastHarnessFilters = {}): HarnessPredicate<SnToastHarness> {
    return new HarnessPredicate(SnToastHarness, filters)
      .addOption('summary', filters.summary, (harness, summary) =>
        HarnessPredicate.stringMatches(harness.getSummary(), summary),
      )
      .addOption(
        'severity',
        filters.severity,
        async (harness, severity) => (await harness.getSeverity()) === severity,
      );
  }

  private readonly summaryEl = this.locatorFor('.sn-toast-summary');
  private readonly detailEl = this.locatorForOptional('.sn-toast-detail');
  private readonly closeButton = this.locatorForOptional('.sn-toast-close');

  async getSummary(): Promise<string> {
    return (await this.summaryEl()).text();
  }

  async getDetail(): Promise<string | null> {
    const detail = await this.detailEl();
    return detail ? detail.text() : null;
  }

  async getSeverity(): Promise<ToastSeverity | null> {
    const host = await this.host();
    for (const severity of ['info', 'success', 'warning', 'error'] as const) {
      if (await host.hasClass(`sn-toast-item--${severity}`)) return severity;
    }
    return null;
  }

  /** `alert` for warnings and errors, `status` otherwise. */
  async getRole(): Promise<string | null> {
    return (await this.host()).getAttribute('role');
  }

  async isClosable(): Promise<boolean> {
    return (await this.closeButton()) !== null;
  }

  async dismiss(): Promise<void> {
    const button = await this.closeButton();
    if (!button) throw new Error('This toast is not closable.');
    await button.click();
  }

  /** Hovering pauses the life timer, which is a documented behaviour worth testing. */
  async hover(): Promise<void> {
    return (await this.host()).hover();
  }

  async mouseAway(): Promise<void> {
    return (await this.host()).mouseAway();
  }
}

/**
 * Drives the `<sn-toast>` outlet an app places once.
 *
 * ```ts
 * toastService.error('Upload failed', 'Try again');
 * const toasts = await loader.getHarness(SnToastOutletHarness);
 * expect(await toasts.getSummaries()).toEqual(['Upload failed']);
 * await toasts.dismiss({ summary: 'Upload failed' });
 * ```
 *
 * **Provide `provideSnAnimations('disabled')` in tests.** A toast leaves on an
 * exit animation, and its life timer starts on `animationend`, so with
 * animations on a test waits for both.
 */
export class SnToastOutletHarness extends ComponentHarness {
  static readonly hostSelector = 'sn-toast';

  static with(filters: BaseHarnessFilters = {}): HarnessPredicate<SnToastOutletHarness> {
    return new HarnessPredicate(SnToastOutletHarness, filters);
  }

  async getToasts(filters: SnToastHarnessFilters = {}): Promise<SnToastHarness[]> {
    return this.locatorForAll(SnToastHarness.with(filters))();
  }

  async getSummaries(): Promise<string[]> {
    return Promise.all((await this.getToasts()).map((t) => t.getSummary()));
  }

  async dismiss(filters: SnToastHarnessFilters): Promise<void> {
    const [toast] = await this.getToasts(filters);
    if (!toast) throw new Error(`No toast matching ${JSON.stringify(filters)}.`);
    await toast.dismiss();
    await this.waitUntilGone(filters);
  }

  /** The outlet's corner, as a `sn-toast--<position>` class. */
  async getPosition(): Promise<string | null> {
    const classes = (await (await this.host()).getAttribute('class')) ?? '';
    return classes.split(/\s+/).find((c) => c.startsWith('sn-toast--')) ?? null;
  }

  /**
   * A dismissed toast is removed after its exit animation, so a test that
   * asserts it is gone has to wait for that rather than for change detection.
   */
  private async waitUntilGone(filters: SnToastHarnessFilters): Promise<void> {
    const deadline = Date.now() + 1000;
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 5));
      await this.forceStabilize();
      if ((await this.getToasts(filters)).length === 0) return;
    }
    throw new Error('The toast did not leave within 1s.');
  }
}
