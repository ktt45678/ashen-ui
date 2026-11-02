import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.menu);
  });

  test.describe('Basic', () => {
    test('clicking trigger opens role=menu panel in overlay with role=menuitem items', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeVisible();
    });

    test('trigger aria-expanded toggles on open and close', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      // Backdrop sits in front of the trigger; close via Escape
      await page.keyboard.press('Escape');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('ArrowDown moves DOM focus through menuitems', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();

      // Gate on key manager init - first item receives focus
      const firstItem = panel.locator('[role="menuitem"]').first();
      await expect(firstItem).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(panel.locator('[role="menuitem"]').nth(1)).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(panel.locator('[role="menuitem"]').nth(2)).toBeFocused();
    });

    test('clicking a menuitem closes the menu', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();

      await panel.locator('[role="menuitem"]').first().click();
      await expect(panel).not.toBeVisible();
    });

    test('Escape closes and returns focus to trigger', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });

    test('clicking the backdrop closes the menu', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();

      await page.locator('.sn-menu-backdrop').click({ force: true });
      await expect(panel).not.toBeVisible();
    });

    test('trigger has aria-haspopup=menu and aria-controls', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Options' });
      await expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
      await expect(trigger).toHaveAttribute('aria-controls', /\S/);
    });
  });

  test.describe('With icons', () => {
    test('panel opens with role=menuitem items', async ({ page }) => {
      const d = demo(page, 'With icons');
      const trigger = d.getByRole('button', { name: 'File' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]')).toHaveCount(4);
    });
  });

  test.describe('With separators', () => {
    test('panel contains role=separator elements', async ({ page }) => {
      const d = demo(page, 'With separators');
      const trigger = d.getByRole('button', { name: 'Actions' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="separator"]')).toHaveCount(2);
    });
  });

  test.describe('Disabled items', () => {
    test('disabled menuitem has aria-disabled=true', async ({ page }) => {
      const d = demo(page, 'Disabled items');
      const trigger = d.getByRole('button', { name: 'Permission-gated' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      const disabledItems = panel.locator('[role="menuitem"][aria-disabled="true"]');
      await expect(disabledItems).toHaveCount(2);
    });

    test('ArrowDown skips disabled items', async ({ page }) => {
      const d = demo(page, 'Disabled items');
      const trigger = d.getByRole('button', { name: 'Permission-gated' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();

      // Gate: first enabled item ("Edit") gets focus
      const firstEnabled = panel.locator('[role="menuitem"]:not([aria-disabled="true"])').first();
      await expect(firstEnabled).toBeFocused();

      // ArrowDown should skip "Duplicate (no permission)" and land on "Move"
      await page.keyboard.press('ArrowDown');
      const nextEnabled = panel.locator('[role="menuitem"]:not([aria-disabled="true"])').nth(1);
      await expect(nextEnabled).toBeFocused();
    });
  });

  test.describe('With keyboard shortcuts', () => {
    test('shortcut hints are visible in the panel', async ({ page }) => {
      const d = demo(page, 'With keyboard shortcuts');
      const trigger = d.getByRole('button', { name: 'Edit' });
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('.sn-menu-shortcut').first()).toBeVisible();
    });
  });
});
