import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.card);
  });

  test('full card renders title, subtitle, content, and footer', async ({ page }) => {
    const d = demo(page, 'Full card (title + subtitle + footer)');
    await expect(d.locator('sn-card-title')).toContainText('Grid Settings');
    await expect(d.locator('sn-card-subtitle')).toContainText('Main · 6 × 3 · 12 items');
    await expect(d.locator('sn-card-content')).toBeVisible();
    await expect(d.locator('sn-card-footer')).toBeVisible();
  });

  test('full card parts carry their base CSS classes', async ({ page }) => {
    const d = demo(page, 'Full card (title + subtitle + footer)');
    await expect(d.locator('sn-card')).toHaveClass(/\bsn-card\b/);
    await expect(d.locator('sn-card-title')).toHaveClass(/\bsn-card-title\b/);
    await expect(d.locator('sn-card-subtitle')).toHaveClass(/\bsn-card-subtitle\b/);
    await expect(d.locator('sn-card-content')).toHaveClass(/\bsn-card-content\b/);
    await expect(d.locator('sn-card-footer')).toHaveClass(/\bsn-card-footer\b/);
  });

  test('content-only card renders without title or footer', async ({ page }) => {
    const d = demo(page, 'Content only');
    await expect(d.locator('sn-card-content')).toBeVisible();
    await expect(d.locator('sn-card-title')).toHaveCount(0);
    await expect(d.locator('sn-card-footer')).toHaveCount(0);
  });

  test('title + subtitle card has no footer', async ({ page }) => {
    const d = demo(page, 'Title + subtitle, no footer');
    await expect(d.locator('sn-card-title')).toContainText('Visual Appearance');
    await expect(d.locator('sn-card-subtitle')).toContainText('Icon, colors, and opacity');
    await expect(d.locator('sn-card-footer')).toHaveCount(0);
  });

  test('media header card renders sn-card-header before title', async ({ page }) => {
    const d = demo(page, 'With media header');
    await expect(d.locator('sn-card-header')).toBeVisible();
    await expect(d.locator('sn-card-header')).toHaveClass(/\bsn-card-header\b/);
    await expect(d.locator('sn-card-title')).toContainText('Image Card');
  });

  test('snClass pass-through applies extra class to card root', async ({ page }) => {
    const d = demo(page, 'snClass pass-through');
    await expect(d.locator('sn-card')).toHaveClass(/\bdemo-highlighted-card\b/);
  });

  test('footer contains action buttons', async ({ page }) => {
    const d = demo(page, 'Full card (title + subtitle + footer)');
    await expect(d.locator('sn-card-footer button').first()).toBeVisible();
  });
});
