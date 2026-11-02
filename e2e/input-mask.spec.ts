import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('InputMask', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.inputMask);
  });

  const phone = (page: import('@playwright/test').Page) =>
    demo(page, 'Basic').locator('input');

  test('formats as real keystrokes arrive', async ({ page }) => {
    const input = phone(page);
    await input.click();

    await input.pressSequentially('555');
    // Auto-advance: the separator arrives with the third digit.
    await expect(input).toHaveValue('(555) ');

    await input.pressSequentially('1234567');
    await expect(input).toHaveValue('(555) 123-4567');
  });

  test('the caret follows the character just typed, past inserted separators', async ({ page }) => {
    const input = phone(page);
    await input.click();
    await input.pressSequentially('555');

    // The real reason this test is in a browser: a caret left before the
    // separator would put the next keystroke in the wrong slot.
    expect(await input.evaluate((el: HTMLInputElement) => el.selectionStart)).toBe(6);

    await input.pressSequentially('1');
    await expect(input).toHaveValue('(555) 1');
    expect(await input.evaluate((el: HTMLInputElement) => el.selectionStart)).toBe(7);
  });

  test('rejects characters the token does not accept', async ({ page }) => {
    const input = phone(page);
    await input.click();
    await input.pressSequentially('abc555');
    await expect(input).toHaveValue('(555) ');
  });

  test('backspace deletes through the mask rather than stalling', async ({ page }) => {
    const input = phone(page);
    await input.click();
    await input.pressSequentially('5551234567');
    await expect(input).toHaveValue('(555) 123-4567');

    await input.press('Backspace');
    await expect(input).toHaveValue('(555) 123-456');

    // Each press removes one character the user supplied.
    await input.press('Backspace');
    await input.press('Backspace');
    await input.press('Backspace');
    await expect(input).toHaveValue('(555) 123-');

    // The caret now sits after the "-", so this press deletes a literal. The
    // mask would re-add it and the keystroke would do nothing at all, so it
    // takes out the digit in front of it instead, which is what was meant.
    await input.press('Backspace');
    await expect(input).toHaveValue('(555) 12');
  });

  test('pasting a pre-formatted number keeps its shape', async ({ page }) => {
    const input = phone(page);
    await input.click();
    await input.evaluate((el: HTMLInputElement) => {
      el.value = '(555) 123-4567';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(input).toHaveValue('(555) 123-4567');
  });

  test('the mask template is a placeholder, and the field reads as empty', async ({ page }) => {
    const input = phone(page);
    const field = demo(page, 'Basic').locator('sn-form-field');

    await expect(input).toHaveAttribute('placeholder', '(___) ___-____');
    await expect(input).toHaveValue('');
    // The bug this design avoids: a template written into the value would float
    // the label over an untouched field, permanently.
    await expect(field).not.toHaveClass(/\bsn-form-field-should-float\b/);

    await input.click();
    await input.pressSequentially('5');
    await expect(field).toHaveClass(/\bsn-form-field-should-float\b/);
  });

  test('data-sn-mask-complete tracks the non-optional tokens', async ({ page }) => {
    const input = phone(page);
    await input.click();
    await input.pressSequentially('555123');
    await expect(input).not.toHaveAttribute('data-sn-mask-complete', '');

    await input.pressSequentially('4567');
    await expect(input).toHaveAttribute('data-sn-mask-complete', '');
  });

  test('an optional group counts as complete without it', async ({ page }) => {
    const zip = demo(page, 'Tokens').locator('input').nth(2);
    await zip.click();
    await zip.pressSequentially('12345');
    await expect(zip).toHaveAttribute('data-sn-mask-complete', '');
  });

  test('[unmask] reports bare characters while the element keeps the mask', async ({ page }) => {
    const section = demo(page, 'Unmasked model');
    const input = section.locator('input');
    await input.click();
    await input.pressSequentially('5551234567');

    await expect(input).toHaveValue('(555) 123-4567');
    await expect(section.locator('sn-hint')).toContainText('5551234567');
  });
});
