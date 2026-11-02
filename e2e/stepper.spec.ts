import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Stepper', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.stepper);
  });

  test.describe('Basic stepper', () => {
    test('renders an ol with step header buttons', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      await expect(d.locator('ol.sn-stepper-list')).toBeVisible();
      await expect(d.locator('.sn-step-header')).toHaveCount(3);
    });

    test('first step has aria-current=step and tabindex=0', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      const headers = d.locator('.sn-step-header');
      await expect(headers.nth(0)).toHaveAttribute('aria-current', 'step');
      await expect(headers.nth(0)).toHaveAttribute('tabindex', '0');
    });

    test('non-active steps have tabindex=-1', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      const headers = d.locator('.sn-step-header');
      await expect(headers.nth(1)).toHaveAttribute('tabindex', '-1');
      await expect(headers.nth(2)).toHaveAttribute('tabindex', '-1');
    });

    test('only the active step panel is visible', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      const panel = d.locator('.sn-step-panel');
      await expect(panel).toHaveCount(1);
      await expect(panel).toContainText('Account setup content');
    });

    test('clicking step 2 activates it (non-linear)', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      const headers = d.locator('.sn-step-header');
      await headers.nth(1).click();
      await expect(headers.nth(1)).toHaveAttribute('aria-current', 'step');
      await expect(headers.nth(1)).toHaveAttribute('tabindex', '0');
      await expect(headers.nth(0)).not.toHaveAttribute('aria-current', 'step');
    });

    test('clicking a later step shows that step panel content', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      await d.locator('.sn-step-header').nth(2).click();
      await expect(d.locator('.sn-step-panel')).toContainText('Order confirmation content');
    });

    test('completed steps show a check marker', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      await d.locator('.sn-step-header').nth(2).click();
      const items = d.locator('.sn-stepper-item');
      await expect(items.nth(0)).toHaveClass(/sn-stepper-item--completed/);
      await expect(items.nth(1)).toHaveClass(/sn-stepper-item--completed/);
      await expect(items.nth(0).locator('.sn-step-marker-icon')).toBeVisible();
    });

    test('keyboard: ArrowRight moves selection AND DOM focus to next step', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      const headers = d.locator('.sn-step-header');
      await headers.nth(0).focus();
      await expect(headers.nth(0)).toBeFocused();
      await expect(headers.nth(0)).toHaveAttribute('aria-current', 'step');

      await page.keyboard.press('ArrowRight');

      await expect(headers.nth(1)).toBeFocused();
      await expect(headers.nth(1)).toHaveAttribute('aria-current', 'step');
    });

    test('keyboard: ArrowLeft moves selection AND DOM focus to previous step', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      const headers = d.locator('.sn-step-header');
      await headers.nth(1).click();
      await expect(headers.nth(1)).toBeFocused();
      await expect(headers.nth(1)).toHaveAttribute('aria-current', 'step');

      await page.keyboard.press('ArrowLeft');

      await expect(headers.nth(0)).toBeFocused();
      await expect(headers.nth(0)).toHaveAttribute('aria-current', 'step');
    });

    test('keyboard: Home moves focus and selection to first step', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      const headers = d.locator('.sn-step-header');
      await headers.nth(2).click();
      await expect(headers.nth(2)).toHaveAttribute('aria-current', 'step');

      await page.keyboard.press('Home');

      await expect(headers.nth(0)).toBeFocused();
      await expect(headers.nth(0)).toHaveAttribute('aria-current', 'step');
    });

    test('keyboard: End moves focus and selection to last step', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      const headers = d.locator('.sn-step-header');
      await headers.nth(0).focus();
      await page.keyboard.press('End');

      await expect(headers.nth(2)).toBeFocused();
      await expect(headers.nth(2)).toHaveAttribute('aria-current', 'step');
    });

    test('keyboard: ArrowRight from last step wraps to first', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      const headers = d.locator('.sn-step-header');
      await headers.nth(2).click();
      await expect(headers.nth(2)).toHaveAttribute('aria-current', 'step');

      await page.keyboard.press('ArrowRight');

      await expect(headers.nth(0)).toBeFocused();
      await expect(headers.nth(0)).toHaveAttribute('aria-current', 'step');
    });

    test('step panel has role=region and aria-labelledby pointing to active step button', async ({ page }) => {
      const d = demo(page, 'Basic stepper');
      const panel = d.locator('[role="region"].sn-step-panel');
      await expect(panel).toBeVisible();
      const labelledBy = await panel.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      const activeBtn = d.locator('.sn-step-header[aria-current="step"]');
      const btnId = await activeBtn.getAttribute('id');
      expect(labelledBy).toBe(btnId);
    });
  });

  test.describe('Linear stepper (no skipping steps)', () => {
    test('clicking a step more than one ahead does nothing', async ({ page }) => {
      const d = demo(page, 'Linear stepper (no skipping steps)');
      const headers = d.locator('.sn-step-header');
      await expect(headers.nth(0)).toHaveAttribute('aria-current', 'step');
      // Step 3 is disabled in linear mode when on step 1 - force the click to confirm no selection change
      await headers.nth(2).click({ force: true });
      await expect(headers.nth(0)).toHaveAttribute('aria-current', 'step');
      await expect(headers.nth(2)).not.toHaveAttribute('aria-current', 'step');
    });

    test('the next adjacent step is clickable', async ({ page }) => {
      const d = demo(page, 'Linear stepper (no skipping steps)');
      const headers = d.locator('.sn-step-header');
      await d.locator('button').filter({ hasText: 'Continue' }).click();
      await expect(headers.nth(1)).toHaveAttribute('aria-current', 'step');
    });

    test('future steps beyond +1 are disabled', async ({ page }) => {
      const d = demo(page, 'Linear stepper (no skipping steps)');
      const headers = d.locator('.sn-step-header');
      await expect(headers.nth(2)).toBeDisabled();
    });
  });

  test.describe('Completed override + disabled step', () => {
    test('step 1 is marked completed and shows check marker', async ({ page }) => {
      const d = demo(page, 'Completed override + disabled step');
      const items = d.locator('.sn-stepper-item');
      await expect(items.nth(0)).toHaveClass(/sn-stepper-item--completed/);
      await expect(items.nth(0).locator('.sn-step-marker-icon')).toBeVisible();
    });

    test('disabled step 3 has the disabled attribute', async ({ page }) => {
      const d = demo(page, 'Completed override + disabled step');
      const headers = d.locator('.sn-step-header');
      await expect(headers.nth(2)).toBeDisabled();
    });

    test('clicking disabled step does not change the active step', async ({ page }) => {
      const d = demo(page, 'Completed override + disabled step');
      const headers = d.locator('.sn-step-header');
      await headers.nth(2).click({ force: true });
      await expect(headers.nth(1)).toHaveAttribute('aria-current', 'step');
    });
  });

  test.describe('Vertical orientation', () => {
    test('stepper has sn-stepper--vertical class', async ({ page }) => {
      const d = demo(page, 'Vertical orientation');
      await expect(d.locator('.sn-stepper')).toHaveClass(/sn-stepper--vertical/);
    });

    test('keyboard: ArrowDown moves selection and focus to next step', async ({ page }) => {
      const d = demo(page, 'Vertical orientation');
      const headers = d.locator('.sn-step-header');
      await headers.nth(0).focus();
      await expect(headers.nth(0)).toHaveAttribute('aria-current', 'step');

      await page.keyboard.press('ArrowDown');

      await expect(headers.nth(1)).toBeFocused();
      await expect(headers.nth(1)).toHaveAttribute('aria-current', 'step');
    });

    test('keyboard: ArrowUp moves selection and focus to previous step', async ({ page }) => {
      const d = demo(page, 'Vertical orientation');
      const headers = d.locator('.sn-step-header');
      await headers.nth(1).click();
      await expect(headers.nth(1)).toHaveAttribute('aria-current', 'step');

      await page.keyboard.press('ArrowUp');

      await expect(headers.nth(0)).toBeFocused();
      await expect(headers.nth(0)).toHaveAttribute('aria-current', 'step');
    });

    test('active step panel is rendered inline in the list for vertical orientation', async ({ page }) => {
      const d = demo(page, 'Vertical orientation');
      const list = d.locator('ol.sn-stepper-list');
      await expect(list.locator('.sn-step-panel')).toBeVisible();
    });
  });

  test.describe('Two-way binding with external controls', () => {
    test('Next button advances the stepper', async ({ page }) => {
      const d = demo(page, 'Two-way binding with external controls');
      const headers = d.locator('.sn-step-header');
      await d.locator('button').filter({ hasText: 'Next' }).click();
      await expect(headers.nth(1)).toHaveAttribute('aria-current', 'step');
    });

    test('Previous button goes back', async ({ page }) => {
      const d = demo(page, 'Two-way binding with external controls');
      const headers = d.locator('.sn-step-header');
      await d.locator('button').filter({ hasText: 'Next' }).click();
      await expect(headers.nth(1)).toHaveAttribute('aria-current', 'step');
      await d.locator('button').filter({ hasText: 'Previous' }).click();
      await expect(headers.nth(0)).toHaveAttribute('aria-current', 'step');
    });
  });
});
