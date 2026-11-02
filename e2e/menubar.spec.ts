import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Menubar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.menubar);
  });

  test.describe('Basic', () => {
    test('role=menubar is present with role=menuitem top-level items', async ({ page }) => {
      const d = demo(page, 'Basic');
      const menubar = d.locator('[role="menubar"]');
      await expect(menubar).toBeVisible();
      const items = menubar.locator('[role="menuitem"]');
      await expect(items).toHaveCount(3);
    });

    test('first item has tabindex=0, others have tabindex=-1 (roving tabindex)', async ({ page }) => {
      const d = demo(page, 'Basic');
      const items = d.locator('[role="menubar"] [role="menuitem"]');
      await expect(items.nth(0)).toHaveAttribute('tabindex', '0');
      await expect(items.nth(1)).toHaveAttribute('tabindex', '-1');
      await expect(items.nth(2)).toHaveAttribute('tabindex', '-1');
    });

    test('ArrowRight moves DOM focus to next top-level item', async ({ page }) => {
      const d = demo(page, 'Basic');
      const items = d.locator('[role="menubar"] [role="menuitem"]');
      await items.nth(0).focus();
      await expect(items.nth(0)).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(items.nth(1)).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(items.nth(2)).toBeFocused();
    });

    test('ArrowLeft moves DOM focus to previous top-level item', async ({ page }) => {
      const d = demo(page, 'Basic');
      const items = d.locator('[role="menubar"] [role="menuitem"]');
      // Click item 1 to sync the key manager, then gate on focus landing
      await items.nth(1).click();
      // Clicking an item with a submenu opens the panel - close it first
      await page.keyboard.press('Escape');
      await expect(items.nth(1)).toBeFocused();
      await page.keyboard.press('ArrowLeft');
      await expect(items.nth(0)).toBeFocused();
    });

    test('ArrowRight wraps from last to first item', async ({ page }) => {
      const d = demo(page, 'Basic');
      const items = d.locator('[role="menubar"] [role="menuitem"]');
      // Navigate from item 0 to item 2 via keyboard (keeps key manager in sync)
      await items.nth(0).click();
      await page.keyboard.press('Escape');
      await expect(items.nth(0)).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(items.nth(1)).toBeFocused();
      await page.keyboard.press('Escape');
      await page.keyboard.press('ArrowRight');
      await expect(items.nth(2)).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(items.nth(0)).toBeFocused();
    });

    test('ArrowLeft wraps from first to last item', async ({ page }) => {
      const d = demo(page, 'Basic');
      const items = d.locator('[role="menubar"] [role="menuitem"]');
      await items.nth(0).click();
      // Clicking File opens a submenu - close it
      await page.keyboard.press('Escape');
      await expect(items.nth(0)).toBeFocused();
      await page.keyboard.press('ArrowLeft');
      await expect(items.nth(2)).toBeFocused();
    });

    test('clicking a top-level item with a submenu opens a role=menu panel in the overlay', async ({ page }) => {
      const d = demo(page, 'Basic');
      const fileItem = d.locator('[role="menubar"] [role="menuitem"]').nth(0);
      await fileItem.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeVisible();
    });

    test('submenu panel appears below the triggering top-level item (aria-expanded=true)', async ({ page }) => {
      const d = demo(page, 'Basic');
      const fileItem = d.locator('[role="menubar"] [role="menuitem"]').nth(0);
      await expect(fileItem).toHaveAttribute('aria-expanded', 'false');
      await fileItem.click();
      await expect(fileItem).toHaveAttribute('aria-expanded', 'true');
      await page.locator('.sn-menubar-backdrop').click({ force: true });
      await expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });

    test('ArrowDown from top-level item opens submenu and moves focus to first item', async ({ page }) => {
      const d = demo(page, 'Basic');
      const fileItem = d.locator('[role="menubar"] [role="menuitem"]').nth(0);
      await fileItem.focus();
      await expect(fileItem).toBeFocused();
      await page.keyboard.press('ArrowDown');
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeFocused();
    });

    test('Escape closes submenu and returns focus to the top-level item', async ({ page }) => {
      const d = demo(page, 'Basic');
      const fileItem = d.locator('[role="menubar"] [role="menuitem"]').nth(0);
      await fileItem.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(fileItem).toBeFocused();
    });

    test('clicking a leaf menuitem closes everything', async ({ page }) => {
      const d = demo(page, 'Basic');
      const fileItem = d.locator('[role="menubar"] [role="menuitem"]').nth(0);
      await fileItem.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await panel.locator('[role="menuitem"]').first().click();
      await expect(panel).not.toBeVisible();
    });

    test('top-level item with submenu has aria-haspopup=menu and aria-controls', async ({ page }) => {
      const d = demo(page, 'Basic');
      const fileItem = d.locator('[role="menubar"] [role="menuitem"]').nth(0);
      await expect(fileItem).toHaveAttribute('aria-haspopup', 'menu');
      await expect(fileItem).toHaveAttribute('aria-controls', /\S/);
    });

    test('top-level leaf item (no submenu) has no aria-haspopup', async ({ page }) => {
      const d = demo(page, 'Basic');
      // "Help" is index 2, no menuFor
      const helpItem = d.locator('[role="menubar"] [role="menuitem"]').nth(2);
      await expect(helpItem).not.toHaveAttribute('aria-haspopup');
    });

    test('hovering across top-level items while one submenu is open switches submenus', async ({ page }) => {
      const d = demo(page, 'Basic');
      const items = d.locator('[role="menubar"] [role="menuitem"]');
      await items.nth(0).click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      // The CDK transparent backdrop intercepts pointer events, so dispatch mouseenter directly
      // on the Edit button to simulate the hover-switch that _onMouseEnter implements.
      await items.nth(1).dispatchEvent('mouseenter');
      await expect(panel).toBeVisible();
      await expect(panel.getByRole('menuitem', { name: /Undo/ })).toBeVisible();
    });

    test('submenu ArrowDown moves focus through items', async ({ page }) => {
      const d = demo(page, 'Basic');
      const fileItem = d.locator('[role="menubar"] [role="menuitem"]').nth(0);
      await fileItem.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel.locator('[role="menuitem"]').first()).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(panel.locator('[role="menuitem"]').nth(1)).toBeFocused();
    });

    test('ArrowRight while submenu is open closes it and opens the next top-level item submenu', async ({ page }) => {
      const d = demo(page, 'Basic');
      const items = d.locator('[role="menubar"] [role="menuitem"]');
      await items.nth(0).click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeFocused();
      // APG: ArrowRight closes current submenu and opens the next top-level item's submenu
      await page.keyboard.press('ArrowRight');
      // Edit submenu should now be open (it has Undo as first item)
      await expect(panel.getByRole('menuitem', { name: /Undo/ })).toBeVisible();
      await expect(items.nth(1)).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test.describe('With icons on top-level items', () => {
    test('top-level items render with icons and open submenus on click', async ({ page }) => {
      const d = demo(page, 'With icons on top-level items');
      const fileItem = d.locator('[role="menubar"] [role="menuitem"]').nth(0);
      await expect(fileItem.locator('.sn-menubar-item-icon')).toBeVisible();
      await fileItem.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]')).toHaveCount(3);
    });
  });

  test.describe('Items without submenus (activated event)', () => {
    test('leaf items have no aria-haspopup and no arrow icon', async ({ page }) => {
      const d = demo(page, 'Items without submenus (activated event)');
      const items = d.locator('[role="menubar"] [role="menuitem"]');
      await expect(items).toHaveCount(3);
      for (let i = 0; i < 3; i++) {
        await expect(items.nth(i)).not.toHaveAttribute('aria-haspopup');
        await expect(items.nth(i).locator('.sn-menubar-item-arrow')).not.toBeAttached();
      }
    });
  });
});
