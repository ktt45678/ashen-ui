import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('TreeSelect', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.treeSelect);
  });

  test.describe('Basic with ngModel', () => {
    test('closed trigger shows placeholder text', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await expect(trigger.locator('.sn-select-placeholder')).toBeVisible();
      await expect(trigger.locator('.sn-select-placeholder')).toContainText('Select a file');
    });

    test('clicking trigger opens panel containing role=tree in overlay', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container .sn-tree-select-panel');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="tree"]')).toBeVisible();
    });

    test('focus moves into the tree after opening', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container .sn-tree-select-panel');
      await expect(panel).toBeVisible();
      // Focus init runs in setTimeout(0) - poll until it lands inside the panel
      await expect
        .poll(() =>
          page.evaluate(() => {
            const panelEl = document.querySelector('.sn-tree-select-panel');
            return panelEl?.contains(document.activeElement) ?? false;
          }),
        )
        .toBe(true);
    });

    test('clicking a parent node expands it (aria-expanded toggles) and does NOT close panel', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container .sn-tree-select-panel');
      await expect(panel).toBeVisible();

      // Find the 'src' parent treeitem
      const srcItem = panel.locator('[role="treeitem"]').filter({ hasText: 'src' }).first();
      await expect(srcItem).toHaveAttribute('aria-expanded', 'false');

      await srcItem.click();

      // Panel must stay open
      await expect(panel).toBeVisible();
      // src node should now be expanded
      await expect(srcItem).toHaveAttribute('aria-expanded', 'true');
    });

    test('clicking a parent node does NOT commit a value', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container .sn-tree-select-panel');
      await expect(panel).toBeVisible();

      const srcItem = panel.locator('[role="treeitem"]').filter({ hasText: 'src' }).first();
      await srcItem.click();

      // Placeholder must still be visible - no value selected
      await expect(panel).toBeVisible();
      const placeholder = trigger.locator('.sn-select-placeholder');
      // Panel is still open - check the placeholder is not replaced after we close
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(placeholder).toBeVisible();
    });

    test('clicking a leaf node commits the value and closes the panel', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container .sn-tree-select-panel');
      await expect(panel).toBeVisible();

      // Expand 'src' then pick 'main.ts' (a leaf at src level)
      const srcItem = panel.locator('[role="treeitem"]').filter({ hasText: 'src' }).first();
      await srcItem.click();
      await expect(srcItem).toHaveAttribute('aria-expanded', 'true');

      const mainTs = panel.locator('[role="treeitem"]').filter({ hasText: 'main.ts' }).first();
      await mainTs.click();

      await expect(panel).not.toBeVisible();
      await expect(trigger.locator('.sn-select-value')).toContainText('main.ts');
    });

    test('Escape closes panel without committing a value', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container .sn-tree-select-panel');
      await expect(panel).toBeVisible();
      // Wait for focus to reach the tree before pressing Escape
      await expect(panel.locator('[role="treeitem"][tabindex="0"]')).toBeVisible();

      await page.keyboard.press('Escape');

      await expect(panel).not.toBeVisible();
      await expect(trigger.locator('.sn-select-placeholder')).toBeVisible();
    });

    test('reopening shows the selected leaf marked aria-selected="true"', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');

      // Open, expand src, pick main.ts
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container .sn-tree-select-panel');
      await expect(panel).toBeVisible();

      const srcItem = panel.locator('[role="treeitem"]').filter({ hasText: 'src' }).first();
      await srcItem.click();
      await expect(srcItem).toHaveAttribute('aria-expanded', 'true');

      const mainTs = panel.locator('[role="treeitem"]').filter({ hasText: 'main.ts' }).first();
      await mainTs.click();
      await expect(panel).not.toBeVisible();

      // Reopen
      await trigger.click();
      await expect(panel).toBeVisible();

      const selected = panel.locator('[role="treeitem"][aria-selected="true"]');
      await expect(selected).toHaveCount(1);
      await expect(selected).toContainText('main.ts');
    });
  });

  test.describe('Pre-expanded via [(expandedKeys)]', () => {
    test('panel opens with pre-expanded branches visible', async ({ page }) => {
      const d = demo(page, 'Pre-expanded via [(expandedKeys)]');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container .sn-tree-select-panel');
      await expect(panel).toBeVisible();

      // 'src' and 'app' are pre-expanded - app.ts should be directly visible
      const appTs = panel.locator('[role="treeitem"]').filter({ hasText: 'app.ts' }).first();
      await expect(appTs).toBeVisible();
    });
  });
});
