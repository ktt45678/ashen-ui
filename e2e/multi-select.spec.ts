import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('MultiSelect', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.multiSelect);
  });

  test.describe('Basic multi-select with ngModel', () => {
    test('panel has role=listbox and aria-multiselectable=true', async ({ page }) => {
      const d = demo(page, 'Basic multi-select with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();
      await expect(panel).toHaveAttribute('aria-multiselectable', 'true');
    });

    test('clicking an option keeps the panel open and shows a chip in the trigger', async ({ page }) => {
      const d = demo(page, 'Basic multi-select with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      const firstOption = panel.locator('[role="option"]').first();
      await firstOption.click();

      // Panel stays open
      await expect(panel).toBeVisible();
      // A chip appears in the trigger
      await expect(d.locator('sn-chip')).toHaveCount(1);
    });

    test('clicking the same option again removes its chip', async ({ page }) => {
      const d = demo(page, 'Basic multi-select with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      const firstOption = panel.locator('[role="option"]').first();
      await firstOption.click();
      await expect(d.locator('sn-chip')).toHaveCount(1);

      // Click the same option to deselect
      await firstOption.click();
      await expect(d.locator('sn-chip')).toHaveCount(0);
    });

    test('removing a chip via its remove button does not open the panel', async ({ page }) => {
      const d = demo(page, 'Basic multi-select with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      const firstOption = panel.locator('[role="option"]').first();
      await firstOption.click();
      await expect(d.locator('sn-chip')).toHaveCount(1);

      // Close the panel first
      await trigger.press('Escape');
      await expect(panel).not.toBeVisible();

      // Click the chip remove button
      const removeBtn = d.locator('sn-chip button');
      await removeBtn.click();
      await expect(d.locator('sn-chip')).toHaveCount(0);

      // Panel must remain closed
      await expect(panel).not.toBeVisible();
    });

    test('Escape closes the panel', async ({ page }) => {
      const d = demo(page, 'Basic multi-select with ngModel');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      await trigger.press('Escape');
      await expect(panel).not.toBeVisible();
    });
  });

  test.describe('maxChips collapse (+n more)', () => {
    test('overflow shows +n more indicator when selections exceed maxChips', async ({ page }) => {
      const d = demo(page, 'maxChips collapse (+n more)');
      // This example has 5 options pre-selected with maxChips=2, so "+3 more" should already be visible
      await expect(d.locator('.sn-multi-select-more')).toBeVisible();
      const moreText = await d.locator('.sn-multi-select-more').textContent();
      expect(moreText).toMatch(/\+\d+ more/);
    });

    test('only maxChips chips are rendered (not all selected options)', async ({ page }) => {
      const d = demo(page, 'maxChips collapse (+n more)');
      // maxChips=2, so exactly 2 chips visible
      await expect(d.locator('sn-chip')).toHaveCount(2);
    });
  });
});
