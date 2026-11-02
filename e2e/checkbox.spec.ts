import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Checkbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.checkbox);
  });

  test.describe('Basic', () => {
    test('host has role=checkbox', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('[role="checkbox"]')).toBeVisible();
    });

    test('unchecked by default: aria-checked=false', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('sn-checkbox')).toHaveAttribute('aria-checked', 'false');
    });

    test('clicking toggles aria-checked to true', async ({ page }) => {
      const d = demo(page, 'Basic');
      const cb = d.locator('sn-checkbox');
      await cb.click();
      await expect(cb).toHaveAttribute('aria-checked', 'true');
      await expect(cb).toHaveClass(/\bsn-checkbox-checked\b/);
    });

    test('clicking again toggles aria-checked back to false', async ({ page }) => {
      const d = demo(page, 'Basic');
      const cb = d.locator('sn-checkbox');
      await cb.click();
      await expect(cb).toHaveAttribute('aria-checked', 'true');
      await cb.click();
      await expect(cb).toHaveAttribute('aria-checked', 'false');
      await expect(cb).not.toHaveClass(/\bsn-checkbox-checked\b/);
    });

    test('label click (on label span) also toggles checked state', async ({ page }) => {
      const d = demo(page, 'Basic');
      const cb = d.locator('sn-checkbox');
      const label = cb.locator('.sn-checkbox-label');
      await label.click();
      await expect(cb).toHaveAttribute('aria-checked', 'true');
    });

    test('Space toggles checked when focused', async ({ page }) => {
      const d = demo(page, 'Basic');
      const cb = d.locator('sn-checkbox');
      await cb.focus();
      await expect(cb).toBeFocused();
      await page.keyboard.press('Space');
      await expect(cb).toHaveAttribute('aria-checked', 'true');
    });

    test('Enter toggles checked when focused', async ({ page }) => {
      const d = demo(page, 'Basic');
      const cb = d.locator('sn-checkbox');
      await cb.focus();
      await expect(cb).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(cb).toHaveAttribute('aria-checked', 'true');
    });

    test('has tabindex=0 when enabled', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('sn-checkbox')).toHaveAttribute('tabindex', '0');
    });
  });

  test.describe('Checked states', () => {
    test('pre-checked checkbox has aria-checked=true and sn-checkbox-checked class', async ({ page }) => {
      const d = demo(page, 'Checked states');
      const checkboxes = d.locator('sn-checkbox');
      await expect(checkboxes.nth(0)).toHaveAttribute('aria-checked', 'true');
      await expect(checkboxes.nth(0)).toHaveClass(/\bsn-checkbox-checked\b/);
    });

    test('second checkbox is unchecked by default', async ({ page }) => {
      const d = demo(page, 'Checked states');
      const checkboxes = d.locator('sn-checkbox');
      await expect(checkboxes.nth(1)).toHaveAttribute('aria-checked', 'false');
    });
  });

  test.describe('Indeterminate', () => {
    test('indeterminate checkbox has aria-checked=mixed', async ({ page }) => {
      const d = demo(page, 'Indeterminate');
      const cb = d.locator('sn-checkbox');
      await expect(cb).toHaveAttribute('aria-checked', 'mixed');
    });

    test('indeterminate checkbox has sn-checkbox-indeterminate class', async ({ page }) => {
      const d = demo(page, 'Indeterminate');
      await expect(d.locator('sn-checkbox')).toHaveClass(/\bsn-checkbox-indeterminate\b/);
    });

    test('clicking an indeterminate checkbox clears mixed state and checks it', async ({ page }) => {
      const d = demo(page, 'Indeterminate');
      const cb = d.locator('sn-checkbox');
      await cb.click();
      await expect(cb).toHaveAttribute('aria-checked', 'true');
      await expect(cb).toHaveClass(/\bsn-checkbox-checked\b/);
      await expect(cb).not.toHaveClass(/\bsn-checkbox-indeterminate\b/);
    });
  });

  test.describe('Disabled', () => {
    test('disabled checkbox has aria-disabled=true', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const checkboxes = d.locator('sn-checkbox');
      await expect(checkboxes.nth(0)).toHaveAttribute('aria-disabled', 'true');
    });

    test('disabled checkbox has tabindex=-1', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const checkboxes = d.locator('sn-checkbox');
      await expect(checkboxes.nth(0)).toHaveAttribute('tabindex', '-1');
    });

    test('disabled checkbox has sn-checkbox-disabled class', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const checkboxes = d.locator('sn-checkbox');
      await expect(checkboxes.nth(0)).toHaveClass(/\bsn-checkbox-disabled\b/);
    });

    test('clicking disabled checkbox does not change aria-checked', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const checkboxes = d.locator('sn-checkbox');
      // First checkbox is disabled+unchecked
      await checkboxes.nth(0).click({ force: true });
      await expect(checkboxes.nth(0)).toHaveAttribute('aria-checked', 'false');
    });

    test('disabled checked checkbox stays checked after click', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const checkboxes = d.locator('sn-checkbox');
      // Second checkbox is disabled+checked
      await expect(checkboxes.nth(1)).toHaveAttribute('aria-checked', 'true');
      await checkboxes.nth(1).click({ force: true });
      await expect(checkboxes.nth(1)).toHaveAttribute('aria-checked', 'true');
    });
  });

  test.describe('Reactive form', () => {
    test('form readout shows false by default', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      await expect(d.locator('.hint-text')).toContainText('false');
    });

    test('clicking checkbox updates reactive form readout to true', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      const cb = d.locator('sn-checkbox');
      await cb.click();
      await expect(cb).toHaveAttribute('aria-checked', 'true');
      await expect(d.locator('.hint-text')).toContainText('true');
    });

    test('clicking again resets reactive form readout to false', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      const cb = d.locator('sn-checkbox');
      await cb.click();
      await expect(d.locator('.hint-text')).toContainText('true');
      await cb.click();
      await expect(cb).toHaveAttribute('aria-checked', 'false');
      await expect(d.locator('.hint-text')).toContainText('false');
    });
  });

  test.describe('ngModel', () => {
    test('ngModel readout shows false by default', async ({ page }) => {
      const d = demo(page, 'ngModel');
      await expect(d.locator('.hint-text')).toContainText('false');
    });

    test('clicking checkbox updates ngModel readout to true', async ({ page }) => {
      const d = demo(page, 'ngModel');
      const cb = d.locator('sn-checkbox');
      await cb.click();
      await expect(cb).toHaveAttribute('aria-checked', 'true');
      await expect(d.locator('.hint-text')).toContainText('true');
    });
  });
});
