import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('InputPassword', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.inputPassword);
  });

  test.describe('Basic', () => {
    test('input starts as type=password', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('input')).toHaveAttribute('type', 'password');
    });

    test('toggle button has aria-label "Show password" initially', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('button.sn-input-password-toggle')).toHaveAttribute(
        'aria-label',
        'Show password',
      );
    });

    test('clicking toggle switches input to type=text', async ({ page }) => {
      const d = demo(page, 'Basic');
      await d.locator('button.sn-input-password-toggle').click();
      await expect(d.locator('input')).toHaveAttribute('type', 'text');
    });

    test('clicking toggle updates aria-label to "Hide password"', async ({ page }) => {
      const d = demo(page, 'Basic');
      await d.locator('button.sn-input-password-toggle').click();
      await expect(d.locator('button.sn-input-password-toggle')).toHaveAttribute(
        'aria-label',
        'Hide password',
      );
    });

    test('clicking toggle a second time reverts to type=password', async ({ page }) => {
      const d = demo(page, 'Basic');
      const btn = d.locator('button.sn-input-password-toggle');
      await btn.click();
      await expect(d.locator('input')).toHaveAttribute('type', 'text');
      await btn.click();
      await expect(d.locator('input')).toHaveAttribute('type', 'password');
    });

    test('clicking toggle a second time reverts aria-label to "Show password"', async ({ page }) => {
      const d = demo(page, 'Basic');
      const btn = d.locator('button.sn-input-password-toggle');
      await btn.click();
      await btn.click();
      await expect(btn).toHaveAttribute('aria-label', 'Show password');
    });

    test('input has default placeholder "Password"', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('input')).toHaveAttribute('placeholder', 'Password');
    });
  });

  test.describe('With strength meter', () => {
    test('strength meter is not visible when input is empty', async ({ page }) => {
      const d = demo(page, 'With strength meter');
      await expect(d.locator('.sn-input-password-meter')).not.toBeVisible();
    });

    test('typing a weak password shows the strength meter with label "Weak"', async ({ page }) => {
      const d = demo(page, 'With strength meter');
      await d.locator('input').fill('abc');
      await expect(d.locator('.sn-input-password-meter')).toBeVisible();
      await expect(d.locator('.sn-input-password-meter-label')).toHaveText('Weak');
    });

    test('typing a fair password shows label "Fair"', async ({ page }) => {
      const d = demo(page, 'With strength meter');
      // length >=8 + mixed case = score 2
      await d.locator('input').fill('Abcdefgh');
      await expect(d.locator('.sn-input-password-meter-label')).toHaveText('Fair');
    });

    test('typing a good password shows label "Good"', async ({ page }) => {
      const d = demo(page, 'With strength meter');
      // length >=8 + mixed case + digit = score 3
      await d.locator('input').fill('Abcdef1h');
      await expect(d.locator('.sn-input-password-meter-label')).toHaveText('Good');
    });

    test('typing a strong password shows label "Strong"', async ({ page }) => {
      const d = demo(page, 'With strength meter');
      // length >=8 + mixed case + digit + special = score 4
      await d.locator('input').fill('Abcdef1!');
      await expect(d.locator('.sn-input-password-meter-label')).toHaveText('Strong');
    });

    test('clearing the input hides the strength meter', async ({ page }) => {
      const d = demo(page, 'With strength meter');
      await d.locator('input').fill('test');
      await expect(d.locator('.sn-input-password-meter')).toBeVisible();
      await d.locator('input').fill('');
      await expect(d.locator('.sn-input-password-meter')).not.toBeVisible();
    });
  });

  test.describe('Disabled', () => {
    test('input is disabled', async ({ page }) => {
      const d = demo(page, 'Disabled');
      await expect(d.locator('input')).toBeDisabled();
    });

    test('toggle button is disabled', async ({ page }) => {
      const d = demo(page, 'Disabled');
      await expect(d.locator('button.sn-input-password-toggle')).toBeDisabled();
    });

    test('clicking disabled toggle does not change input type', async ({ page }) => {
      const d = demo(page, 'Disabled');
      await d.locator('button.sn-input-password-toggle').click({ force: true });
      await expect(d.locator('input')).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Custom intl labels', () => {
    test('toggle uses custom showPasswordLabel initially', async ({ page }) => {
      const d = demo(page, 'Custom intl labels');
      await expect(d.locator('button.sn-input-password-toggle')).toHaveAttribute(
        'aria-label',
        'Reveal',
      );
    });

    test('toggle uses custom hidePasswordLabel after click', async ({ page }) => {
      const d = demo(page, 'Custom intl labels');
      await d.locator('button.sn-input-password-toggle').click();
      await expect(d.locator('button.sn-input-password-toggle')).toHaveAttribute(
        'aria-label',
        'Conceal',
      );
    });
  });

  test.describe('Inside FormField with reactive form', () => {
    test('label is associated with the input via for/id', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive form');
      const label = d.locator('label');
      const input = d.locator('input');
      const labelFor = await label.getAttribute('for');
      const inputId = await input.getAttribute('id');
      expect(labelFor).toBeTruthy();
      expect(inputId).toBeTruthy();
      expect(labelFor).toBe(inputId);
    });

    test('error does not appear before the field is touched', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive form');
      await expect(d.locator('sn-error')).not.toBeVisible();
    });

    test('error appears after focusing and blurring with an invalid value', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive form');
      const input = d.locator('input');
      await input.focus();
      await input.blur();
      await expect(d.locator('sn-error')).toBeVisible();
    });

    test('input gets sn-input-text-error class after touched+invalid', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive form');
      const input = d.locator('input');
      await input.focus();
      await input.blur();
      await expect(input).toHaveClass(/\bsn-input-text-error\b/);
    });

    test('error clears when a valid password is entered', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive form');
      const input = d.locator('input');
      await input.focus();
      await input.blur();
      await expect(d.locator('sn-error')).toBeVisible();
      await input.fill('validpassword123');
      await expect(d.locator('sn-error')).not.toBeVisible();
    });

    test('status readout shows VALID when a valid value is entered', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive form');
      await d.locator('input').fill('validpassword123');
      await expect(d.locator('.hint-text')).toContainText('VALID');
    });

    test('status readout shows INVALID when value is too short', async ({ page }) => {
      const d = demo(page, 'Inside FormField with reactive form');
      await d.locator('input').fill('short');
      await expect(d.locator('.hint-text')).toContainText('INVALID');
    });
  });

  test.describe('Reactive form', () => {
    test('typing updates the value readout', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      await d.locator('input').fill('secret');
      await expect(d.locator('.hint-text')).toContainText('secret');
    });
  });

  test.describe('ngModel two-way binding', () => {
    test('typing updates the ngModel readout', async ({ page }) => {
      const d = demo(page, 'ngModel two-way binding');
      await d.locator('input').fill('mypassword');
      await expect(d.locator('.hint-text')).toContainText('mypassword');
    });
  });
});
