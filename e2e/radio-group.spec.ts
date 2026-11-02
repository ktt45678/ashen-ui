import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('RadioGroup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.radioGroup);
  });

  test.describe('Basic (vertical)', () => {
    test('group has role=radiogroup', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      await expect(d.locator('[role="radiogroup"]')).toBeVisible();
    });

    test('each item has role=radio', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await expect(radios).toHaveCount(3);
    });

    test('no radio is checked by default', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      for (const radio of await radios.all()) {
        await expect(radio).toHaveAttribute('aria-checked', 'false');
      }
    });

    test('first enabled radio has tabindex=0 when nothing selected', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await expect(radios.nth(0)).toHaveAttribute('tabindex', '0');
      await expect(radios.nth(1)).toHaveAttribute('tabindex', '-1');
      await expect(radios.nth(2)).toHaveAttribute('tabindex', '-1');
    });

    test('clicking a radio sets aria-checked=true and sn-radio-button-checked class', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await radios.nth(1).click();
      await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
      await expect(radios.nth(1)).toHaveClass(/\bsn-radio-button-checked\b/);
      await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'false');
      await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'false');
    });

    test('selected radio gets tabindex=0; others get tabindex=-1', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await radios.nth(2).click();
      await expect(radios.nth(2)).toHaveAttribute('tabindex', '0');
      await expect(radios.nth(0)).toHaveAttribute('tabindex', '-1');
      await expect(radios.nth(1)).toHaveAttribute('tabindex', '-1');
    });

    test('ArrowDown moves focus and selection to next radio', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await radios.nth(0).focus();
      await expect(radios.nth(0)).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(radios.nth(1)).toBeFocused();
      await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
    });

    test('ArrowRight moves focus and selection to next radio', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await radios.nth(0).focus();
      await page.keyboard.press('ArrowRight');
      await expect(radios.nth(1)).toBeFocused();
      await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
    });

    test('ArrowUp moves focus and selection to previous radio', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await radios.nth(0).focus();
      await page.keyboard.press('ArrowDown');
      await expect(radios.nth(1)).toBeFocused();
      await page.keyboard.press('ArrowUp');
      await expect(radios.nth(0)).toBeFocused();
      await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
    });

    test('ArrowLeft moves focus and selection to previous radio', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await radios.nth(0).focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowLeft');
      await expect(radios.nth(0)).toBeFocused();
      await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
    });

    test('ArrowDown wraps from last to first', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await radios.nth(0).focus();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await expect(radios.nth(2)).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(radios.nth(0)).toBeFocused();
      await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
    });

    test('ArrowUp wraps from first to last', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await radios.nth(0).focus();
      await page.keyboard.press('ArrowUp');
      await expect(radios.nth(2)).toBeFocused();
      await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');
    });

    test('Space selects the focused radio', async ({ page }) => {
      const d = demo(page, 'Basic (vertical)');
      const radios = d.locator('[role="radio"]');
      await radios.nth(2).focus();
      await page.keyboard.press('Space');
      await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');
    });
  });

  test.describe('Pre-selected value', () => {
    test('pre-selected radio has aria-checked=true', async ({ page }) => {
      const d = demo(page, 'Pre-selected value');
      const radios = d.locator('[role="radio"]');
      // sms is the second radio
      await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
    });

    test('pre-selected radio has tabindex=0', async ({ page }) => {
      const d = demo(page, 'Pre-selected value');
      const radios = d.locator('[role="radio"]');
      await expect(radios.nth(1)).toHaveAttribute('tabindex', '0');
      await expect(radios.nth(0)).toHaveAttribute('tabindex', '-1');
    });
  });

  test.describe('Disabled group', () => {
    test('group has aria-disabled=true', async ({ page }) => {
      const d = demo(page, 'Disabled group');
      await expect(d.locator('[role="radiogroup"]')).toHaveAttribute('aria-disabled', 'true');
    });

    test('all radios have tabindex=-1', async ({ page }) => {
      const d = demo(page, 'Disabled group');
      const radios = d.locator('[role="radio"]');
      for (const radio of await radios.all()) {
        await expect(radio).toHaveAttribute('tabindex', '-1');
      }
    });

    test('clicking a disabled-group radio does not change selection', async ({ page }) => {
      const d = demo(page, 'Disabled group');
      const radios = d.locator('[role="radio"]');
      // email is pre-selected
      await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
      await radios.nth(1).click({ force: true });
      // still email selected
      await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
      await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'false');
    });
  });

  test.describe('Per-option disabled', () => {
    test('disabled radio has aria-disabled=true', async ({ page }) => {
      const d = demo(page, 'Per-option disabled');
      const radios = d.locator('[role="radio"]');
      // sms (index 1) is the disabled option
      await expect(radios.nth(1)).toHaveAttribute('aria-disabled', 'true');
    });

    test('ArrowDown skips the disabled radio', async ({ page }) => {
      const d = demo(page, 'Per-option disabled');
      const radios = d.locator('[role="radio"]');
      await radios.nth(0).focus();
      await expect(radios.nth(0)).toBeFocused();
      await page.keyboard.press('ArrowDown');
      // sms (index 1) is disabled - should skip to push (index 2)
      await expect(radios.nth(2)).toBeFocused();
      await expect(radios.nth(2)).toHaveAttribute('aria-checked', 'true');
    });

    test('ArrowUp skips the disabled radio', async ({ page }) => {
      const d = demo(page, 'Per-option disabled');
      const radios = d.locator('[role="radio"]');
      await radios.nth(0).focus();
      await page.keyboard.press('ArrowDown');
      // now on push (index 2)
      await expect(radios.nth(2)).toBeFocused();
      await page.keyboard.press('ArrowUp');
      // sms (index 1) is disabled - should skip to email (index 0)
      await expect(radios.nth(0)).toBeFocused();
      await expect(radios.nth(0)).toHaveAttribute('aria-checked', 'true');
    });
  });

  test.describe('Reactive form', () => {
    test('selecting a radio updates the two-way binding readout', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      const radios = d.locator('[role="radio"]');
      await radios.nth(0).click();
      await expect(d.locator('.hint-text')).toContainText('Value: email');
      await radios.nth(1).click();
      await expect(d.locator('.hint-text')).toContainText('Value: sms');
    });
  });

  test.describe('ngModel', () => {
    test('selecting a radio updates the ngModel readout', async ({ page }) => {
      const d = demo(page, 'ngModel');
      const radios = d.locator('[role="radio"]');
      await radios.nth(1).click();
      await expect(d.locator('.hint-text')).toContainText('Value: sms');
    });
  });
});
