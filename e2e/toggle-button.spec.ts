import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('ToggleButton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.toggleButton);
  });

  test.describe('Basic', () => {
    test('button has sn-toggle-button class', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('button.sn-toggle-button')).toBeVisible();
    });

    test('unpressed by default: aria-pressed=false', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('button[snToggleButton]')).toHaveAttribute('aria-pressed', 'false');
    });

    test('clicking sets aria-pressed=true and adds sn-toggle-button-selected class', async ({ page }) => {
      const d = demo(page, 'Basic');
      const btn = d.locator('button[snToggleButton]');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-pressed', 'true');
      await expect(btn).toHaveClass(/\bsn-toggle-button-selected\b/);
    });

    test('clicking again deselects: aria-pressed=false', async ({ page }) => {
      const d = demo(page, 'Basic');
      const btn = d.locator('button[snToggleButton]');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-pressed', 'true');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-pressed', 'false');
      await expect(btn).not.toHaveClass(/\bsn-toggle-button-selected\b/);
    });

    test('Space toggles pressed state when focused', async ({ page }) => {
      const d = demo(page, 'Basic');
      const btn = d.locator('button[snToggleButton]');
      await btn.focus();
      await expect(btn).toBeFocused();
      await page.keyboard.press('Space');
      await expect(btn).toHaveAttribute('aria-pressed', 'true');
    });

    test('Enter toggles pressed state when focused', async ({ page }) => {
      const d = demo(page, 'Basic');
      const btn = d.locator('button[snToggleButton]');
      await btn.focus();
      await expect(btn).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(btn).toHaveAttribute('aria-pressed', 'true');
    });

    test('button has type=button', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('button[snToggleButton]')).toHaveAttribute('type', 'button');
    });
  });

  test.describe('Selected states', () => {
    test('pre-selected button has aria-pressed=true and sn-toggle-button-selected class', async ({ page }) => {
      const d = demo(page, 'Selected states');
      const btns = d.locator('button[snToggleButton]');
      await expect(btns.nth(0)).toHaveAttribute('aria-pressed', 'true');
      await expect(btns.nth(0)).toHaveClass(/\bsn-toggle-button-selected\b/);
    });

    test('second button is unselected by default', async ({ page }) => {
      const d = demo(page, 'Selected states');
      const btns = d.locator('button[snToggleButton]');
      await expect(btns.nth(1)).toHaveAttribute('aria-pressed', 'false');
      await expect(btns.nth(1)).not.toHaveClass(/\bsn-toggle-button-selected\b/);
    });
  });

  test.describe('Disabled', () => {
    test('disabled button has disabled attribute', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const btns = d.locator('button[snToggleButton]');
      await expect(btns.nth(0)).toBeDisabled();
    });

    test('clicking disabled button does not change aria-pressed', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const btns = d.locator('button[snToggleButton]');
      await btns.nth(0).click({ force: true });
      await expect(btns.nth(0)).toHaveAttribute('aria-pressed', 'false');
    });

    test('disabled selected button stays selected after click', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const btns = d.locator('button[snToggleButton]');
      await expect(btns.nth(1)).toHaveAttribute('aria-pressed', 'true');
      await btns.nth(1).click({ force: true });
      await expect(btns.nth(1)).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('With icon', () => {
    test('button renders an icon span', async ({ page }) => {
      const d = demo(page, 'With icon');
      const btn = d.locator('button[snToggleButton]');
      await expect(btn.locator('.sn-icon')).toBeVisible();
    });

    test('clicking updates icon and label content', async ({ page }) => {
      const d = demo(page, 'With icon');
      const btn = d.locator('button[snToggleButton]');
      // Initially not muted
      await expect(btn).toHaveAttribute('aria-pressed', 'false');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-pressed', 'true');
      await expect(btn).toHaveClass(/\bsn-toggle-button-selected\b/);
    });
  });

  test.describe('Icon only', () => {
    test('icon-only button has aria-label', async ({ page }) => {
      const d = demo(page, 'Icon only');
      const btn = d.locator('button[snToggleButton]');
      await expect(btn).toHaveAttribute('aria-label', 'Toggle mute');
    });

    test('clicking icon-only button toggles aria-pressed', async ({ page }) => {
      const d = demo(page, 'Icon only');
      const btn = d.locator('button[snToggleButton]');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('Reactive form', () => {
    test('form readout shows false by default', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      await expect(d.locator('.hint-text')).toContainText('false');
    });

    test('clicking button updates reactive form readout to true', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      const btn = d.locator('button[snToggleButton]');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-pressed', 'true');
      await expect(d.locator('.hint-text')).toContainText('true');
    });

    test('clicking again resets reactive form readout to false', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      const btn = d.locator('button[snToggleButton]');
      await btn.click();
      await expect(d.locator('.hint-text')).toContainText('true');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-pressed', 'false');
      await expect(d.locator('.hint-text')).toContainText('false');
    });
  });

  test.describe('ngModel', () => {
    test('ngModel readout shows false by default', async ({ page }) => {
      const d = demo(page, 'ngModel');
      await expect(d.locator('.hint-text')).toContainText('false');
    });

    test('clicking button updates ngModel readout to true', async ({ page }) => {
      const d = demo(page, 'ngModel');
      const btn = d.locator('button[snToggleButton]');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-pressed', 'true');
      await expect(d.locator('.hint-text')).toContainText('true');
    });
  });
});
