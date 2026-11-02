import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.toggle);
  });

  test.describe('Basic', () => {
    test('host has role=switch', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('[role="switch"]')).toBeVisible();
    });

    test('off by default: aria-checked=false', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('sn-toggle')).toHaveAttribute('aria-checked', 'false');
    });

    test('clicking flips aria-checked to true and adds sn-toggle-checked class', async ({ page }) => {
      const d = demo(page, 'Basic');
      const toggle = d.locator('sn-toggle');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-checked', 'true');
      await expect(toggle).toHaveClass(/\bsn-toggle-checked\b/);
    });

    test('clicking again flips aria-checked back to false', async ({ page }) => {
      const d = demo(page, 'Basic');
      const toggle = d.locator('sn-toggle');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-checked', 'true');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-checked', 'false');
      await expect(toggle).not.toHaveClass(/\bsn-toggle-checked\b/);
    });

    test('label click also toggles switch state', async ({ page }) => {
      const d = demo(page, 'Basic');
      const toggle = d.locator('sn-toggle');
      const label = toggle.locator('.sn-toggle-label');
      await label.click();
      await expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    test('Space toggles switch when focused', async ({ page }) => {
      const d = demo(page, 'Basic');
      const toggle = d.locator('sn-toggle');
      await toggle.focus();
      await expect(toggle).toBeFocused();
      await page.keyboard.press('Space');
      await expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    test('Enter toggles switch when focused', async ({ page }) => {
      const d = demo(page, 'Basic');
      const toggle = d.locator('sn-toggle');
      await toggle.focus();
      await expect(toggle).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    test('has tabindex=0 when enabled', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('sn-toggle')).toHaveAttribute('tabindex', '0');
    });
  });

  test.describe('Checked states', () => {
    test('pre-checked toggle has aria-checked=true and sn-toggle-checked class', async ({ page }) => {
      const d = demo(page, 'Checked states');
      const toggles = d.locator('sn-toggle');
      await expect(toggles.nth(0)).toHaveAttribute('aria-checked', 'true');
      await expect(toggles.nth(0)).toHaveClass(/\bsn-toggle-checked\b/);
    });

    test('second toggle is off by default', async ({ page }) => {
      const d = demo(page, 'Checked states');
      const toggles = d.locator('sn-toggle');
      await expect(toggles.nth(1)).toHaveAttribute('aria-checked', 'false');
      await expect(toggles.nth(1)).not.toHaveClass(/\bsn-toggle-checked\b/);
    });
  });

  test.describe('Disabled', () => {
    test('disabled toggle has aria-disabled=true', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const toggles = d.locator('sn-toggle');
      await expect(toggles.nth(0)).toHaveAttribute('aria-disabled', 'true');
    });

    test('disabled toggle has tabindex=-1', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const toggles = d.locator('sn-toggle');
      await expect(toggles.nth(0)).toHaveAttribute('tabindex', '-1');
    });

    test('disabled toggle has sn-toggle-disabled class', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const toggles = d.locator('sn-toggle');
      await expect(toggles.nth(0)).toHaveClass(/\bsn-toggle-disabled\b/);
    });

    test('clicking disabled-off toggle does not change aria-checked', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const toggles = d.locator('sn-toggle');
      await toggles.nth(0).click({ force: true });
      await expect(toggles.nth(0)).toHaveAttribute('aria-checked', 'false');
    });

    test('clicking disabled-on toggle keeps aria-checked=true', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const toggles = d.locator('sn-toggle');
      await expect(toggles.nth(1)).toHaveAttribute('aria-checked', 'true');
      await toggles.nth(1).click({ force: true });
      await expect(toggles.nth(1)).toHaveAttribute('aria-checked', 'true');
    });
  });

  test.describe('Reactive form', () => {
    test('form readout shows false by default', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      await expect(d.locator('.hint-text')).toContainText('false');
    });

    test('clicking toggle updates reactive form readout to true', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      const toggle = d.locator('sn-toggle');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-checked', 'true');
      await expect(d.locator('.hint-text')).toContainText('true');
    });

    test('clicking again resets reactive form readout to false', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      const toggle = d.locator('sn-toggle');
      await toggle.click();
      await expect(d.locator('.hint-text')).toContainText('true');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-checked', 'false');
      await expect(d.locator('.hint-text')).toContainText('false');
    });
  });

  test.describe('ngModel', () => {
    test('ngModel readout shows false by default', async ({ page }) => {
      const d = demo(page, 'ngModel');
      await expect(d.locator('.hint-text')).toContainText('false');
    });

    test('clicking toggle updates ngModel readout to true', async ({ page }) => {
      const d = demo(page, 'ngModel');
      const toggle = d.locator('sn-toggle');
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-checked', 'true');
      await expect(d.locator('.hint-text')).toContainText('true');
    });
  });
});
