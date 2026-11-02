import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('SplitButton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.splitButton);
  });

  test.describe('Basic', () => {
    test('renders two buttons: a main action button and a dropdown trigger', async ({ page }) => {
      const d = demo(page, 'Basic');
      const main = d.locator('button.sn-split-button-main');
      const trigger = d.locator('button.sn-split-button-trigger');
      await expect(main).toBeVisible();
      await expect(trigger).toBeVisible();
    });

    test('main button has the projected label text', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('button.sn-split-button-main')).toContainText('Save');
    });

    test('trigger button has an accessible aria-label (More actions)', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-split-button-trigger');
      await expect(trigger).toHaveAttribute('aria-label', /\S/);
    });

    test('trigger has aria-haspopup=menu', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('button.sn-split-button-trigger')).toHaveAttribute('aria-haspopup', 'menu');
    });

    test('trigger aria-expanded is false when menu is closed', async ({ page }) => {
      const d = demo(page, 'Basic');
      await expect(d.locator('button.sn-split-button-trigger')).toHaveAttribute('aria-expanded', 'false');
    });

    test('clicking the trigger opens a role=menu panel in the overlay', async ({ page }) => {
      const d = demo(page, 'Basic');
      await d.locator('button.sn-split-button-trigger').click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeVisible();
    });

    test('trigger aria-expanded becomes true when menu is open', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-split-button-trigger');
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    test('clicking a menu item closes the menu', async ({ page }) => {
      const d = demo(page, 'Basic');
      await d.locator('button.sn-split-button-trigger').click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await panel.locator('[role="menuitem"]').first().click();
      await expect(panel).not.toBeVisible();
    });

    test('Escape closes the menu and returns focus to the trigger', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-split-button-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });

    test('ArrowDown on trigger opens menu and focuses first item', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-split-button-trigger');
      await trigger.focus();
      await expect(trigger).toBeFocused();
      await page.keyboard.press('ArrowDown');
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="menuitem"]').first()).toBeFocused();
    });

    test('main button click does not open the menu', async ({ page }) => {
      const d = demo(page, 'Basic');
      await d.locator('button.sn-split-button-main').click();
      await expect(page.locator('.cdk-overlay-container [role="menu"]')).not.toBeVisible();
    });
  });

  test.describe('Colors', () => {
    test('renders six split buttons with different color classes', async ({ page }) => {
      const d = demo(page, 'Colors');
      await expect(d.locator('sn-split-button')).toHaveCount(6);
    });
  });

  test.describe('Sizes', () => {
    test('renders three split buttons', async ({ page }) => {
      const d = demo(page, 'Sizes');
      await expect(d.locator('sn-split-button')).toHaveCount(3);
    });

    test('segments stay joined and the trigger padding is fixed at every size', async ({ page }) => {
      const d = demo(page, 'Sizes');
      const mains = d.locator('button.sn-split-button-main');
      const triggers = d.locator('button.sn-split-button-trigger');
      for (let i = 0; i < 3; i++) {
        await expect(mains.nth(i)).toHaveCSS('border-top-right-radius', '0px');
        await expect(mains.nth(i)).toHaveCSS('border-bottom-right-radius', '0px');
        await expect(triggers.nth(i)).toHaveCSS('border-top-left-radius', '0px');
        await expect(triggers.nth(i)).toHaveCSS('border-bottom-left-radius', '0px');
        await expect(triggers.nth(i)).toHaveCSS('padding-left', '8px');
        await expect(triggers.nth(i)).toHaveCSS('padding-right', '8px');
      }
    });
  });

  test.describe('Disabled', () => {
    test('both the main button and trigger are disabled when disabled=true', async ({ page }) => {
      const d = demo(page, 'Disabled');
      await expect(d.locator('button.sn-split-button-main')).toBeDisabled();
      await expect(d.locator('button.sn-split-button-trigger')).toBeDisabled();
    });

    test('clicking the disabled trigger does not open the menu', async ({ page }) => {
      const d = demo(page, 'Disabled');
      await d.locator('button.sn-split-button-trigger').click({ force: true });
      await expect(page.locator('.cdk-overlay-container [role="menu"]')).not.toBeVisible();
    });
  });

  test.describe('With main-button icon', () => {
    test('main button shows the icon element', async ({ page }) => {
      const d = demo(page, 'With main-button icon');
      const main = d.locator('button.sn-split-button-main');
      await expect(main).toBeVisible();
      await expect(main.locator('sn-icon, .sn-icon')).toBeVisible();
    });

    test('trigger still opens a menu on click', async ({ page }) => {
      const d = demo(page, 'With main-button icon');
      await d.locator('button.sn-split-button-trigger').click();
      const panel = page.locator('.cdk-overlay-container [role="menu"]');
      await expect(panel).toBeVisible();
    });
  });
});
