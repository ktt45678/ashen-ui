import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Toast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.toast);
  });

  test.describe('All four severities', () => {
    test('clicking Info shows a toast with the correct summary and detail', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Info' }).click();
      const toast = page.locator('.sn-toast-item').first();
      await expect(toast).toBeVisible();
      await expect(toast.locator('.sn-toast-summary')).toContainText('File uploaded');
      await expect(toast.locator('.sn-toast-detail')).toContainText('document.pdf');
    });

    test('info toast has role=status', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Info' }).click();
      await expect(page.locator('.sn-toast-item').first()).toHaveAttribute('role', 'status');
    });

    test('clicking Success shows a toast with role=status', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Success' }).click();
      const toast = page.locator('.sn-toast-item').first();
      await expect(toast).toBeVisible();
      await expect(toast).toHaveAttribute('role', 'status');
      await expect(toast.locator('.sn-toast-summary')).toContainText('Changes saved');
    });

    test('clicking Warning shows a toast with role=alert', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Warning' }).click();
      const toast = page.locator('.sn-toast-item').first();
      await expect(toast).toBeVisible();
      await expect(toast).toHaveAttribute('role', 'alert');
      await expect(toast.locator('.sn-toast-summary')).toContainText('Storage almost full');
    });

    test('clicking Error shows a toast with role=alert', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Error' }).click();
      const toast = page.locator('.sn-toast-item').first();
      await expect(toast).toBeVisible();
      await expect(toast).toHaveAttribute('role', 'alert');
      await expect(toast.locator('.sn-toast-summary')).toContainText('Upload failed');
    });

    test('severity CSS classes are applied per severity', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Info' }).click();
      await expect(page.locator('.sn-toast-item--info').first()).toBeVisible();

      await d.getByRole('button', { name: 'Success' }).click();
      await expect(page.locator('.sn-toast-item--success').first()).toBeVisible();

      await d.getByRole('button', { name: 'Warning' }).click();
      await expect(page.locator('.sn-toast-item--warning').first()).toBeVisible();

      await d.getByRole('button', { name: 'Error' }).click();
      await expect(page.locator('.sn-toast-item--error').first()).toBeVisible();
    });

    test('close button dismisses the toast immediately', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Info' }).click();
      const toast = page.locator('.sn-toast-item').first();
      await expect(toast).toBeVisible();
      await toast.locator('.sn-toast-close').click();
      await expect(page.locator('.sn-toast-item')).toHaveCount(0, { timeout: 1000 });
    });

    test('toast auto-dismisses on its own within the configured 3 s life', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Info' }).click();
      await expect(page.locator('.sn-toast-item')).toHaveCount(1);
      // auto-dismiss at 3000 ms + 150 ms exit animation; allow 4500 ms total
      await expect(page.locator('.sn-toast-item')).toHaveCount(0, { timeout: 4500 });
    });

    test('clicking the trigger twice stacks two toasts', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Info' }).click();
      await d.getByRole('button', { name: 'Success' }).click();
      await expect(page.locator('.sn-toast-item')).toHaveCount(2);
    });

    test('toast container carries aria-live=polite', async ({ page }) => {
      await expect(page.locator('sn-toast')).toHaveAttribute('aria-live', 'polite');
    });

    test('toast close button has an aria-label', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Info' }).click();
      const closeBtn = page.locator('.sn-toast-item .sn-toast-close').first();
      await expect(closeBtn).toHaveAttribute('aria-label', /\S/);
    });

    test('icon size tokens win over the base icon size', async ({ page }) => {
      const d = demo(page, 'All four severities');
      await d.getByRole('button', { name: 'Info' }).click();
      const item = page.locator('.sn-toast-item').first();
      await expect(item.locator('.sn-toast-icon')).toHaveCSS('font-size', '18px');
      await expect(item.locator('.sn-toast-close .sn-icon')).toHaveCSS('font-size', '15px');
    });
  });

  test.describe('Sticky toast', () => {
    test('sticky toast does not auto-dismiss', async ({ page }) => {
      const d = demo(page, 'Sticky toast');
      await d.getByRole('button', { name: 'Show sticky' }).click();
      const toast = page.locator('.sn-toast-item').first();
      await expect(toast).toBeVisible();
      // Wait well past the default 3 s life to confirm it stays
      await page.waitForTimeout(3500);
      await expect(page.locator('.sn-toast-item')).toHaveCount(1);
    });

    test('sticky toast can be dismissed via the close button', async ({ page }) => {
      const d = demo(page, 'Sticky toast');
      await d.getByRole('button', { name: 'Show sticky' }).click();
      await expect(page.locator('.sn-toast-item')).toHaveCount(1);
      await page.locator('.sn-toast-item .sn-toast-close').first().click();
      await expect(page.locator('.sn-toast-item')).toHaveCount(0, { timeout: 1000 });
    });

    test('no-close-button toast has no close button element', async ({ page }) => {
      const d = demo(page, 'Sticky toast');
      await d.getByRole('button', { name: 'No close button' }).click();
      const toast = page.locator('.sn-toast-item').first();
      await expect(toast).toBeVisible();
      await expect(toast.locator('.sn-toast-close')).not.toBeAttached();
    });

    test('no-close-button toast auto-dismisses after its life', async ({ page }) => {
      const d = demo(page, 'Sticky toast');
      await d.getByRole('button', { name: 'No close button' }).click();
      await expect(page.locator('.sn-toast-item')).toHaveCount(1);
      await expect(page.locator('.sn-toast-item')).toHaveCount(0, { timeout: 4500 });
    });
  });

  test.describe('Corner positions', () => {
    test('the sn-toast outlet is present on the page with position class', async ({ page }) => {
      // The container is a fixed empty element when no toasts are active - check attachment, not visibility
      await expect(page.locator('sn-toast.sn-toast--top-right')).toBeAttached();
      await expect(page.locator('sn-toast.sn-toast--top-right')).toHaveAttribute('aria-live', 'polite');
    });
  });

  test.describe('Programmatic dismiss', () => {
    test('Clear all removes all active toasts', async ({ page }) => {
      const d = demo(page, 'Programmatic dismiss');
      await d.getByRole('button', { name: 'Add toast' }).click();
      await d.getByRole('button', { name: 'Add another' }).click();
      await expect(page.locator('.sn-toast-item')).toHaveCount(2);
      await d.getByRole('button', { name: 'Clear all' }).click();
      // dismiss() (no-arg) should mark all items hiding then remove them after exit animation;
      // allow 5 s - if this keeps failing it indicates a bug where _remove() is never called
      // for items dismissed via the no-arg dismiss() path (only requestClose() schedules _remove()).
      await expect(page.locator('.sn-toast-item')).toHaveCount(0, { timeout: 5000 });
    });
  });

  // Every button here fires three toasts, all sticky, so the count is the
  // assertion and no timer can race it.
  test.describe('Duplicate suppression', () => {
    test('three identical toasts stack by default', async ({ page }) => {
      const d = demo(page, 'preventDuplicates');
      await d.getByRole('button', { name: 'Fire 3 identical, stacking' }).click();
      await expect(page.locator('.sn-toast-item')).toHaveCount(3);
    });

    test('preventDuplicates collapses them to one', async ({ page }) => {
      const d = demo(page, 'preventDuplicates');
      await d.getByRole('button', { name: 'Fire 3 identical, suppressed' }).click();
      await expect(page.locator('.sn-toast-item')).toHaveCount(1);
    });

    test('a shared key collapses toasts whose detail differs', async ({ page }) => {
      const d = demo(page, 'preventDuplicates');
      await d.getByRole('button', { name: 'Fire 3 with a shared key' }).click();
      await expect(page.locator('.sn-toast-item')).toHaveCount(1);
      await expect(page.locator('.sn-toast-detail')).toContainText('attempt 1');
    });
  });
});
