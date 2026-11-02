import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('InputNumber', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.inputNumber);
  });

  test.describe('Basic', () => {
    test('input has sn-input-number and sn-input-text classes', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="number"]');
      await expect(input).toHaveClass(/\bsn-input-number\b/);
      await expect(input).toHaveClass(/\bsn-input-text\b/);
    });

    test('typing a number is accepted', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="number"]');
      await input.fill('42');
      await expect(input).toHaveValue('42');
    });
  });

  test.describe('Min / Max / Step', () => {
    test('input has min/max/step attributes', async ({ page }) => {
      const d = demo(page, 'Min / Max / Step');
      const input = d.locator('input[type="number"]');
      await expect(input).toHaveAttribute('min', '0');
      await expect(input).toHaveAttribute('max', '100');
      await expect(input).toHaveAttribute('step', '5');
    });

    test('ArrowUp increases value by step', async ({ page }) => {
      const d = demo(page, 'Min / Max / Step');
      const input = d.locator('input[type="number"]');
      await input.fill('10');
      await input.focus();
      await page.keyboard.press('ArrowUp');
      await expect(input).toHaveValue('15');
    });

    test('ArrowDown decreases value by step', async ({ page }) => {
      const d = demo(page, 'Min / Max / Step');
      const input = d.locator('input[type="number"]');
      await input.fill('20');
      await input.focus();
      await page.keyboard.press('ArrowDown');
      await expect(input).toHaveValue('15');
    });

    test('value below min is clamped to min on blur', async ({ page }) => {
      const d = demo(page, 'Min / Max / Step');
      const input = d.locator('input[type="number"]');
      await input.fill('-10');
      await input.blur();
      await expect(input).toHaveValue('0');
    });

    test('value above max is clamped to max on blur', async ({ page }) => {
      const d = demo(page, 'Min / Max / Step');
      const input = d.locator('input[type="number"]');
      await input.fill('200');
      await input.blur();
      await expect(input).toHaveValue('100');
    });

    test('valid value within range is not clamped on blur', async ({ page }) => {
      const d = demo(page, 'Min / Max / Step');
      const input = d.locator('input[type="number"]');
      await input.fill('50');
      await input.blur();
      await expect(input).toHaveValue('50');
    });

    test('empty value is not clamped on blur', async ({ page }) => {
      const d = demo(page, 'Min / Max / Step');
      const input = d.locator('input[type="number"]');
      await input.fill('');
      await input.blur();
      // empty string stays empty (clampToRange returns early on empty)
      await expect(input).toHaveValue('');
    });
  });

  test.describe('Sizes', () => {
    test('small input has sn-input-text-sm class', async ({ page }) => {
      const d = demo(page, 'Sizes');
      const inputs = d.locator('input[type="number"]');
      await expect(inputs.nth(0)).toHaveClass(/\bsn-input-text-sm\b/);
    });

    test('large input has sn-input-text-lg class', async ({ page }) => {
      const d = demo(page, 'Sizes');
      const inputs = d.locator('input[type="number"]');
      await expect(inputs.nth(2)).toHaveClass(/\bsn-input-text-lg\b/);
    });

    test('medium input has no size modifier class', async ({ page }) => {
      const d = demo(page, 'Sizes');
      const inputs = d.locator('input[type="number"]');
      const cls = await inputs.nth(1).getAttribute('class');
      expect(cls).not.toMatch(/sn-input-text-sm/);
      expect(cls).not.toMatch(/sn-input-text-lg/);
    });
  });

  test.describe('Error state', () => {
    test('input has sn-input-text-error class when invalid=true', async ({ page }) => {
      const d = demo(page, 'Error state');
      const input = d.locator('input[type="number"]');
      await expect(input).toHaveClass(/\bsn-input-text-error\b/);
    });

    test('input has aria-invalid=true when invalid=true', async ({ page }) => {
      const d = demo(page, 'Error state');
      const input = d.locator('input[type="number"]');
      await expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  test.describe('Disabled', () => {
    test('input is disabled', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const input = d.locator('input[type="number"]');
      await expect(input).toBeDisabled();
    });

    test('disabled input shows its value', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const input = d.locator('input[type="number"]');
      await expect(input).toHaveValue('42');
    });
  });

  test.describe('Inside FormField with reactive validation', () => {
    test('label is associated with the input via for/id', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive validation');
      const label = d.locator('label');
      const input = d.locator('input[type="number"]');

      await expect(input).toHaveAttribute('aria-describedby', /\S/);
      const labelFor = await label.getAttribute('for');
      const inputId = await input.getAttribute('id');
      expect(labelFor).toBeTruthy();
      expect(inputId).toBeTruthy();
      expect(labelFor).toBe(inputId);
    });

    test('error appears after touching with invalid value', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive validation');
      const input = d.locator('input[type="number"]');
      const error = d.locator('.sn-form-field-error');

      await expect(error).not.toBeVisible();
      await input.focus();
      await input.blur();
      await expect(error).toBeVisible();
    });

    test('error clears when a valid value is entered', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive validation');
      const input = d.locator('input[type="number"]');
      const error = d.locator('.sn-form-field-error');

      await input.focus();
      await input.blur();
      await expect(error).toBeVisible();

      await input.fill('50');
      await expect(error).not.toBeVisible();
    });

    test('status readout reflects form control state', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive validation');
      const input = d.locator('input[type="number"]');
      const readout = d.locator('.hint-text');

      await input.fill('50');
      await expect(readout).toContainText('Value: 50');
    });

    test('value is clamped and form updates on blur', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive validation');
      const input = d.locator('input[type="number"]');
      const readout = d.locator('.hint-text');

      await input.fill('200');
      await input.blur();
      // clamped to max=99
      await expect(input).toHaveValue('99');
      await expect(readout).toContainText('Value: 99');
    });
  });

  test.describe('ngModel binding', () => {
    test('typing updates the ngModel readout', async ({ page }) => {
      const d = demo(page, 'ngModel binding');
      const input = d.locator('input[type="number"]');
      await input.fill('7');
      await expect(d.locator('.hint-text')).toContainText('Bound value: 7');
    });

    test('ArrowUp increments and updates readout', async ({ page }) => {
      const d = demo(page, 'ngModel binding');
      const input = d.locator('input[type="number"]');
      await input.fill('3');
      await input.focus();
      await page.keyboard.press('ArrowUp');
      await expect(input).toHaveValue('3.5');
      await expect(d.locator('.hint-text')).toContainText('Bound value: 3.5');
    });

    test('value above max is clamped to max=10 on blur', async ({ page }) => {
      const d = demo(page, 'ngModel binding');
      const input = d.locator('input[type="number"]');
      await input.fill('99');
      await input.blur();
      await expect(input).toHaveValue('10');
    });

    test('value below min is clamped to min=0 on blur', async ({ page }) => {
      const d = demo(page, 'ngModel binding');
      const input = d.locator('input[type="number"]');
      await input.fill('-5');
      await input.blur();
      await expect(input).toHaveValue('0');
    });
  });
});
