import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Popover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.popover);
  });

  test.describe('Basic', () => {
    test('clicking trigger opens role=dialog panel in overlay with projected content', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(panel).toContainText('Quick settings panel');
    });

    test('trigger has aria-haspopup=dialog', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    });

    test('trigger aria-expanded toggles on open and close', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('trigger has aria-controls referencing the panel', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await expect(trigger).toHaveAttribute('aria-controls', /\S/);
      const controlsId = await trigger.getAttribute('aria-controls');
      await trigger.click();
      const panel = page.locator(`.cdk-overlay-container [role="dialog"][id="${controlsId}"]`);
      await expect(panel).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-controls', controlsId!);
    });

    test('clicking outside closes the popover', async ({ page }) => {
      const d = demo(page, 'Basic');
      await d.getByRole('button', { name: 'Options' }).click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await page.locator('.sn-popover-backdrop').click({ position: { x: 10, y: 10 } });
      await expect(panel).not.toBeVisible();
    });

    test('Escape closes the popover and returns focus to trigger', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });

    test('popover can be reopened after close', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      await trigger.click();
      await expect(panel).toBeVisible();
      await expect(panel).toContainText('Quick settings panel');
    });

    test('Done button inside popover closes it', async ({ page }) => {
      const d = demo(page, 'Basic');
      await d.getByRole('button', { name: 'Options' }).click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await panel.getByRole('button', { name: 'Done' }).click();
      await expect(panel).not.toBeVisible();
    });

    test('focus moves into the panel on open', async ({ page }) => {
      const d = demo(page, 'Basic');
      await d.getByRole('button', { name: 'Options' }).click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await expect.poll(async () => {
        return page.evaluate(() => {
          const el = document.querySelector('.sn-popover-panel');
          return el?.contains(document.activeElement) ?? false;
        });
      }, { timeout: 2000 }).toBe(true);
    });
  });

  test.describe('Directive close - snPopoverClose', () => {
    test('snPopoverClose button closes the popover', async ({ page }) => {
      const d = demo(page, 'Directive close - snPopoverClose');
      await d.getByRole('button', { name: 'Options' }).click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await panel.getByRole('button', { name: 'Done' }).click();
      await expect(panel).not.toBeVisible();
    });
  });

  test.describe('Positions', () => {
    test('bottom popover opens and shows content', async ({ page }) => {
      const d = demo(page, 'Positions');
      await d.getByRole('button', { name: 'Bottom' }).click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(panel).toContainText('Anchored below');
      await page.keyboard.press('Escape');
    });

    test('top popover opens and shows content', async ({ page }) => {
      const d = demo(page, 'Positions');
      await d.getByRole('button', { name: 'Top' }).click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(panel).toContainText('Anchored above');
      await page.keyboard.press('Escape');
    });
  });

  test.describe('Controlled open state', () => {
    test('open model binding reflects state in UI', async ({ page }) => {
      const d = demo(page, 'Controlled open state');
      const trigger = d.getByRole('button', { name: 'Toggle' });
      await expect(d.locator('span')).toContainText('open = false');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(d.locator('span')).toContainText('open = true');
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(d.locator('span')).toContainText('open = false');
    });
  });
});
