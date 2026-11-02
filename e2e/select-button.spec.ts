import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('SelectButton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.selectButton);
  });

  test.describe('Single select', () => {
    test('container has role=group', async ({ page }) => {
      const d = demo(page, 'Single select');
      await expect(d.locator('[role="group"]')).toBeVisible();
    });

    test('each option is a button with aria-pressed', async ({ page }) => {
      const d = demo(page, 'Single select');
      const options = d.locator('button.sn-select-option');
      await expect(options).toHaveCount(3);
      for (const btn of await options.all()) {
        const pressed = await btn.getAttribute('aria-pressed');
        expect(['true', 'false']).toContain(pressed);
      }
    });

    test('no option is selected by default (all aria-pressed=false)', async ({ page }) => {
      const d = demo(page, 'Single select');
      const options = d.locator('button.sn-select-option');
      for (const btn of await options.all()) {
        await expect(btn).toHaveAttribute('aria-pressed', 'false');
      }
    });

    test('clicking an option selects it (aria-pressed=true, sn-select-option-selected class)', async ({ page }) => {
      const d = demo(page, 'Single select');
      const options = d.locator('button.sn-select-option');
      await options.nth(0).click();
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'true');
      await expect(options.nth(0)).toHaveClass(/\bsn-select-option-selected\b/);
    });

    test('clicking a different option deselects the previous', async ({ page }) => {
      const d = demo(page, 'Single select');
      const options = d.locator('button.sn-select-option');
      await options.nth(0).click();
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'true');
      await options.nth(1).click();
      await expect(options.nth(1)).toHaveAttribute('aria-pressed', 'true');
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'false');
    });

    test('exactly one option selected at a time', async ({ page }) => {
      const d = demo(page, 'Single select');
      const options = d.locator('button.sn-select-option');
      await options.nth(2).click();
      await expect(options.nth(2)).toHaveAttribute('aria-pressed', 'true');
      const allPressed = await Promise.all(
        (await options.all()).map(btn => btn.getAttribute('aria-pressed'))
      );
      expect(allPressed.filter(v => v === 'true')).toHaveLength(1);
    });

    test('keyboard Space activates the focused option', async ({ page }) => {
      const d = demo(page, 'Single select');
      const options = d.locator('button.sn-select-option');
      await options.nth(1).focus();
      await expect(options.nth(1)).toBeFocused();
      await page.keyboard.press('Space');
      await expect(options.nth(1)).toHaveAttribute('aria-pressed', 'true');
    });

    test('keyboard Enter activates the focused option', async ({ page }) => {
      const d = demo(page, 'Single select');
      const options = d.locator('button.sn-select-option');
      await options.nth(2).focus();
      await expect(options.nth(2)).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(options.nth(2)).toHaveAttribute('aria-pressed', 'true');
    });

    test('two-way binding readout updates when option selected', async ({ page }) => {
      const d = demo(page, 'Single select');
      const options = d.locator('button.sn-select-option');
      await options.nth(0).click();
      await expect(d.locator('.hint-text')).toContainText('"day"');
      await options.nth(1).click();
      await expect(d.locator('.hint-text')).toContainText('"week"');
    });
  });

  test.describe('Multiple select', () => {
    test('multiple options can be selected simultaneously', async ({ page }) => {
      const d = demo(page, 'Multiple select');
      const options = d.locator('button.sn-select-option');
      await options.nth(0).click();
      await options.nth(2).click();
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'true');
      await expect(options.nth(2)).toHaveAttribute('aria-pressed', 'true');
      await expect(options.nth(1)).toHaveAttribute('aria-pressed', 'false');
    });

    test('clicking a selected option in multiple mode deselects it', async ({ page }) => {
      const d = demo(page, 'Multiple select');
      const options = d.locator('button.sn-select-option');
      await options.nth(0).click();
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'true');
      await options.nth(0).click();
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'false');
    });

    test('two-way binding readout reflects the selected array', async ({ page }) => {
      const d = demo(page, 'Multiple select');
      const options = d.locator('button.sn-select-option');
      await options.nth(0).click();
      await options.nth(1).click();
      await expect(d.locator('.hint-text')).toContainText('"mon"');
      await expect(d.locator('.hint-text')).toContainText('"tue"');
    });
  });

  test.describe('Disabled group', () => {
    test('container has aria-disabled=true and sn-select-button-disabled class', async ({ page }) => {
      const d = demo(page, 'Disabled group');
      const group = d.locator('sn-select-button');
      await expect(group).toHaveAttribute('aria-disabled', 'true');
      await expect(group).toHaveClass(/\bsn-select-button-disabled\b/);
    });

    test('all option buttons are disabled', async ({ page }) => {
      const d = demo(page, 'Disabled group');
      const options = d.locator('button.sn-select-option');
      for (const btn of await options.all()) {
        await expect(btn).toBeDisabled();
      }
    });

    test('clicking a disabled group option does not change selection', async ({ page }) => {
      const d = demo(page, 'Disabled group');
      const options = d.locator('button.sn-select-option');
      // All start unselected (group shares singleValue which may have a value from Single select demo
      // but this is a separate binding in a separate demo block)
      const before = await options.nth(0).getAttribute('aria-pressed');
      await options.nth(0).click({ force: true });
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', before ?? 'false');
    });
  });

  test.describe('Disabled option', () => {
    test('individual disabled option button has disabled attribute', async ({ page }) => {
      const d = demo(page, 'Disabled option');
      const options = d.locator('button.sn-select-option');
      // "Unavailable" is the second option (index 1)
      await expect(options.nth(1)).toBeDisabled();
    });

    test('clicking disabled option does not select it', async ({ page }) => {
      const d = demo(page, 'Disabled option');
      const options = d.locator('button.sn-select-option');
      await options.nth(1).click({ force: true });
      await expect(options.nth(1)).toHaveAttribute('aria-pressed', 'false');
    });

    test('enabled options around the disabled one still work', async ({ page }) => {
      const d = demo(page, 'Disabled option');
      const options = d.locator('button.sn-select-option');
      await options.nth(0).click();
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'true');
      await options.nth(2).click();
      await expect(options.nth(2)).toHaveAttribute('aria-pressed', 'true');
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'false');
    });
  });

  test.describe('Reactive form', () => {
    test('selecting an option updates the reactive form readout', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      const options = d.locator('button.sn-select-option');
      await options.nth(0).click();
      await expect(d.locator('.hint-text')).toContainText('"list"');
      await options.nth(1).click();
      await expect(d.locator('.hint-text')).toContainText('"card"');
    });
  });

  test.describe('Reactive form - multiple', () => {
    test('pre-selected bold option has aria-pressed=true', async ({ page }) => {
      const d = demo(page, 'Reactive form - multiple');
      const options = d.locator('button.sn-select-option');
      // formCtrlMultiple starts with ['bold']
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'true');
      await expect(d.locator('.hint-text')).toContainText('"bold"');
    });

    test('selecting additional options adds them to the array readout', async ({ page }) => {
      const d = demo(page, 'Reactive form - multiple');
      const options = d.locator('button.sn-select-option');
      // bold is pre-selected; click italic and underline to add them
      await options.nth(1).click();
      await options.nth(2).click();
      await expect(d.locator('.hint-text')).toContainText('"bold"');
      await expect(d.locator('.hint-text')).toContainText('"italic"');
      await expect(d.locator('.hint-text')).toContainText('"underline"');
    });

    test('deselecting an option removes it from the array readout', async ({ page }) => {
      const d = demo(page, 'Reactive form - multiple');
      const options = d.locator('button.sn-select-option');
      // bold is pre-selected; click it to deselect
      await options.nth(0).click();
      await expect(options.nth(0)).toHaveAttribute('aria-pressed', 'false');
      // readout should not contain bold any more
      const text = await d.locator('.hint-text').textContent();
      expect(text).not.toContain('"bold"');
    });
  });
});
