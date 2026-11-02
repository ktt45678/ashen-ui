import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Divider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.divider);
  });

  test('renders with role="separator"', async ({ page }) => {
    const demoArea = demo(page, 'Plain horizontal');
    const divider = demoArea.locator('sn-divider');
    await expect(divider).toHaveAttribute('role', 'separator');
  });

  test('horizontal divider has aria-orientation="horizontal"', async ({ page }) => {
    const demoArea = demo(page, 'Plain horizontal');
    const divider = demoArea.locator('sn-divider');
    await expect(divider).toHaveAttribute('aria-orientation', 'horizontal');
  });

  test('vertical divider applies sn-divider--vertical class and aria-orientation="vertical"', async ({ page }) => {
    const demoArea = demo(page, 'Vertical (for toolbars)');
    const dividers = demoArea.locator('sn-divider');
    await expect(dividers.first()).toHaveClass(/\bsn-divider--vertical\b/);
    await expect(dividers.first()).toHaveAttribute('aria-orientation', 'vertical');
  });

  test('all dividers have sn-divider base class', async ({ page }) => {
    const demoArea = demo(page, 'Plain horizontal');
    const divider = demoArea.locator('sn-divider');
    await expect(divider).toHaveClass(/\bsn-divider\b/);
  });

  test('labeled divider displays label text', async ({ page }) => {
    const demoArea = demo(page, 'Labelled');
    const label = demoArea.locator('.sn-divider-label');
    await expect(label).toContainText('Visual Appearance');
  });

  test('labeled divider applies sn-divider--labeled class', async ({ page }) => {
    const demoArea = demo(page, 'Labelled');
    const divider = demoArea.locator('sn-divider');
    await expect(divider).toHaveClass(/\bsn-divider--labeled\b/);
  });

  test('multiple labeled dividers each display their labels', async ({ page }) => {
    const demoArea = demo(page, 'Multiple labelled dividers');
    const labels = demoArea.locator('.sn-divider-label');

    // Gate with retrying assertion to ensure labels have rendered
    await expect(labels).toHaveCount(2);

    const label1 = labels.nth(0);
    const label2 = labels.nth(1);
    await expect(label1).toContainText('Display');
    await expect(label2).toContainText('Behavior');
  });
});
