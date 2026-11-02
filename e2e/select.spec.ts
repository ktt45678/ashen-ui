import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Select', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.select);
  });

  test.describe('Basic select with placeholder', () => {
    test('closed trigger shows placeholder text', async ({ page }) => {
      const d = demo(page, 'Basic select with placeholder');
      const trigger = d.locator('button[role="combobox"]');
      await expect(trigger.locator('.sn-select-placeholder')).toBeVisible();
      await expect(trigger.locator('.sn-select-placeholder')).toContainText('Pick a framework');
    });

    test('clicking trigger opens panel with role=listbox in overlay', async ({ page }) => {
      const d = demo(page, 'Basic select with placeholder');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();
    });

    test('panel min-width matches trigger width', async ({ page }) => {
      const d = demo(page, 'Basic select with placeholder');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      const triggerBox = await trigger.boundingBox();
      // CDK sizes the overlay pane element; the listbox panel fills it via width:100%
      const overlayPane = page.locator('.sn-select-overlay-panel');
      const paneBox = await overlayPane.boundingBox();
      expect(triggerBox).not.toBeNull();
      expect(paneBox).not.toBeNull();
      // Allow 2px tolerance for borders/sub-pixel
      expect(paneBox!.width).toBeGreaterThanOrEqual(triggerBox!.width - 2);
    });

    test('ArrowDown changes aria-activedescendant on trigger', async ({ page }) => {
      const d = demo(page, 'Basic select with placeholder');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      // Wait for key manager init (setTimeout 0) - aria-activedescendant is set after init
      await expect(trigger).toHaveAttribute('aria-activedescendant', /\S/);
      const activeBefore = await trigger.getAttribute('aria-activedescendant');

      // One ArrowDown moves exactly one option down
      const options = panel.locator('[role="option"]');
      const ids = await options.evaluateAll((els) => els.map((el) => el.id));
      await trigger.press('ArrowDown');
      await expect(trigger).toHaveAttribute('aria-activedescendant', ids[ids.indexOf(activeBefore!) + 1]);

      // The new aria-activedescendant must reference an element that has the active class
      const activeAfter = await trigger.getAttribute('aria-activedescendant');
      expect(activeAfter).toBeTruthy();
      await expect(page.locator(`#${activeAfter}`)).toHaveClass(/sn-listbox-option-active/);
    });

    test('Enter commits selection: panel closes, trigger shows label, focus returns to trigger', async ({ page }) => {
      const d = demo(page, 'Basic select with placeholder');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      // Wait for the key manager to initialise (it runs in a setTimeout(0) after panel opens)
      await expect(trigger).toHaveAttribute('aria-activedescendant', /\S/);
      const activeId = await trigger.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      const activeOption = page.locator(`#${activeId}`);
      const optionLabel = await activeOption.textContent();
      await trigger.press('Enter');

      await expect(panel).not.toBeVisible();
      await expect(trigger.locator('.sn-select-value')).toContainText(optionLabel!.trim());
      await expect(trigger).toBeFocused();
    });

    test('Escape closes panel without changing value', async ({ page }) => {
      const d = demo(page, 'Basic select with placeholder');
      const trigger = d.locator('button[role="combobox"]');
      const initialLabel = (await trigger.locator('.sn-select-value').textContent())!.trim();

      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();
      // Wait for key manager before Escape to ensure stable state
      await expect(trigger).toHaveAttribute('aria-activedescendant', /\S/);

      await trigger.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(trigger.locator('.sn-select-value')).toHaveText(initialLabel);
    });

    test('clicking outside (backdrop) closes the panel', async ({ page }) => {
      const d = demo(page, 'Basic select with placeholder');
      const trigger = d.locator('button[role="combobox"]');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();

      // Click the CDK backdrop to dismiss
      await page.locator('.sn-select-backdrop').click({ force: true });
      await expect(panel).not.toBeVisible();
    });

    test('reopening shows previously selected option highlighted', async ({ page }) => {
      const d = demo(page, 'Basic select with placeholder');
      const trigger = d.locator('button[role="combobox"]');

      // First open and select an option via click
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="listbox"]');
      await expect(panel).toBeVisible();
      const firstOption = panel.locator('[role="option"]').first();
      const selectedText = await firstOption.textContent();
      await firstOption.click();
      await expect(panel).not.toBeVisible();

      // Reopen
      await trigger.click();
      await expect(panel).toBeVisible();

      // Previously selected option should be marked selected
      const selectedOption = panel.locator('[role="option"][aria-selected="true"]');
      await expect(selectedOption).toHaveCount(1);
      await expect(selectedOption).toContainText(selectedText!.trim());
    });
  });

  test.describe('Pre-selected value', () => {
    test('trigger shows pre-selected label without opening the panel', async ({ page }) => {
      const d = demo(page, 'Pre-selected value');
      const trigger = d.locator('button[role="combobox"]');
      // Should NOT have the placeholder class - it has a real value
      await expect(trigger.locator('.sn-select-placeholder')).not.toBeVisible();
      const valueSpan = trigger.locator('.sn-select-value');
      const text = await valueSpan.textContent();
      expect(text!.trim().length).toBeGreaterThan(0);
    });
  });
});
