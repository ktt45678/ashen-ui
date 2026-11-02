import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.tooltip);
  });

  test.describe('Basic', () => {
    test('hovering trigger shows role=tooltip with expected text', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Save' });
      await trigger.hover();
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await expect(tooltip).toHaveText('Save changes');
    });

    test('moving mouse away hides the tooltip', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Save' });
      await trigger.hover();
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await page.mouse.move(0, 0);
      await expect(tooltip).not.toBeVisible({ timeout: 2000 });
    });

    test('trigger has aria-describedby referencing the tooltip while visible', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Save' });
      await trigger.hover();
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });

      const tooltipId = await tooltip.getAttribute('id');
      expect(tooltipId).toBeTruthy();
      await expect(trigger).toHaveAttribute('aria-describedby', tooltipId!);
    });

    test('aria-describedby is removed after tooltip hides', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Save' });
      await trigger.hover();
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await page.mouse.move(0, 0);
      await expect(tooltip).not.toBeVisible({ timeout: 2000 });
      await expect(trigger).not.toHaveAttribute('aria-describedby');
    });

    test('keyboard focus on trigger shows the tooltip', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Save' });
      await trigger.focus();
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await expect(tooltip).toHaveText('Save changes');
    });

    test('blur hides the tooltip', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Save' });
      await trigger.focus();
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await trigger.blur();
      await expect(tooltip).not.toBeVisible({ timeout: 2000 });
    });

    test('Escape hides a visible tooltip immediately', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.getByRole('button', { name: 'Save' });
      await trigger.focus();
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await page.keyboard.press('Escape');
      await expect(tooltip).not.toBeVisible();
    });
  });

  test.describe('Positions', () => {
    test('tooltip appears for each position variant', async ({ page }) => {
      const d = demo(page, 'Positions');
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');

      for (const [name, text] of [
        ['Top', 'Above the button'],
        ['Bottom', 'Below the button'],
        ['Left', 'Left of the button'],
        ['Right', 'Right of the button'],
      ] as const) {
        await d.getByRole('button', { name }).hover();
        await expect(tooltip).toBeVisible({ timeout: 2000 });
        await expect(tooltip).toHaveText(text);
        await page.mouse.move(0, 0);
        await expect(tooltip).not.toBeVisible({ timeout: 2000 });
      }
    });
  });

  test.describe('Disabled', () => {
    test('tooltip does not appear when snTooltipDisabled=true', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const trigger = d.getByRole('button', { name: 'Disabled tooltip' });
      await trigger.hover();
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');
      await expect(tooltip).not.toBeVisible();
    });
  });

  test.describe('On any focusable element', () => {
    test('tooltip shows on hover of a non-button focusable element', async ({ page }) => {
      const d = demo(page, 'On any focusable element');
      const target = d.locator('[tabindex="0"]');
      await target.hover();
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await expect(tooltip).toHaveText('Tooltip on a plain span');
    });
  });

  test.describe('Rich template content', () => {
    test('tooltip with TemplateRef content is shown', async ({ page }) => {
      const d = demo(page, 'Rich template content');
      const trigger = d.getByRole('button', { name: 'Rich tooltip' });
      await trigger.hover();
      const tooltip = page.locator('.cdk-overlay-container [role="tooltip"]');
      await expect(tooltip).toBeVisible({ timeout: 2000 });
      await expect(tooltip).toContainText('Copy selection');
    });
  });
});
