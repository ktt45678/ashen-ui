import { test, expect } from '@playwright/test';
import { ROUTES, demo, describedbyIds } from './support/pages';

test.describe('InputGroup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.inputGroup);
  });

  test.describe('Leading text addon', () => {
    test('group has role=group', async ({ page }) => {
      const d = demo(page, 'Leading text addon');
      await expect(d.locator('[role="group"]')).toBeVisible();
    });

    test('group host has sn-input-group class', async ({ page }) => {
      const d = demo(page, 'Leading text addon');
      await expect(d.locator('sn-input-group')).toHaveClass(/\bsn-input-group\b/);
    });

    test('leading addon has sn-input-group-addon class', async ({ page }) => {
      const d = demo(page, 'Leading text addon');
      await expect(d.locator('sn-input-group-addon')).toHaveClass(/\bsn-input-group-addon\b/);
    });

    test('addon renders text content', async ({ page }) => {
      const d = demo(page, 'Leading text addon');
      await expect(d.locator('sn-input-group-addon')).toContainText('https://');
    });

    test('addon appears before the input in DOM order', async ({ page }) => {
      const d = demo(page, 'Leading text addon');
      const group = d.locator('sn-input-group');
      const children = group.locator('> *');
      await expect(children.nth(0)).toHaveClass(/\bsn-input-group-addon\b/);
      await expect(children.nth(1)).toBeVisible();
    });

    test('input is focusable', async ({ page }) => {
      const d = demo(page, 'Leading text addon');
      const input = d.locator('input');
      await input.focus();
      await expect(input).toBeFocused();
    });

    test('typing in the input works normally', async ({ page }) => {
      const d = demo(page, 'Leading text addon');
      const input = d.locator('input');
      await input.fill('example.com');
      await expect(input).toHaveValue('example.com');
    });
  });

  test.describe('Trailing icon addon', () => {
    test('addon has sn-input-group-addon class', async ({ page }) => {
      const d = demo(page, 'Trailing icon addon');
      await expect(d.locator('sn-input-group-addon')).toHaveClass(/\bsn-input-group-addon\b/);
    });

    test('icon addon renders a span with sn-icon class', async ({ page }) => {
      const d = demo(page, 'Trailing icon addon');
      await expect(d.locator('sn-input-group-addon .sn-icon')).toBeVisible();
    });

    test('icon addon is aria-hidden (decorative)', async ({ page }) => {
      const d = demo(page, 'Trailing icon addon');
      await expect(d.locator('sn-input-group-addon .sn-icon')).toHaveAttribute('aria-hidden', 'true');
    });

    test('addon appears after the input in DOM order', async ({ page }) => {
      const d = demo(page, 'Trailing icon addon');
      const group = d.locator('sn-input-group');
      const children = group.locator('> *');
      await expect(children.nth(1)).toHaveClass(/\bsn-input-group-addon\b/);
    });

    test('input is focusable and accepts text', async ({ page }) => {
      const d = demo(page, 'Trailing icon addon');
      const input = d.locator('input');
      await input.fill('query');
      await expect(input).toHaveValue('query');
    });
  });

  test.describe('Addons on both sides', () => {
    test('first child is the leading icon addon', async ({ page }) => {
      const d = demo(page, 'Addons on both sides');
      const group = d.locator('sn-input-group');
      await expect(group.locator('> *').nth(0)).toHaveClass(/\bsn-input-group-addon\b/);
    });

    test('last child is the trailing text addon', async ({ page }) => {
      const d = demo(page, 'Addons on both sides');
      const group = d.locator('sn-input-group');
      const addons = group.locator('sn-input-group-addon');
      await expect(addons).toHaveCount(2);
      await expect(addons.nth(1)).toContainText('@domain.com');
    });

    test('there are exactly two addons', async ({ page }) => {
      const d = demo(page, 'Addons on both sides');
      await expect(d.locator('sn-input-group-addon')).toHaveCount(2);
    });

    test('input in the middle is focusable', async ({ page }) => {
      const d = demo(page, 'Addons on both sides');
      const input = d.locator('input');
      await input.focus();
      await expect(input).toBeFocused();
    });
  });

  test.describe('Button addon (trailing)', () => {
    test('button addon is a native button', async ({ page }) => {
      const d = demo(page, 'Button addon (trailing)');
      await expect(d.locator('sn-input-group button')).toBeVisible();
    });

    test('button addon is focusable in tab order', async ({ page }) => {
      const d = demo(page, 'Button addon (trailing)');
      const btn = d.locator('sn-input-group button');
      await btn.focus();
      await expect(btn).toBeFocused();
    });

    test('button addon is clickable', async ({ page }) => {
      const d = demo(page, 'Button addon (trailing)');
      const btn = d.locator('sn-input-group button');
      await expect(btn).toBeEnabled();
      await btn.click();
    });

    test('input precedes button in DOM order', async ({ page }) => {
      const d = demo(page, 'Button addon (trailing)');
      const group = d.locator('sn-input-group');
      await expect(group.locator('> *').nth(0)).toBeVisible();
      await expect(group.locator('> button')).toBeVisible();
    });

    test('typing in the input works independently of button', async ({ page }) => {
      const d = demo(page, 'Button addon (trailing)');
      const input = d.locator('input');
      await input.fill('SUMMER20');
      await expect(input).toHaveValue('SUMMER20');
    });
  });

  test.describe('Button addon (leading)', () => {
    test('leading button has sn-input-group-addon class applied via snClass', async ({ page }) => {
      const d = demo(page, 'Button addon (leading)');
      const btn = d.locator('sn-input-group button');
      await expect(btn).toHaveClass(/\bsn-input-group-addon\b/);
    });

    test('leading button renders an icon span', async ({ page }) => {
      const d = demo(page, 'Button addon (leading)');
      await expect(d.locator('sn-input-group button .sn-icon')).toBeVisible();
    });

    test('input is focusable after the leading button', async ({ page }) => {
      const d = demo(page, 'Button addon (leading)');
      const input = d.locator('input');
      await input.focus();
      await expect(input).toBeFocused();
    });
  });

  test.describe('Inside FormField with validation', () => {
    test('form-field wraps the input group', async ({ page }) => {
      const d = demo(page, 'Inside FormField with validation');
      await expect(d.locator('sn-form-field sn-input-group')).toBeVisible();
    });

    test('label is associated with the input via for/id', async ({ page }) => {
      const d = demo(page, 'Inside FormField with validation');
      const label = d.locator('label');
      const input = d.locator('input');
      await expect(label).toBeVisible();
      const labelFor = await label.getAttribute('for');
      const inputId = await input.getAttribute('id');
      expect(labelFor).toBeTruthy();
      expect(inputId).toBeTruthy();
      expect(labelFor).toBe(inputId);
    });

    test('input is initially valid: no error visible', async ({ page }) => {
      const d = demo(page, 'Inside FormField with validation');
      await expect(d.locator('sn-error')).not.toBeVisible();
    });

    test('error appears when input is touched while empty', async ({ page }) => {
      const d = demo(page, 'Inside FormField with validation');
      const input = d.locator('input');
      await input.focus();
      await input.press('Tab');
      await expect(d.locator('sn-error')).toBeVisible();
      await expect(d.locator('sn-error')).toContainText('Website is required');
    });

    test('error id is wired into input aria-describedby on validation failure', async ({ page }) => {
      const d = demo(page, 'Inside FormField with validation');
      const input = d.locator('input');
      await input.focus();
      await input.press('Tab');
      await expect(d.locator('sn-error')).toBeVisible();
      await expect(input).toHaveAttribute('aria-describedby', /\S/);
      const errorId = await d.locator('.sn-form-field-error').getAttribute('id');
      const ids = await describedbyIds(input);
      expect(errorId).toBeTruthy();
      expect(ids).toContain(errorId);
    });

    test('status readout updates after interaction', async ({ page }) => {
      const d = demo(page, 'Inside FormField with validation');
      const input = d.locator('input');
      await input.focus();
      await input.press('Tab');
      await expect(d.locator('.hint-text')).toContainText('INVALID');
    });

    test('filling the input clears the error', async ({ page }) => {
      const d = demo(page, 'Inside FormField with validation');
      const input = d.locator('input');
      await input.focus();
      await input.press('Tab');
      await expect(d.locator('sn-error')).toBeVisible();
      await input.fill('mysite.com');
      await expect(d.locator('sn-error')).not.toBeVisible();
      await expect(d.locator('.hint-text')).toContainText('VALID');
    });
  });
});
