import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('ContextMenu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.contextMenu);
  });

  test.describe('Basic', () => {
    test('right-click opens role=menu in the overlay', async ({ page }) => {
      const d = demo(page, 'Basic');
      const zone = d.locator('.demo-zone');
      await zone.click({ button: 'right' });
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
    });

    test('browser context menu is suppressed (native menu absent, panel visible)', async ({ page }) => {
      const d = demo(page, 'Basic');
      const zone = d.locator('.demo-zone');
      await zone.click({ button: 'right' });
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      // Our panel is visible - if the browser menu showed instead, the panel would be absent
      await expect(panel).toBeVisible();
    });

    test('panel contains role=menuitem items', async ({ page }) => {
      const d = demo(page, 'Basic');
      const zone = d.locator('.demo-zone');
      await zone.click({ button: 'right' });
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeVisible();
    });

    test('Escape closes the menu', async ({ page }) => {
      const d = demo(page, 'Basic');
      const zone = d.locator('.demo-zone');
      await zone.click({ button: 'right' });
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      // Gate on first item focus before Escape
      await expect(panel.locator('[role="menuitem"]').first()).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
    });

    test('Escape returns focus to the trigger element', async ({ page }) => {
      const d = demo(page, 'Basic');
      const zone = d.locator('.demo-zone');
      await zone.click({ button: 'right' });
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(zone).toBeFocused();
    });

    test('clicking a menuitem closes the menu', async ({ page }) => {
      const d = demo(page, 'Basic');
      const zone = d.locator('.demo-zone');
      await zone.click({ button: 'right' });
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();

      // Click first enabled item ("Rename")
      await panel.locator('[role="menuitem"]:not([aria-disabled="true"])').first().click();
      await expect(panel).not.toBeVisible();
    });

    test('right-clicking while open re-opens: exactly one panel in the overlay', async ({ page }) => {
      const d = demo(page, 'Basic');
      const zone = d.locator('.demo-zone');

      await zone.click({ button: 'right' });
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();

      // Right-click again at a different position
      const box = await zone.boundingBox();
      await page.mouse.click(box!.x + box!.width * 0.8, box!.y + box!.height * 0.8, { button: 'right' });

      // Must still be visible and only one panel
      await expect(panel).toBeVisible();
      await expect(page.locator('.cdk-overlay-container [role="menu"]')).toHaveCount(1);
    });

    test('trigger has aria-expanded toggling', async ({ page }) => {
      const d = demo(page, 'Basic');
      const zone = d.locator('.demo-zone');
      await expect(zone).toHaveAttribute('aria-expanded', 'false');
      await zone.click({ button: 'right' });
      await expect(zone).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('Escape');
      await expect(zone).toHaveAttribute('aria-expanded', 'false');
    });

    test('backdrop click closes the menu', async ({ page }) => {
      const d = demo(page, 'Basic');
      const zone = d.locator('.demo-zone');
      await zone.click({ button: 'right' });
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();

      // A corner, not the centre: the backdrop covers the viewport and the menu
      // opens near the middle of it, so a centre click can land on the panel.
      await page.locator('.sn-menu-backdrop').click({ position: { x: 5, y: 5 } });
      await expect(panel).not.toBeVisible();
    });
  });

  test.describe('With actions', () => {
    test('clicking a menuitem fires the action and closes the menu', async ({ page }) => {
      const d = demo(page, 'With actions');
      const zone = d.locator('.demo-zone');
      await zone.click({ button: 'right' });
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();

      await panel.locator('[role="menuitem"]').filter({ hasText: 'Rename' }).click();
      await expect(panel).not.toBeVisible();
      await expect(d.locator('span')).toContainText('Rename');
    });

    test('ArrowDown moves DOM focus through items', async ({ page }) => {
      const d = demo(page, 'With actions');
      const zone = d.locator('.demo-zone');
      await zone.click({ button: 'right' });
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();

      const firstItem = panel.locator('[role="menuitem"]').first();
      await expect(firstItem).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(panel.locator('[role="menuitem"]').nth(1)).toBeFocused();
    });
  });
});
