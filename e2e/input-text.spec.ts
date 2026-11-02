import { test, expect } from '@playwright/test';
import { ROUTES, demo, describedbyIds } from './support/pages';

test.describe('InputText', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.inputText);
  });

  test('Basic: input renders with snInputText directive', async ({ page }) => {
    const demoSection = demo(page, 'Basic');
    const input = demoSection.locator('input');

    await expect(input).toHaveClass(/\bsn-input-text\b/);
  });

  test('Sizes: small input has sn-input-text-sm class', async ({ page }) => {
    const demoSection = demo(page, 'Sizes');
    const inputs = demoSection.locator('input');
    const smallInput = inputs.nth(0);

    await expect(smallInput).toHaveClass(/\bsn-input-text-sm\b/);
  });

  test('Sizes: large input has sn-input-text-lg class', async ({ page }) => {
    const demoSection = demo(page, 'Sizes');
    const inputs = demoSection.locator('input');
    const largeInput = inputs.nth(2);

    await expect(largeInput).toHaveClass(/\bsn-input-text-lg\b/);
  });

  test('Sizes: medium input has no size class', async ({ page }) => {
    const demoSection = demo(page, 'Sizes');
    const inputs = demoSection.locator('input');
    const mediumInput = inputs.nth(1);

    const classList = await mediumInput.getAttribute('class');
    expect(classList).not.toMatch(/sn-input-text-sm/);
    expect(classList).not.toMatch(/sn-input-text-lg/);
  });

  test('Error state: input has sn-input-text-error class', async ({ page }) => {
    const demoSection = demo(page, 'Error state');
    const input = demoSection.locator('input');

    await expect(input).toHaveClass(/\bsn-input-text-error\b/);
  });

  test('Error state: input has aria-invalid true', async ({ page }) => {
    const demoSection = demo(page, 'Error state');
    const input = demoSection.locator('input');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('Disabled: input has disabled attribute', async ({ page }) => {
    const demoSection = demo(page, 'Disabled');
    const input = demoSection.locator('input');

    await expect(input).toBeDisabled();
  });

  test('Read-only: input has readonly attribute', async ({ page }) => {
    const demoSection = demo(page, 'Read-only');
    const input = demoSection.locator('input');

    await expect(input).toHaveAttribute('readonly');
  });

  test('Reactive form with validation: email input initially valid and untouched', async ({ page }) => {
    const demoSection = demo(page, 'Reactive form with validation');
    const input = demoSection.locator('input[type="email"]');
    const error = demoSection.locator('.sn-form-field-error');

    // Initially untouched and without error class
    const classList = await input.getAttribute('class');
    expect(classList).not.toMatch(/sn-input-text-error/);
    await expect(error).not.toBeVisible();
  });

  test('Reactive form with validation: error appears after touching and having invalid email', async ({ page }) => {
    const demoSection = demo(page, 'Reactive form with validation');
    const input = demoSection.locator('input[type="email"]');
    const error = demoSection.locator('.sn-form-field-error');

    // Type invalid email
    await input.fill('invalid');
    // Blur to mark as touched
    await input.blur();

    // Now it should have error class and aria-invalid
    await expect(input).toHaveClass(/\bsn-input-text-error\b/);
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(error).toBeVisible();
  });

  test('Reactive form with validation: error clears with valid email', async ({ page }) => {
    const demoSection = demo(page, 'Reactive form with validation');
    const input = demoSection.locator('input[type="email"]');
    const error = demoSection.locator('.sn-form-field-error');

    // Type invalid email and blur
    await input.fill('invalid');
    await input.blur();
    await expect(input).toHaveClass(/\bsn-input-text-error\b/);

    // Type valid email
    await input.fill('user@example.com');

    // Error should clear
    const classList = await input.getAttribute('class');
    expect(classList).not.toMatch(/sn-input-text-error/);
    await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    await expect(error).not.toBeVisible();
  });

  test('Inside FormField: label for attribute equals input id', async ({ page }) => {
    const demoSection = demo(page, 'Inside FormField');
    const label = demoSection.locator('label').first();
    const input = demoSection.locator('input').first();

    const labelFor = await label.getAttribute('for');
    const inputId = await input.getAttribute('id');

    expect(labelFor).toBeTruthy();
    expect(inputId).toBeTruthy();
    expect(labelFor).toBe(inputId);
  });

  test('Inside FormField: hint id is in aria-describedby', async ({ page }) => {
    const demoSection = demo(page, 'Inside FormField');
    const input = demoSection.locator('input').nth(1); // The one with hint
    const hint = demoSection.locator('.sn-form-field-hint');

    // Gate aria-describedby read with retrying assertion to ensure registration has flushed
    await expect(input).toHaveAttribute('aria-describedby', /\S/);

    const hintId = await hint.getAttribute('id');
    const describedByIds = await describedbyIds(input);

    expect(hintId).toBeTruthy();
    expect(describedByIds).toContain(hintId);
  });

  test('Re-skin via CSS variables: border-radius is customized', async ({ page }) => {
    const demoSection = demo(page, 'Re-skin via CSS variables');
    const input = demoSection.locator('input');

    const borderRadius = await input.evaluate(el =>
      getComputedStyle(el).borderRadius
    );

    // The style sets --sn-input-text-border-radius: 9999px, so it should be a very large value
    expect(borderRadius).toMatch(/\d+px/);
    const radiusValue = parseInt(borderRadius);
    expect(radiusValue).toBeGreaterThan(100); // Should be 9999 or close
  });
});
