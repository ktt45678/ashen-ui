import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('AutoComplete', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.autocomplete);
  });

  test.describe('Basic with ngModel', () => {
    test('typing into the input opens the suggestion panel and filters suggestions', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const input = d.locator('input[role="combobox"]');
      await input.fill('fra');
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();
      const options = panel.locator('[role="option"]');
      await expect(options.first()).toBeVisible();
      // All visible options must include the query string (case-insensitive)
      const all = await options.all();
      for (const opt of all) {
        const text = await opt.textContent();
        expect(text!.toLowerCase()).toContain('fra');
      }
    });

    test('ArrowDown highlights a suggestion and sets aria-activedescendant', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const input = d.locator('input[role="combobox"]');
      await input.fill('a');
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      await input.press('ArrowDown');
      // Wait for the active option class to appear before reading the id
      await expect(panel.locator('.sn-listbox-option-active')).toHaveCount(1);
      const activeId = await input.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      const activeOption = page.locator(`#${activeId}`);
      await expect(activeOption).toHaveClass(/sn-listbox-option-active/);
    });

    test('Enter commits highlighted suggestion into the input and closes the panel', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const input = d.locator('input[role="combobox"]');
      await input.fill('a');
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      await input.press('ArrowDown');
      // Wait for the active option before reading its content
      await expect(panel.locator('.sn-listbox-option-active')).toHaveCount(1);
      const activeId = await input.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      const activeOption = page.locator(`#${activeId}`);
      const expectedText = (await activeOption.textContent())!.trim();

      await input.press('Enter');
      await expect(panel).not.toBeVisible();
      await expect(input).toHaveValue(expectedText);
    });

    test('clicking a suggestion commits it, closes the panel, and panel does NOT reopen', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const input = d.locator('input[role="combobox"]');
      await input.fill('a');
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      const firstOption = panel.locator('[role="option"]').first();
      const expectedText = (await firstOption.textContent())!.trim();
      await firstOption.click();

      // Panel must close and input must show the picked value
      await expect(panel).not.toBeVisible();
      await expect(input).toHaveValue(expectedText);

      // Regression: after a click-pick the panel must stay closed (focus-reopen guard)
      await expect(panel).not.toBeVisible();
    });

    test('Escape closes the panel leaving typed text intact', async ({ page }) => {
      const d = demo(page, 'Basic with ngModel');
      const input = d.locator('input[role="combobox"]');
      await input.fill('fra');
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      await input.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(input).toHaveValue('fra');
    });
  });

  test.describe('Multiple object values', () => {
    test('the panel is anchored and sized to the whole control, not the input slot', async ({
      page,
    }) => {
      const d = demo(page, 'Multiple object values');
      const wrapper = d.locator('.sn-autocomplete-wrapper-multiple');
      const input = d.locator('input[role="combobox"]');
      await input.click();

      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();
      // The open animation slides the panel in, so measure once it has settled.
      await panel.evaluate((el) =>
        Promise.all(el.getAnimations().map((a) => a.finished.catch(() => undefined))),
      );

      const wrapperBox = (await wrapper.boundingBox())!;
      const inputBox = (await input.boundingBox())!;
      const panelBox = (await panel.boundingBox())!;

      // The chips push the input well to the right of the control it sits in,
      // so an input-anchored panel would be visibly offset and too narrow.
      expect(inputBox.x).toBeGreaterThan(wrapperBox.x + 20);
      expect(panelBox.x).toBeCloseTo(wrapperBox.x, 0);
      expect(panelBox.width).toBeCloseTo(wrapperBox.width, 0);
      expect(panelBox.y).toBeCloseTo(wrapperBox.y + wrapperBox.height, 0);
    });

    test('clicking the input again keeps the panel open and the caret in place', async ({
      page,
    }) => {
      const d = demo(page, 'Multiple object values');
      const input = d.locator('input[role="combobox"]');
      await input.click();

      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();
      await expect(input).toBeFocused();

      // A backdrop would swallow this second click: the panel would close and
      // the input would lose focus.
      await input.click();
      await expect(panel).toBeVisible();
      await expect(input).toBeFocused();

      await page.locator('h1').click();
      await expect(panel).not.toBeVisible();
    });

    test('only the control draws a focus ring, not the inner input', async ({ page }) => {
      const d = demo(page, 'Multiple object values');
      const wrapper = d.locator('.sn-autocomplete-wrapper-multiple');
      const input = d.locator('input[role="combobox"]');
      await input.click();

      await expect(input).toHaveCSS('box-shadow', 'none');
      await expect(input).toHaveCSS('border-top-width', '0px');
      expect(await wrapper.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none');
    });
  });
  test.describe('Toggling selection in the panel', () => {
    test('a picked suggestion stays, marked, and picking it again clears it', async ({ page }) => {
      const d = demo(page, 'Toggling selection in the panel');
      const input = d.locator('input[role="combobox"]');
      await input.click();

      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      const options = panel.locator('[role="option"]');
      const count = await options.count();
      const first = options.first();
      await first.click();

      await expect(options).toHaveCount(count);
      await expect(first).toHaveClass(/sn-listbox-option-selected/);
      await expect(first.locator('.sn-listbox-option-check')).toBeVisible();
      await expect(d.locator('.sn-autocomplete-chip')).toHaveCount(2);

      await first.click();
      await expect(first).not.toHaveClass(/sn-listbox-option-selected/);
      await expect(d.locator('.sn-autocomplete-chip')).toHaveCount(1);
    });

    test('the selected row keeps its tint under the pointer', async ({ page }) => {
      const d = demo(page, 'Toggling selection in the panel');
      const input = d.locator('input[role="combobox"]');
      await input.click();

      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      const selected = panel.locator('.sn-listbox-option-selected').first();
      const resting = await selected.evaluate((el) => getComputedStyle(el).backgroundColor);
      const color = await selected.evaluate((el) => getComputedStyle(el).color);

      await selected.hover();
      expect(await selected.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(resting);
      expect(await selected.evaluate((el) => getComputedStyle(el).color)).toBe(color);
    });
  });

  test.describe('One badge for the whole selection', () => {
    test('renders one badge, no clear buttons, and hides it while typing', async ({ page }) => {
      const d = demo(page, 'One badge for the whole selection');
      await expect(d.locator('.selection-badge')).toHaveText('2 selected');
      await expect(d.locator('.sn-autocomplete-chip-remove')).toHaveCount(0);

      await d.locator('input[role="combobox"]').click();
      await expect(d.locator('.selection-badge')).toHaveCount(0);

      await page.locator('h1').click();
      await expect(d.locator('.selection-badge')).toHaveText('2 selected');
    });
  });
});
