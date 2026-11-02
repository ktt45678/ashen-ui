import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('ConfirmPopup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.confirmPopup);
  });

  test.describe('Destructive action (error severity)', () => {
    test('clicking trigger opens role=alertdialog anchored popup', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      const trigger = d.getByRole('button', { name: 'Delete tile' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
    });

    test('popup shows the configured message', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete tile' }).click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('.sn-confirm-popup-message')).toHaveText('Delete this tile?');
    });

    test('panel has aria-describedby referencing the message element', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      const trigger = d.getByRole('button', { name: 'Delete tile' });
      await expect(trigger).toHaveAttribute('aria-controls', /\S/);
      const panelId = await trigger.getAttribute('aria-controls');
      await trigger.click();
      const panel = page.locator(`.cdk-overlay-container [role="alertdialog"][id="${panelId}"]`);
      await expect(panel).toBeVisible();
      const describedby = await panel.getAttribute('aria-describedby');
      expect(describedby).toBeTruthy();
      await expect(page.locator(`#${describedby}`)).toHaveText('Delete this tile?');
    });

    test('trigger has aria-haspopup=dialog, aria-expanded, and aria-controls', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      const trigger = d.getByRole('button', { name: 'Delete tile' });
      await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(trigger).toHaveAttribute('aria-controls', /\S/);
    });

    test('trigger aria-expanded becomes true when popup is open', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      const trigger = d.getByRole('button', { name: 'Delete tile' });
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('popup is positioned near the trigger', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      const trigger = d.getByRole('button', { name: 'Delete tile' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();

      const triggerBox = await trigger.boundingBox();
      expect(triggerBox).not.toBeNull();

      await expect
        .poll(async () => {
          const box = await panel.boundingBox();
          if (!box || !triggerBox) return Number.NaN;
          const panelCenterX = box.x + box.width / 2;
          const triggerCenterX = triggerBox.x + triggerBox.width / 2;
          return Math.abs(panelCenterX - triggerCenterX);
        })
        .toBeLessThan(300);
    });

    test('focus moves to Reject button on open', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete tile' }).click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      // BUG: ConfirmPopupPanel.focusRejectButton() calls el.focus() in a setTimeout(0)
      // but focus never transfers to the overlay panel in practice - document.activeElement
      // remains on the trigger. Intended behavior per the source and a11y docs is that
      // focus should land on the least-destructive (Reject) button.
      await expect(panel.getByRole('button', { name: 'Cancel' })).toBeFocused({ timeout: 3000 });
    });

    test('Accept (Delete) button closes popup and shows accepted state', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete tile' }).click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      await panel.getByRole('button', { name: 'Delete' }).click();
      await expect(panel).not.toBeVisible();
      await expect(d.locator('.demo-status')).toContainText('Delete');
    });

    test('Reject (Cancel) button closes popup and shows rejected state', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete tile' }).click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      await panel.getByRole('button', { name: 'Cancel' }).click();
      await expect(panel).not.toBeVisible();
      // Reject button emits reject output; the page shows a status for it
      await expect(d.locator('.demo-status')).toContainText('Delete');
    });

    test('Escape closes the popup without emitting reject', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete tile' }).click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      // Escape is neutral dismissal - no demo-status shown
      await expect(d.locator('.demo-status')).not.toBeVisible();
    });

    test('clicking outside closes the popup without emitting reject', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      await d.getByRole('button', { name: 'Delete tile' }).click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      await page.locator('.sn-confirm-popup-backdrop').click({ position: { x: 10, y: 10 } });
      await expect(panel).not.toBeVisible();
      await expect(d.locator('.demo-status')).not.toBeVisible();
    });

    test('focus returns to trigger after close', async ({ page }) => {
      const d = demo(page, 'Destructive action (error severity)');
      const trigger = d.getByRole('button', { name: 'Delete tile' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });
  });

  test.describe('Primary confirmation (default severity)', () => {
    test('popup opens with default labels (Yes / Cancel)', async ({ page }) => {
      const d = demo(page, 'Primary confirmation (default severity)');
      await d.getByRole('button', { name: 'Save changes' }).click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      await expect(panel.getByRole('button', { name: 'Yes' })).toBeVisible();
      await expect(panel.getByRole('button', { name: 'Cancel' })).toBeVisible();
    });

    test('Accept (Yes) closes popup', async ({ page }) => {
      const d = demo(page, 'Primary confirmation (default severity)');
      await d.getByRole('button', { name: 'Save changes' }).click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      await panel.getByRole('button', { name: 'Yes' }).click();
      await expect(panel).not.toBeVisible();
    });
  });

  test.describe('Warning severity', () => {
    test('popup shows warning icon class', async ({ page }) => {
      const d = demo(page, 'Warning severity');
      await d.getByRole('button', { name: 'Reset layout' }).click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('.sn-confirm-popup-icon--warning')).toBeVisible();
    });
  });

  test.describe('Custom labels and success severity', () => {
    test('custom acceptLabel and rejectLabel are shown', async ({ page }) => {
      const d = demo(page, 'Custom labels and success severity');
      await d.getByRole('button', { name: 'Publish tile' }).click();
      const panel = page.locator('.cdk-overlay-container [role="alertdialog"]');
      await expect(panel).toBeVisible();
      await expect(panel.getByRole('button', { name: 'Publish now' })).toBeVisible();
      await expect(panel.getByRole('button', { name: 'Not yet' })).toBeVisible();
    });
  });
});
