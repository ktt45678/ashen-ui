import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.dialog);
  });

  // "Basic" shares basicOpen with "Size variants"; use "With footer actions" for focus/close tests.

  test.describe('With footer actions', () => {
    test('clicking Open Dialog shows role=dialog with aria-modal=true', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Dialog' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    test('dialog has aria-labelledby pointing to the title', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Dialog' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      const labelledby = await dialog.getAttribute('aria-labelledby');
      expect(labelledby).toBeTruthy();
      const titleEl = page.locator(`#${labelledby}`);
      await expect(titleEl).toContainText('Edit Tile');
    });

    test('focus moves into the dialog on open', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Dialog' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      // CDK ConfigurableFocusTrap focuses first tabbable element (close button)
      await expect(dialog.locator('.sn-dialog-close-button')).toBeFocused();
    });

    test('Tab cycles focus within the dialog (focus trap)', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Dialog' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();

      await expect(dialog.locator('.sn-dialog-close-button')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(dialog.locator('button').filter({ hasText: 'Cancel' })).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(dialog.locator('button').filter({ hasText: 'Save' })).toBeFocused();

      // Tabbing past the last focusable must stay inside (focus trap)
      await page.keyboard.press('Tab');
      const focusInsideDialog = await page.evaluate(() => {
        const dlg = document.querySelector('.sn-dialog-panel');
        return dlg?.contains(document.activeElement) ?? false;
      });
      expect(focusInsideDialog).toBe(true);
    });

    test('close button closes the dialog', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Dialog' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('.sn-dialog-close-button').click();
      await expect(dialog).not.toBeVisible();
    });

    test('Escape closes the dialog', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      const opener = d.locator('button').filter({ hasText: 'Open Dialog' });
      await opener.click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.sn-dialog-close-button')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
    });

    test('focus returns to the opener after Escape', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      const opener = d.locator('button').filter({ hasText: 'Open Dialog' });
      await opener.click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.sn-dialog-close-button')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();
    });

    test('Cancel button closes the dialog', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Dialog' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('button').filter({ hasText: 'Cancel' }).click();
      await expect(dialog).not.toBeVisible();
    });

    test('Save button closes the dialog', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Dialog' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('button').filter({ hasText: 'Save' }).click();
      await expect(dialog).not.toBeVisible();
    });

    test('backdrop click closes the dialog', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Dialog' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await d.locator('.sn-dialog-mask').click({ position: { x: 10, y: 10 } });
      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe('Directive close - snDialogClose', () => {
    test('snDialogClose Save button closes the dialog', async ({ page }) => {
      const d = demo(page, 'Directive close - snDialogClose');
      await d.locator('button').filter({ hasText: 'Open Dialog' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('button').filter({ hasText: 'Save' }).click();
      await expect(dialog).not.toBeVisible();
    });

    test('focus returns to opener after snDialogClose', async ({ page }) => {
      const d = demo(page, 'Directive close - snDialogClose');
      const opener = d.locator('button').filter({ hasText: 'Open Dialog' });
      await opener.click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.locator('button').filter({ hasText: 'Cancel' }).click();
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();
    });
  });

  test.describe('Destructive action (error color)', () => {
    test('dialog opens with correct title', async ({ page }) => {
      const d = demo(page, 'Destructive action (error color)');
      await d.locator('button').filter({ hasText: 'Delete item' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.sn-dialog-title')).toContainText('Delete item');
    });

    test('Escape closes the dialog and returns focus', async ({ page }) => {
      const d = demo(page, 'Destructive action (error color)');
      const opener = d.locator('button').filter({ hasText: 'Delete item' });
      await opener.click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();
    });
  });

  test.describe('Size variants', () => {
    test('small dialog opens', async ({ page }) => {
      const d = demo(page, 'Size variants');
      await d.locator('button').filter({ hasText: 'Small' }).click();
      const dialog = d.locator('[role="dialog"].sn-dialog-panel--sm');
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    test('large dialog opens', async ({ page }) => {
      const d = demo(page, 'Size variants');
      await d.locator('button').filter({ hasText: 'Large' }).click();
      const dialog = d.locator('[role="dialog"].sn-dialog-panel--lg');
      await expect(dialog).toBeVisible();
    });
  });
});
