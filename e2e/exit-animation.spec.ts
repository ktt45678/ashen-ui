import { test, expect, type Page } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

// A theme slows the exit through CSS tokens alone; the element must stay until the animation ends.
const SLOW_EXIT = `
  :root { --sn-dialog-exit-duration: 800ms; --sn-popover-exit-duration: 800ms; }
  .sn-toast { --sn-toast-exit-duration: 800ms; }
`;

async function slowExits(page: Page): Promise<void> {
  await page.addStyleTag({ content: SLOW_EXIT });
}

test.describe('Exit animations follow the CSS duration tokens', () => {
  test('dialog stays mounted until a slowed exit finishes', async ({ page }) => {
    await page.goto(ROUTES.dialog);
    await slowExits(page);
    const d = demo(page, 'With footer actions');
    await d.locator('button').filter({ hasText: 'Open Dialog' }).click();
    const dialog = d.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    await expect(dialog).toBeAttached();

    await expect(dialog).not.toBeAttached({ timeout: 1500 });
  });

  test('popover panel stays attached until a slowed exit finishes', async ({ page }) => {
    await page.goto(ROUTES.popover);
    await slowExits(page);
    const trigger = demo(page, 'Basic').getByRole('button', { name: 'Options' });
    await trigger.click();
    const panel = page.locator('.cdk-overlay-container [role="dialog"]');
    await expect(panel).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    await expect(panel).toBeAttached();

    await expect(panel).not.toBeAttached({ timeout: 1500 });
  });

  test('toast stays until a slowed exit finishes', async ({ page }) => {
    await page.goto(ROUTES.toast);
    await slowExits(page);
    await demo(page, 'Sticky toast').getByRole('button', { name: 'Show sticky' }).click();
    const toast = page.locator('.sn-toast-item');
    await expect(toast).toHaveCount(1);

    await toast.locator('.sn-toast-close').click();
    await page.waitForTimeout(400);
    await expect(toast).toHaveCount(1);
    await expect(toast).toHaveClass(/sn-toast-item--hiding/);

    await expect(toast).toHaveCount(0, { timeout: 1500 });
  });
});
