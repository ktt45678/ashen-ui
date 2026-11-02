import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('ConfirmDialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.confirmDialog);
  });

  test.describe('Destructive action (error severity)', () => {
    test('clicking action button opens role=dialog with aria-modal=true', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete item' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    test('dialog shows the configured message', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete item' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.sn-confirm-dialog-message')).toContainText(
        'This removes "Play Music" from Grid 1',
      );
    });

    test('dialog has aria-labelledby pointing to the header title', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete item' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      const labelledby = await dialog.getAttribute('aria-labelledby');
      expect(labelledby).toBeTruthy();
      await expect(page.locator(`#${labelledby}`)).toContainText('Delete item');
    });

    test('focus moves inside the dialog on open', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete item' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.sn-dialog-close-button')).toBeFocused();
    });

    test('Accept (Delete) button closes dialog and shows accepted state', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete item' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'Delete' }).click();
      await expect(dialog).not.toBeVisible();
      await expect(d.locator('.demo-status')).toContainText('Delete');
    });

    test('Reject (Cancel) button closes dialog and shows rejected state', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete item' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'Cancel' }).click();
      await expect(dialog).not.toBeVisible();
      await expect(d.locator('.demo-status')).toContainText('Delete cancelled');
    });

    test('Escape closes dialog and emits reject (shows cancelled state)', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      const opener = d.getByRole('button', { name: 'Delete item' });
      await opener.click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(d.locator('.demo-status')).toContainText('Delete cancelled');
    });

    test('focus returns to opener after close', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      const opener = d.getByRole('button', { name: 'Delete item' });
      await opener.click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();
    });

    test('backdrop click closes dialog and returns focus to opener', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      const opener = d.getByRole('button', { name: 'Delete item' });
      await opener.click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await d.locator('.sn-dialog-mask').click({ position: { x: 10, y: 10 } });
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();
    });
  });

  test.describe('Primary confirmation (default severity)', () => {
    test('dialog opens with the configured message', async ({ page }) => {
      const d = demo(page, 'Primary confirmation (default severity)');
      await d.getByRole('button', { name: 'Save changes' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.sn-confirm-dialog-message')).toContainText(
        'Your unsaved changes will be applied',
      );
    });

    test('default accept label is Yes', async ({ page }) => {
      const d = demo(page, 'Primary confirmation (default severity)');
      await d.getByRole('button', { name: 'Save changes' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Yes' })).toBeVisible();
    });

    test('default reject label is Cancel', async ({ page }) => {
      const d = demo(page, 'Primary confirmation (default severity)');
      await d.getByRole('button', { name: 'Save changes' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    test('Accept (Yes) closes dialog', async ({ page }) => {
      const d = demo(page, 'Primary confirmation (default severity)');
      await d.getByRole('button', { name: 'Save changes' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await dialog.getByRole('button', { name: 'Yes' }).click();
      await expect(dialog).not.toBeVisible();
    });
  });

  test.describe('Warning severity', () => {
    test('dialog opens with warning icon class', async ({ page }) => {
      const d = demo(page, 'Warning severity');
      await d.getByRole('button', { name: 'Reset layout' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.locator('.sn-confirm-dialog-icon--warning')).toBeVisible();
    });
  });

  test.describe('Custom labels and success severity', () => {
    test('custom acceptLabel and rejectLabel are shown', async ({ page }) => {
      const d = demo(page, 'Custom labels and success severity');
      await d.getByRole('button', { name: 'Publish tile' }).click();
      const dialog = d.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Publish now' })).toBeVisible();
      await expect(dialog.getByRole('button', { name: 'Not yet' })).toBeVisible();
    });
  });
});
