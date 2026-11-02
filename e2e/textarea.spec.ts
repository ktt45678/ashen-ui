import { test, expect } from '@playwright/test';
import { ROUTES, demo, describedbyIds } from './support/pages';

test.describe('Textarea', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.textarea);
  });

  test('Basic: textarea renders with snTextarea and sn-input-text classes', async ({ page }) => {
    const demoSection = demo(page, 'Basic');
    const textarea = demoSection.locator('textarea');

    await expect(textarea).toHaveClass(/\bsn-input-text\b/);
    await expect(textarea).toHaveClass(/\bsn-textarea\b/);
  });

  test('Sizes: small textarea has sn-input-text-sm class', async ({ page }) => {
    const demoSection = demo(page, 'Sizes');
    const textareas = demoSection.locator('textarea');
    const smallTextarea = textareas.nth(0);

    await expect(smallTextarea).toHaveClass(/\bsn-input-text-sm\b/);
  });

  test('Sizes: large textarea has sn-input-text-lg class', async ({ page }) => {
    const demoSection = demo(page, 'Sizes');
    const textareas = demoSection.locator('textarea');
    const largeTextarea = textareas.nth(2);

    await expect(largeTextarea).toHaveClass(/\bsn-input-text-lg\b/);
  });

  test('Sizes: medium textarea has no size class', async ({ page }) => {
    const demoSection = demo(page, 'Sizes');
    const textareas = demoSection.locator('textarea');
    const mediumTextarea = textareas.nth(1);

    const classList = await mediumTextarea.getAttribute('class');
    expect(classList).not.toMatch(/sn-input-text-sm/);
    expect(classList).not.toMatch(/sn-input-text-lg/);
  });

  test('Error state: textarea has sn-input-text-error class', async ({ page }) => {
    const demoSection = demo(page, 'Error state');
    const textarea = demoSection.locator('textarea');

    await expect(textarea).toHaveClass(/\bsn-input-text-error\b/);
  });

  test('Error state: textarea has aria-invalid true', async ({ page }) => {
    const demoSection = demo(page, 'Error state');
    const textarea = demoSection.locator('textarea');

    await expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  test('Disabled: textarea has disabled attribute', async ({ page }) => {
    const demoSection = demo(page, 'Disabled');
    const textarea = demoSection.locator('textarea');

    await expect(textarea).toBeDisabled();
  });

  test('Read-only: textarea has readonly attribute', async ({ page }) => {
    const demoSection = demo(page, 'Read-only');
    const textarea = demoSection.locator('textarea');

    await expect(textarea).toHaveAttribute('readonly');
  });

  test('Inside FormField: label for attribute equals textarea id', async ({ page }) => {
    const demoSection = demo(page, 'Inside FormField');
    const label = demoSection.locator('label');
    const textarea = demoSection.locator('textarea');

    const labelFor = await label.getAttribute('for');
    const textareaId = await textarea.getAttribute('id');

    expect(labelFor).toBeTruthy();
    expect(textareaId).toBeTruthy();
    expect(labelFor).toBe(textareaId);
  });

  test('Inside FormField: hint id is in aria-describedby', async ({ page }) => {
    const demoSection = demo(page, 'Inside FormField');
    const textarea = demoSection.locator('textarea');
    const hint = demoSection.locator('.sn-form-field-hint');

    // Gate aria-describedby read with retrying assertion to ensure registration has flushed
    await expect(textarea).toHaveAttribute('aria-describedby', /\S/);

    const hintId = await hint.getAttribute('id');
    const describedByIds = await describedbyIds(textarea);

    expect(hintId).toBeTruthy();
    expect(describedByIds).toContain(hintId);
  });

  test('Reactive form with validation: textarea initially valid and untouched', async ({ page }) => {
    const demoSection = demo(page, 'Reactive form with validation');
    const textarea = demoSection.locator('textarea');
    const error = demoSection.locator('.sn-form-field-error');

    // Initially untouched and without error class
    const classList = await textarea.getAttribute('class');
    expect(classList).not.toMatch(/sn-input-text-error/);
    await expect(error).not.toBeVisible();
  });

  test('Reactive form with validation: error appears after touching empty field', async ({ page }) => {
    const demoSection = demo(page, 'Reactive form with validation');
    const textarea = demoSection.locator('textarea');
    const error = demoSection.locator('.sn-form-field-error');

    // Focus and blur without typing to mark as touched
    await textarea.focus();
    await textarea.blur();

    // Now it should have error class and aria-invalid
    await expect(textarea).toHaveClass(/\bsn-input-text-error\b/);
    await expect(textarea).toHaveAttribute('aria-invalid', 'true');
    await expect(error).toBeVisible();
  });

  test('Reactive form with validation: error clears when text is entered', async ({ page }) => {
    const demoSection = demo(page, 'Reactive form with validation');
    const textarea = demoSection.locator('textarea');
    const error = demoSection.locator('.sn-form-field-error');

    // Blur to show error
    await textarea.focus();
    await textarea.blur();
    await expect(textarea).toHaveClass(/\bsn-input-text-error\b/);

    // Type some text
    await textarea.fill('Some notes here');

    // Error should clear
    const classList = await textarea.getAttribute('class');
    expect(classList).not.toMatch(/sn-input-text-error/);
    await expect(textarea).not.toHaveAttribute('aria-invalid', 'true');
    await expect(error).not.toBeVisible();
  });

  test('Interactive validation: no error visible initially', async ({ page }) => {
    const demoSection = demo(page, 'Interactive validation');
    const textarea = demoSection.locator('textarea');
    const error = demoSection.locator('.sn-form-field-error');

    // Type something
    await textarea.fill('some description');
    await expect(error).not.toBeVisible();
  });

  test('Interactive validation: error appears on blur when empty', async ({ page }) => {
    const demoSection = demo(page, 'Interactive validation');
    const textarea = demoSection.locator('textarea');
    const error = demoSection.locator('.sn-form-field-error');

    // Type and then clear
    await textarea.fill('description');
    await textarea.clear();
    // Blur
    await textarea.press('Tab');

    await expect(error).toBeVisible();
    // Gate aria-describedby read with retrying assertion to ensure registration has flushed
    await expect(textarea).toHaveAttribute('aria-describedby', /\S/);

    const errorId = await error.getAttribute('id');
    const describedByIds = await describedbyIds(textarea);
    expect(describedByIds).toContain(errorId);
  });

  test('Interactive validation: error disappears when value entered again', async ({ page }) => {
    const demoSection = demo(page, 'Interactive validation');
    const textarea = demoSection.locator('textarea');
    const error = demoSection.locator('.sn-form-field-error');

    // Clear and blur to show error
    await textarea.clear();
    await textarea.press('Tab');
    await expect(error).toBeVisible();

    // Capture the error id while the error is still visible
    const errorId = await error.getAttribute('id');

    // Re-focus and type
    await textarea.focus();
    await textarea.fill('new description');

    // Error should disappear
    await expect(error).not.toBeVisible();
    const describedByIds = await describedbyIds(textarea);
    expect(describedByIds).not.toContain(errorId);
  });

  test('Textarea has vertical resize by default', async ({ page }) => {
    const demoSection = demo(page, 'Basic');
    const textarea = demoSection.locator('textarea');

    const resize = await textarea.evaluate(el =>
      getComputedStyle(el).resize
    );

    expect(resize).toBe('vertical');
  });

  test('Textarea has non-trivial min-height', async ({ page }) => {
    const demoSection = demo(page, 'Basic');
    const textarea = demoSection.locator('textarea');

    const minHeight = await textarea.evaluate(el =>
      getComputedStyle(el).minHeight
    );

    // Should be 4.5rem (the default) or similar
    expect(minHeight).toMatch(/\d+(\.\d+)?(px|rem)/);
    // Extract the numeric value to verify it's reasonable
    const match = minHeight.match(/(\d+(?:\.\d+)?)/);
    if (match) {
      const value = parseFloat(match[0]);
      expect(value).toBeGreaterThan(0);
    }
  });

  test('Re-skin via CSS variables: can override resize property', async ({ page }) => {
    const demoSection = demo(page, 'Re-skin via CSS variables');
    const textarea = demoSection.locator('textarea');

    const resize = await textarea.evaluate(el =>
      getComputedStyle(el).resize
    );

    // The example sets --sn-textarea-resize: none, so it should be none
    expect(resize).toBe('none');
  });
});
