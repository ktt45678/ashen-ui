import { test, expect, type Page, type Locator } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

function treeItem(page: Page, d: Locator, label: string) {
  return d.locator('[role="treeitem"]').filter({
    has: page.locator('.sn-tree-label', { hasText: label }),
  });
}

test.describe('Tree', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.tree);
  });

  test.describe('Basic file explorer', () => {
    test('host has role=tree', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      await expect(d.locator('sn-tree')).toHaveAttribute('role', 'tree');
    });

    test('visible items have role=treeitem', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const items = d.locator('[role="treeitem"]');
      await expect(items.first()).toBeVisible();
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    test('items carry aria-level, aria-setsize, aria-posinset', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const first = d.locator('[role="treeitem"]').first();
      await expect(first).toHaveAttribute('aria-level', '1');
      await expect(first).toHaveAttribute('aria-setsize');
      await expect(first).toHaveAttribute('aria-posinset');
    });

    test('exactly one treeitem has tabindex=0 (roving tabindex)', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const items = d.locator('[role="treeitem"]');
      await expect(items.first()).toBeVisible();
      const all = await items.all();
      const tabIndices = await Promise.all(all.map((el) => el.getAttribute('tabindex')));
      const zeroCount = tabIndices.filter((t) => t === '0').length;
      expect(zeroCount).toBe(1);
    });

    test('collapsed parent has aria-expanded=false', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const publicItem = treeItem(page, d, 'public').first();
      await expect(publicItem).toHaveAttribute('aria-expanded', 'false');
    });

    test('clicking a toggle button expands a collapsed parent', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const publicItem = treeItem(page, d, 'public').first();
      await expect(publicItem).toHaveAttribute('aria-expanded', 'false');
      await publicItem.locator('button.sn-tree-toggle').click();
      await expect(publicItem).toHaveAttribute('aria-expanded', 'true');
      await expect(treeItem(page, d, 'favicon.ico').first()).toBeVisible();
    });

    test('clicking an expanded toggle collapses the parent', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const srcItem = treeItem(page, d, 'src').first();
      await srcItem.locator('button.sn-tree-toggle').click();
      await expect(srcItem).toHaveAttribute('aria-expanded', 'true');
      await srcItem.locator('button.sn-tree-toggle').click();
      await expect(srcItem).toHaveAttribute('aria-expanded', 'false');
    });

    test('leaf nodes do not have aria-expanded', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const leaf = treeItem(page, d, 'angular.json').first();
      await expect(leaf).not.toHaveAttribute('aria-expanded');
    });

    test('keyboard: ArrowDown moves DOM focus to next visible item', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      // Visible root items (all collapsed): src, public, angular.json
      const srcItem = treeItem(page, d, 'src').first();
      const publicItem = treeItem(page, d, 'public').first();
      await srcItem.focus();
      await expect(srcItem).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(publicItem).toBeFocused();
    });

    test('keyboard: ArrowRight expands a collapsed parent', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const srcItem = treeItem(page, d, 'src').first();
      await srcItem.focus();
      await expect(srcItem).toHaveAttribute('aria-expanded', 'false');
      await page.keyboard.press('ArrowRight');
      await expect(srcItem).toHaveAttribute('aria-expanded', 'true');
    });

    test('keyboard: ArrowRight on expanded parent moves focus into first child', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const srcItem = treeItem(page, d, 'src').first();
      await srcItem.focus();
      await page.keyboard.press('ArrowRight'); // expand
      await expect(srcItem).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('ArrowRight'); // move to first child
      const appItem = treeItem(page, d, 'app').first();
      await expect(appItem).toBeFocused();
    });

    test('keyboard: ArrowLeft collapses an expanded parent', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const srcItem = treeItem(page, d, 'src').first();
      await srcItem.focus();
      await page.keyboard.press('ArrowRight'); // expand
      await expect(srcItem).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('ArrowLeft'); // collapse
      await expect(srcItem).toHaveAttribute('aria-expanded', 'false');
      await expect(srcItem).toBeFocused();
    });

    test('keyboard: Home moves focus to the first visible item', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const leafItem = treeItem(page, d, 'angular.json').first();
      const srcItem = treeItem(page, d, 'src').first();
      await leafItem.focus();
      await page.keyboard.press('Home');
      await expect(srcItem).toBeFocused();
    });

    test('keyboard: End moves focus to the last visible item', async ({ page }) => {
      const d = demo(page, 'Basic file explorer');
      const srcItem = treeItem(page, d, 'src').first();
      const leafItem = treeItem(page, d, 'angular.json').first();
      await srcItem.focus();
      await page.keyboard.press('End');
      await expect(leafItem).toBeFocused();
    });
  });

  test.describe('Selection binding', () => {
    test('clicking a node sets aria-selected=true on it', async ({ page }) => {
      const d = demo(page, 'Selection binding');
      const leaf = treeItem(page, d, 'angular.json').first();
      await leaf.click();
      await expect(leaf).toHaveAttribute('aria-selected', 'true');
    });

    test('clicking a node clears aria-selected from the previous node', async ({ page }) => {
      const d = demo(page, 'Selection binding');
      const srcItem = treeItem(page, d, 'src').first();
      const leafItem = treeItem(page, d, 'angular.json').first();
      await srcItem.click();
      await expect(srcItem).toHaveAttribute('aria-selected', 'true');
      await leafItem.click();
      await expect(srcItem).toHaveAttribute('aria-selected', 'false');
      await expect(leafItem).toHaveAttribute('aria-selected', 'true');
    });

    test('clicking a node updates the demo-note', async ({ page }) => {
      const d = demo(page, 'Selection binding');
      const leaf = treeItem(page, d, 'angular.json').first();
      await leaf.click();
      await expect(d.locator('.demo-note')).toContainText('angular.json');
    });

    test('keyboard: Enter selects the focused node', async ({ page }) => {
      const d = demo(page, 'Selection binding');
      const leaf = treeItem(page, d, 'angular.json').first();
      await leaf.focus();
      await page.keyboard.press('Enter');
      await expect(leaf).toHaveAttribute('aria-selected', 'true');
    });

    test('keyboard: Space selects the focused node', async ({ page }) => {
      const d = demo(page, 'Selection binding');
      const leaf = treeItem(page, d, 'angular.json').first();
      await leaf.focus();
      await page.keyboard.press('Space');
      await expect(leaf).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('Controlled expansion', () => {
    test('"src" is pre-expanded, showing children', async ({ page }) => {
      const d = demo(page, 'Controlled expansion');
      const srcItem = treeItem(page, d, 'src').first();
      await expect(srcItem).toHaveAttribute('aria-expanded', 'true');
      await expect(treeItem(page, d, 'main.ts').first()).toBeVisible();
    });

    test('Expand all button makes all parents expanded', async ({ page }) => {
      const d = demo(page, 'Controlled expansion');
      await d.locator('.demo-btn').filter({ hasText: 'Expand all' }).click();
      const appItem = treeItem(page, d, 'app').first();
      await expect(appItem).toHaveAttribute('aria-expanded', 'true');
      await expect(treeItem(page, d, 'app.ts').first()).toBeVisible();
    });

    test('Collapse all button hides all children', async ({ page }) => {
      const d = demo(page, 'Controlled expansion');
      await d.locator('.demo-btn').filter({ hasText: 'Collapse all' }).click();
      const srcItem = treeItem(page, d, 'src').first();
      await expect(srcItem).toHaveAttribute('aria-expanded', 'false');
      await expect(treeItem(page, d, 'main.ts').first()).not.toBeVisible();
    });
  });
});
