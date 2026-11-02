import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('CascadeSelect', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.cascadeSelect);
  });

  test.describe('Basic with ngModel', () => {
    test('closed trigger shows placeholder text', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await expect(trigger.locator('.sn-select-placeholder')).toBeVisible();
      await expect(trigger.locator('.sn-select-placeholder')).toContainText('Select a city');
    });

    test('clicking trigger opens panel with role=tree in overlay', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="tree"]');
      await expect(panel).toBeVisible();
    });

    test('hovering a group option opens its child flyout list', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="tree"]');
      await expect(panel).toBeVisible();

      const europeOption = panel.locator('[role="treeitem"]').filter({ hasText: 'Europe' }).first();
      await europeOption.hover();

      // A flyout sub-panel should appear
      await expect(page.locator('.cdk-overlay-container .sn-cascade-select-flyout')).toBeVisible();
    });

    test('hovering a group option sets aria-expanded=true on that option', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="tree"]');
      await expect(panel).toBeVisible();

      const europeOption = panel.locator('[role="treeitem"]').first();
      await europeOption.hover();

      await expect(page.locator('.cdk-overlay-container .sn-cascade-select-flyout')).toBeVisible();
      await expect(europeOption).toHaveAttribute('aria-expanded', 'true');
    });

    test('clicking a leaf option commits value, closes panel, trigger shows leaf label', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="tree"]');
      await expect(panel).toBeVisible();

      // Hover Europe (first root item) to open its flyout
      const europeOption = panel.locator(':scope > [role="treeitem"]').first();
      await europeOption.hover();
      const firstFlyout = page.locator('.cdk-overlay-container .sn-cascade-select-flyout').first();
      await expect(firstFlyout).toBeVisible();

      // Hover France (first child in Europe flyout) to open its nested flyout
      const franceOption = firstFlyout.locator(':scope > [role="treeitem"]').first();
      await franceOption.hover();
      const secondFlyout = page.locator('.cdk-overlay-container .sn-cascade-select-flyout').nth(1);
      await expect(secondFlyout).toBeVisible();

      // Click Paris (first city in France flyout)
      const parisOption = secondFlyout.locator(':scope > [role="treeitem"]').first();
      await parisOption.click();

      await expect(panel).not.toBeVisible();
      await expect(trigger.locator('.sn-select-value')).toContainText('Paris');
    });

    test('Escape closes panel without committing a value', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="tree"]');
      await expect(panel).toBeVisible();

      await trigger.press('Escape');

      await expect(panel).not.toBeVisible();
      await expect(trigger.locator('.sn-select-placeholder')).toBeVisible();
    });

    test('keyboard: ArrowDown opens panel and sets first option active', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.focus();
      await trigger.press('ArrowDown');

      const panel = page.locator('.cdk-overlay-container [role="tree"]');
      await expect(panel).toBeVisible();

      // Key-manager init runs in setTimeout(0) - wait for aria-activedescendant
      await expect(trigger).toHaveAttribute('aria-activedescendant', /\S/);
      const activeId = await trigger.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      await expect(page.locator(`#${activeId}`)).toHaveClass(/sn-listbox-option-active/);
    });

    test('keyboard: ArrowDown moves active option down', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.focus();
      await trigger.press('ArrowDown');

      const panel = page.locator('.cdk-overlay-container [role="tree"]');
      await expect(panel).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-activedescendant', /\S/);

      const firstActiveId = await trigger.getAttribute('aria-activedescendant');
      await trigger.press('ArrowDown');

      await expect(trigger).not.toHaveAttribute('aria-activedescendant', firstActiveId!);
      const secondActiveId = await trigger.getAttribute('aria-activedescendant');
      expect(secondActiveId).toBeTruthy();
      await expect(page.locator(`#${secondActiveId}`)).toHaveClass(/sn-listbox-option-active/);
    });

    test('keyboard: ArrowRight enters a submenu, ArrowLeft closes it', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.focus();
      await trigger.press('ArrowDown');

      const panel = page.locator('.cdk-overlay-container [role="tree"]');
      await expect(panel).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-activedescendant', /\S/);

      // ArrowRight on Europe (first option, a parent) should open flyout
      await trigger.press('ArrowRight');
      await expect(page.locator('.cdk-overlay-container .sn-cascade-select-flyout')).toBeVisible();

      // Active should now be in the flyout (first child)
      await expect(trigger).toHaveAttribute('aria-activedescendant', /\S/);

      // ArrowLeft should close the flyout and go back to parent
      await trigger.press('ArrowLeft');
      await expect(page.locator('.cdk-overlay-container .sn-cascade-select-flyout')).not.toBeVisible();

      const activeId = await trigger.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      const activeOption = page.locator(`#${activeId}`);
      await expect(activeOption).toContainText('Europe');
    });

    test('keyboard: Enter on a leaf commits value and closes panel', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.focus();
      await trigger.press('ArrowDown');

      const panel = page.locator('.cdk-overlay-container [role="tree"]');
      await expect(panel).toBeVisible();
      await expect(trigger).toHaveAttribute('aria-activedescendant', /\S/);

      // Navigate into Europe → France → Paris
      await trigger.press('ArrowRight'); // open Europe flyout, active → France
      await expect(page.locator('.cdk-overlay-container .sn-cascade-select-flyout')).toBeVisible();
      await trigger.press('ArrowRight'); // open France flyout, active → Paris (first city)
      // Wait for second flyout (France's children) to appear before reading active option
      await expect(page.locator('.cdk-overlay-container .sn-cascade-select-flyout')).toHaveCount(2);

      const activeId = await trigger.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      const leafOption = page.locator(`#${activeId}`);
      // Read only the label text from the content span (not flyout children text)
      const leafLabel = await leafOption.locator('.sn-cascade-select-option-content > span').textContent();

      await trigger.press('Enter');

      await expect(panel).not.toBeVisible();
      await expect(trigger.locator('.sn-select-value')).toContainText(leafLabel!.trim());
    });
  });

  test.describe('Preselected deep leaf', () => {
    test('trigger shows preselected label without opening', async ({ page }) => {
      const d = demo(page, 'Preselected deep leaf');
      const trigger = d.locator('button[role="combobox"]');
      await expect(trigger.locator('.sn-select-placeholder')).not.toBeVisible();
      const valueText = await trigger.locator('.sn-select-value').textContent();
      expect(valueText!.trim().length).toBeGreaterThan(0);
    });
  });
});
