import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.button);
  });

  test('variant classes: Solid (base) - color variants', async ({ page }) => {
    const demoSection = demo(page, 'Solid (base) - color variants');

    const buttons = demoSection.locator('button');
    // Gate with retrying assertion to ensure buttons have rendered
    await expect(buttons).toHaveCount(6);

    // First button is primary (default)
    const primaryBtn = buttons.nth(0);
    await expect(primaryBtn).toHaveClass(/\bsn-button\b/);
    // Primary does not get an extra color class

    // Secondary button
    const secondaryBtn = buttons.nth(1);
    await expect(secondaryBtn).toHaveClass(/\bsn-color-secondary\b/);

    // Success button
    const successBtn = buttons.nth(2);
    await expect(successBtn).toHaveClass(/\bsn-color-success\b/);

    // Error button
    const errorBtn = buttons.nth(3);
    await expect(errorBtn).toHaveClass(/\bsn-color-error\b/);

    // Warning button
    const warningBtn = buttons.nth(4);
    await expect(warningBtn).toHaveClass(/\bsn-color-warning\b/);

    // Info button
    const infoBtn = buttons.nth(5);
    await expect(infoBtn).toHaveClass(/\bsn-color-info\b/);
  });

  test('variant classes: Variants', async ({ page }) => {
    const demoSection = demo(page, 'Variants');

    // Raised variant
    const raisedBtn = demoSection.locator('button').nth(0);
    await expect(raisedBtn).toHaveClass(/\bsn-raised-button\b/);

    // Outlined variant
    const outlinedBtn = demoSection.locator('button').nth(1);
    await expect(outlinedBtn).toHaveClass(/\bsn-outlined-button\b/);

    // Text variant
    const textBtn = demoSection.locator('button').nth(2);
    await expect(textBtn).toHaveClass(/\bsn-text-button\b/);

    // Icon variant buttons
    const iconBtn1 = demoSection.locator('button').nth(3);
    await expect(iconBtn1).toHaveClass(/\bsn-icon-button\b/);
    await expect(iconBtn1).toHaveAttribute('aria-label', 'Settings');

    const iconBtn2 = demoSection.locator('button').nth(4);
    await expect(iconBtn2).toHaveClass(/\bsn-icon-button\b/);
    await expect(iconBtn2).toHaveAttribute('aria-label', 'Edit');

    const iconBtn3 = demoSection.locator('button').nth(5);
    await expect(iconBtn3).toHaveClass(/\bsn-icon-button\b/);
    await expect(iconBtn3).toHaveAttribute('aria-label', 'Delete');
  });

  test('size modifier classes: Sizes', async ({ page }) => {
    const demoSection = demo(page, 'Sizes');
    const buttons = demoSection.locator('button');
    await expect(buttons).toHaveCount(5);

    await expect(buttons.nth(0)).toHaveClass(/\bsn-button-xs\b/);
    await expect(buttons.nth(1)).toHaveClass(/\bsn-button-sm\b/);
    // Medium is the default and adds no size class of its own.
    await expect(buttons.nth(2)).toHaveClass(/\bsn-button\b/);
    await expect(buttons.nth(2)).not.toHaveClass(/\bsn-button-(xs|sm|lg)\b/);
    await expect(buttons.nth(3)).toHaveClass(/\bsn-button-lg\b/);
    await expect(buttons.nth(4)).toHaveClass(/\bsn-button\b/);
  });

  test('each size step is visibly shorter than the next', async ({ page }) => {
    const buttons = demo(page, 'Sizes').locator('button');
    await expect(buttons).toHaveCount(5);

    const heights = await Promise.all(
      [0, 1, 2, 3].map(async (i) => (await buttons.nth(i).boundingBox())!.height),
    );

    expect(heights[0]).toBeLessThan(heights[1]);
    expect(heights[1]).toBeLessThan(heights[2]);
    expect(heights[2]).toBeLessThan(heights[3]);
  });

  test('pill shape rounds the corners to half the height', async ({ page }) => {
    const pill = demo(page, 'Pill shape').locator('button').first();
    await expect(pill).toHaveClass(/\bsn-button-pill\b/);

    const box = (await pill.boundingBox())!;
    const radius = await pill.evaluate(
      (el) => parseFloat(getComputedStyle(el).borderTopLeftRadius),
    );
    expect(radius).toBeGreaterThanOrEqual(box.height / 2);
  });

  test('disabled state: States', async ({ page }) => {
    const demoSection = demo(page, 'States');

    // Disabled button
    const disabledBtn = demoSection.locator('button').nth(0);
    await expect(disabledBtn).toBeDisabled();
    await expect(disabledBtn).toHaveAttribute('disabled');
  });

  test('keyboard activation: Enter and Space', async ({ page }) => {
    const demoSection = demo(page, 'Solid (base) - color variants');

    const btn = demoSection.locator('button').nth(0);

    // Focus the button
    await btn.focus();
    await expect(btn).toBeFocused();

    // Press Enter (should not throw)
    await btn.press('Enter');

    // Re-focus for Space test
    await btn.focus();
    await expect(btn).toBeFocused();

    // Press Space (should not throw)
    await btn.press('Space');
  });

  test('icon slot: Icons - start (default) and end', async ({ page }) => {
    const demoSection = demo(page, 'Icons - start (default) and end');

    // First button with icon at start
    const btn1 = demoSection.locator('button').nth(0);
    const icon1 = btn1.locator('.sn-icon');
    await expect(icon1).toBeVisible();

    // Second button with icon at end
    const btn2 = demoSection.locator('button').nth(1);
    const icon2 = btn2.locator('.sn-icon');
    await expect(icon2).toBeVisible();

    // Third button with icon and text variant
    const btn3 = demoSection.locator('button').nth(2);
    const icon3 = btn3.locator('.sn-icon');
    await expect(icon3).toBeVisible();
  });

  test('anchor button applies snButton styles', async ({ page }) => {
    const demoSection = demo(page, 'Anchor button');

    const anchorBtn1 = demoSection.locator('a').nth(0);
    await expect(anchorBtn1).toHaveClass(/\bsn-button\b/);
    await expect(anchorBtn1).toHaveAttribute('href', '#');

    const anchorBtn2 = demoSection.locator('a').nth(1);
    await expect(anchorBtn2).toHaveClass(/\bsn-outlined-button\b/);
  });
});
