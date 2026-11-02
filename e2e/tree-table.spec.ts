import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('TreeTable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.treeTable);
  });

  test.describe('Basic file system', () => {
    test('inner table carries role=treegrid', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      await expect(d.locator('table[role="treegrid"]')).toBeVisible();
    });

    test('column headers are rendered with scope=col', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const headers = d.locator('thead th');
      await expect(headers).toHaveCount(3);
      await expect(headers.nth(0)).toHaveAttribute('scope', 'col');
      await expect(headers.nth(0)).toContainText('Name');
      await expect(headers.nth(1)).toContainText('Size');
      await expect(headers.nth(2)).toContainText('Modified');
    });

    test('rows carry role=row with aria-level', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const rows = d.locator('tbody [role="row"]');
      await expect(rows.first()).toBeVisible();
      await expect(rows.first()).toHaveAttribute('aria-level', '1');
    });

    test('rows carry aria-setsize and aria-posinset', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const firstRow = d.locator('tbody [role="row"]').first();
      await expect(firstRow).toHaveAttribute('aria-setsize');
      await expect(firstRow).toHaveAttribute('aria-posinset');
    });

    test('root-level parent row has aria-expanded=false initially', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      // 'public' row is collapsed by default (src may also start collapsed in this example)
      const rows = d.locator('tbody [role="row"]');
      await expect(rows.first()).toBeVisible();
      // src row at level 1 should have aria-expanded
      const srcRow = rows.filter({ hasText: 'src' }).first();
      await expect(srcRow).toHaveAttribute('aria-expanded', 'false');
    });

    test('exactly one row has tabindex=0 (roving tabindex)', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const rows = d.locator('tbody [role="row"]');
      await expect(rows.first()).toBeVisible();
      const all = await rows.all();
      const tabIndices = await Promise.all(all.map((r) => r.getAttribute('tabindex')));
      const zeroCount = tabIndices.filter((t) => t === '0').length;
      expect(zeroCount).toBe(1);
    });

    test('leaf rows do not have aria-expanded', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      // angular.json is a leaf at root level
      const leafRow = d.locator('tbody [role="row"]').filter({ hasText: 'angular.json' }).first();
      await expect(leafRow).not.toHaveAttribute('aria-expanded');
    });

    test('concrete cell content: angular.json row shows 12 KB and 2026-06-20', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const leafRow = d.locator('tbody [role="row"]').filter({ hasText: 'angular.json' }).first();
      await expect(leafRow).toContainText('12 KB');
      await expect(leafRow).toContainText('2026-06-20');
    });

    test('clicking toggle button on a parent row expands it and shows child rows', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const srcRow = d.locator('tbody [role="row"]').filter({ hasText: 'src' }).first();
      await expect(srcRow).toHaveAttribute('aria-expanded', 'false');
      await srcRow.locator('button.sn-tree-table-toggle').click();
      await expect(srcRow).toHaveAttribute('aria-expanded', 'true');
      // child row 'main.ts' should now be visible
      const mainRow = d.locator('tbody [role="row"]').filter({ hasText: 'main.ts' }).first();
      await expect(mainRow).toBeVisible();
    });

    test('clicking toggle button on an expanded parent collapses it and hides children', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const srcRow = d.locator('tbody [role="row"]').filter({ hasText: 'src' }).first();
      await srcRow.locator('button.sn-tree-table-toggle').click();
      await expect(srcRow).toHaveAttribute('aria-expanded', 'true');
      await srcRow.locator('button.sn-tree-table-toggle').click();
      await expect(srcRow).toHaveAttribute('aria-expanded', 'false');
      await expect(d.locator('tbody [role="row"]').filter({ hasText: 'main.ts' })).not.toBeVisible();
    });

    test('keyboard: ArrowDown moves DOM focus to next visible row', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const rows = d.locator('tbody [role="row"]');
      const firstRow = rows.first();
      await firstRow.focus();
      await expect(firstRow).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(rows.nth(1)).toBeFocused();
    });

    test('keyboard: ArrowRight expands a collapsed parent row', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const srcRow = d.locator('tbody [role="row"]').filter({ hasText: 'src' }).first();
      await srcRow.focus();
      await expect(srcRow).toHaveAttribute('aria-expanded', 'false');
      await page.keyboard.press('ArrowRight');
      await expect(srcRow).toHaveAttribute('aria-expanded', 'true');
    });

    test('keyboard: ArrowRight on expanded parent moves focus to first child row', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const srcRow = d.locator('tbody [role="row"][data-key="src"]');
      await srcRow.focus();
      await page.keyboard.press('ArrowRight'); // expand
      await expect(srcRow).toHaveAttribute('aria-expanded', 'true');
      // first child of src is 'app' - accessible via data-key
      const appRow = d.locator('tbody [role="row"][data-key="app"]');
      await expect(appRow).toBeVisible();
      await page.keyboard.press('ArrowRight'); // move into first child
      await expect(appRow).toBeFocused();
    });

    test('keyboard: ArrowLeft collapses an expanded parent row', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const srcRow = d.locator('tbody [role="row"]').filter({ hasText: 'src' }).first();
      await srcRow.focus();
      await page.keyboard.press('ArrowRight'); // expand
      await expect(srcRow).toHaveAttribute('aria-expanded', 'true');
      await page.keyboard.press('ArrowLeft'); // collapse
      await expect(srcRow).toHaveAttribute('aria-expanded', 'false');
      await expect(srcRow).toBeFocused();
    });

    test('keyboard: Home moves focus to the first visible row', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const rows = d.locator('tbody [role="row"]');
      // Focus last root row
      const lastRow = rows.last();
      await lastRow.focus();
      await page.keyboard.press('Home');
      await expect(rows.first()).toBeFocused();
    });

    test('keyboard: End moves focus to the last visible row', async ({ page }) => {
      const d = demo(page, 'Basic file system');
      const rows = d.locator('tbody [role="row"]');
      const firstRow = rows.first();
      await firstRow.focus();
      await page.keyboard.press('End');
      await expect(rows.last()).toBeFocused();
    });
  });

  test.describe('Controlled expansion', () => {
    test('"src" row is pre-expanded, showing children', async ({ page }) => {
      const d = demo(page, 'Controlled expansion');
      const srcRow = d.locator('tbody [role="row"]').filter({ hasText: 'src' }).first();
      await expect(srcRow).toHaveAttribute('aria-expanded', 'true');
      const mainRow = d.locator('tbody [role="row"]').filter({ hasText: 'main.ts' }).first();
      await expect(mainRow).toBeVisible();
    });

    test('Expand all reveals deeply nested rows', async ({ page }) => {
      const d = demo(page, 'Controlled expansion');
      await d.locator('.demo-btn').filter({ hasText: 'Expand all' }).click();
      const appRow = d.locator('tbody [role="row"][data-key="app"]');
      await expect(appRow).toHaveAttribute('aria-expanded', 'true');
      const appTsRow = d.locator('tbody [role="row"][data-key="app-ts"]');
      await expect(appTsRow).toBeVisible();
    });

    test('Collapse all hides all children', async ({ page }) => {
      const d = demo(page, 'Controlled expansion');
      await d.locator('.demo-btn').filter({ hasText: 'Collapse all' }).click();
      const srcRow = d.locator('tbody [role="row"]').filter({ hasText: 'src' }).first();
      await expect(srcRow).toHaveAttribute('aria-expanded', 'false');
      await expect(d.locator('tbody [role="row"]').filter({ hasText: 'main.ts' })).not.toBeVisible();
    });
  });

  test.describe('Custom cell template (snCellDef)', () => {
    test('renders deploy nodes with Name, Region, Status columns', async ({ page }) => {
      const d = demo(page, 'Custom cell template (snCellDef)');
      const headers = d.locator('thead th');
      await expect(headers.nth(0)).toContainText('Name');
      await expect(headers.nth(1)).toContainText('Region');
      await expect(headers.nth(2)).toContainText('Status');
    });

    test('production row shows concrete cell values', async ({ page }) => {
      const d = demo(page, 'Custom cell template (snCellDef)');
      const prodRow = d.locator('tbody [role="row"]').filter({ hasText: 'production' }).first();
      await expect(prodRow).toContainText('us-east-1');
    });

    test('Status column renders sn-tag elements', async ({ page }) => {
      const d = demo(page, 'Custom cell template (snCellDef)');
      const prodRow = d.locator('tbody [role="row"]').filter({ hasText: 'production' }).first();
      await expect(prodRow.locator('sn-tag')).toBeVisible();
    });

    test('expanding production row reveals api-server child with status tag', async ({ page }) => {
      const d = demo(page, 'Custom cell template (snCellDef)');
      const prodRow = d.locator('tbody [role="row"]').filter({ hasText: 'production' }).first();
      await prodRow.locator('button.sn-tree-table-toggle').click();
      await expect(prodRow).toHaveAttribute('aria-expanded', 'true');
      const apiRow = d.locator('tbody [role="row"]').filter({ hasText: 'api-server' }).first();
      await expect(apiRow).toBeVisible();
      await expect(apiRow.locator('sn-tag')).toBeVisible();
    });
  });
});
