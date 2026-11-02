import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Listbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.listbox);
  });

  test.describe('Single selection', () => {
    test('host has role=listbox', async ({ page }) => {
      const d = demo(page, 'Single selection');
      await expect(d.locator('sn-listbox')).toHaveAttribute('role', 'listbox');
    });

    test('each child has role=option', async ({ page }) => {
      const d = demo(page, 'Single selection');
      const options = d.locator('[role="option"]');
      await expect(options.first()).toBeVisible();
      const count = await options.count();
      expect(count).toBeGreaterThan(0);
    });

    test('exactly one option has tabindex=0 (roving tabindex)', async ({ page }) => {
      const d = demo(page, 'Single selection');
      const options = d.locator('[role="option"]');
      await expect(options.first()).toBeVisible();
      const all = await options.all();
      const tabIndices = await Promise.all(all.map((o) => o.getAttribute('tabindex')));
      const zeroCount = tabIndices.filter((t) => t === '0').length;
      expect(zeroCount).toBe(1);
    });

    test('clicking an option sets aria-selected=true on it', async ({ page }) => {
      const d = demo(page, 'Single selection');
      const options = d.locator('[role="option"]');
      const second = options.nth(1);
      await second.click();
      await expect(second).toHaveAttribute('aria-selected', 'true');
    });

    test('clicking an option clears aria-selected from the previous option', async ({ page }) => {
      const d = demo(page, 'Single selection');
      const options = d.locator('[role="option"]');
      await options.nth(0).click();
      await options.nth(1).click();
      await expect(options.nth(0)).toHaveAttribute('aria-selected', 'false');
      await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
    });

    test('keyboard: ArrowDown moves DOM focus to the next option', async ({ page }) => {
      const d = demo(page, 'Single selection');
      const options = d.locator('[role="option"]');
      // Focus via DOM so CDK keyManager starts at index 0 (first ArrowDown → stays at 0 if -1+1=0; second → 1)
      await options.first().focus();
      await expect(options.first()).toBeFocused();
      // First ArrowDown initialises keyManager to item 0 (activeIndex was -1)
      await page.keyboard.press('ArrowDown');
      await expect(options.first()).toBeFocused();
      // Second ArrowDown moves from item 0 to item 1
      await page.keyboard.press('ArrowDown');
      await expect(options.nth(1)).toBeFocused();
    });

    test('keyboard: Enter selects the focused option', async ({ page }) => {
      const d = demo(page, 'Single selection');
      const options = d.locator('[role="option"]');
      // Navigate to second option then select with Enter
      await options.first().focus();
      await expect(options.first()).toBeFocused();
      await page.keyboard.press('ArrowDown'); // → item 0
      await page.keyboard.press('ArrowDown'); // → item 1
      await expect(options.nth(1)).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
    });

    test('keyboard: Space selects the focused option', async ({ page }) => {
      const d = demo(page, 'Single selection');
      const options = d.locator('[role="option"]');
      // Navigate to second option then select with Space
      await options.first().focus();
      await expect(options.first()).toBeFocused();
      await page.keyboard.press('ArrowDown'); // → item 0
      await page.keyboard.press('ArrowDown'); // → item 1
      await expect(options.nth(1)).toBeFocused();
      await page.keyboard.press('Space');
      await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('Multiple selection', () => {
    test('host has aria-multiselectable=true', async ({ page }) => {
      const d = demo(page, 'Multiple selection');
      await expect(d.locator('sn-listbox')).toHaveAttribute('aria-multiselectable', 'true');
    });

    test('clicking two distinct options selects both', async ({ page }) => {
      const d = demo(page, 'Multiple selection');
      const options = d.locator('[role="option"]');
      await options.nth(0).click();
      await options.nth(1).click();
      await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true');
      await expect(options.nth(1)).toHaveAttribute('aria-selected', 'true');
    });

    test('clicking a selected option deselects it', async ({ page }) => {
      const d = demo(page, 'Multiple selection');
      const options = d.locator('[role="option"]');
      await options.nth(0).click();
      await expect(options.nth(0)).toHaveAttribute('aria-selected', 'true');
      await options.nth(0).click();
      await expect(options.nth(0)).toHaveAttribute('aria-selected', 'false');
    });
  });

  test.describe('Options with icons and a disabled option', () => {
    test('disabled option has aria-disabled=true', async ({ page }) => {
      const d = demo(page, 'Options with icons and a disabled option');
      const disabledOption = d.locator('[role="option"][aria-disabled="true"]');
      await expect(disabledOption).toHaveCount(1);
    });

    test('clicking a disabled option does not select it', async ({ page }) => {
      const d = demo(page, 'Options with icons and a disabled option');
      const disabledOption = d.locator('[role="option"][aria-disabled="true"]');
      await disabledOption.click({ force: true });
      await expect(disabledOption).not.toHaveAttribute('aria-selected', 'true');
    });
  });
});
