import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.badge);
  });

  test('all badges have sn-badge base class', async ({ page }) => {
    const demoArea = demo(page, 'Standalone pill - color variants');
    const badge = demoArea.locator('sn-badge').first();
    await expect(badge).toHaveClass(/\bsn-badge\b/);
  });

  test('primary color badge applies sn-badge-primary class', async ({ page }) => {
    const demoArea = demo(page, 'Standalone pill - color variants');
    const badge = demoArea.locator('sn-badge').first();
    await expect(badge).toHaveClass(/\bsn-badge-primary\b/);
  });

  test('error color badge applies sn-badge-error class', async ({ page }) => {
    const demoArea = demo(page, 'Standalone pill - color variants');
    const errorBadge = demoArea.locator('sn-badge').filter({ has: demoArea.page().getByText('12', { exact: true }).first() }).first();
    await expect(errorBadge).toHaveClass(/\bsn-badge-error\b/);
  });

  test('success color badge applies sn-badge-success class', async ({ page }) => {
    const demoArea = demo(page, 'Standalone pill - color variants');
    const successBadge = demoArea.locator('sn-badge').filter({ has: demoArea.page().getByText('new', { exact: true }).first() }).first();
    await expect(successBadge).toHaveClass(/\bsn-badge-success\b/);
  });

  test('warning color badge applies sn-badge-warning class', async ({ page }) => {
    const demoArea = demo(page, 'Standalone pill - color variants');
    const warningBadge = demoArea.locator('sn-badge').filter({ has: demoArea.page().getByText('99+', { exact: true }).first() }).first();
    await expect(warningBadge).toHaveClass(/\bsn-badge-warning\b/);
  });

  test('info color badge applies sn-badge-info class', async ({ page }) => {
    const demoArea = demo(page, 'Standalone pill - color variants');
    const infoBadge = demoArea.locator('sn-badge').filter({ has: demoArea.page().getByText('1', { exact: true }).first() }).first();
    await expect(infoBadge).toHaveClass(/\bsn-badge-info\b/);
  });

  test('secondary color badge applies sn-badge-secondary class', async ({ page }) => {
    const demoArea = demo(page, 'Standalone pill - color variants');
    const secondaryBadge = demoArea.locator('sn-badge').filter({ has: demoArea.page().getByText('5', { exact: true }).first() }).first();
    await expect(secondaryBadge).toHaveClass(/\bsn-badge-secondary\b/);
  });

  test('badge displays value text', async ({ page }) => {
    const demoArea = demo(page, 'Standalone pill - color variants');
    const badge = demoArea.locator('sn-badge').first();
    await expect(badge).toContainText('3');
  });

  test('dot mode badge applies sn-badge--dot class', async ({ page }) => {
    const demoArea = demo(page, 'Dot mode - no value shown');
    const dotBadge = demoArea.locator('sn-badge').first();
    await expect(dotBadge).toHaveClass(/\bsn-badge--dot\b/);
  });

  test('dot mode badge does not display value text', async ({ page }) => {
    const demoArea = demo(page, 'Dot mode - no value shown');
    const dotBadge = demoArea.locator('sn-badge').first();
    const pip = dotBadge.locator('.sn-badge-pip');
    const text = await pip.textContent();
    expect(text?.trim()).toBe('');
  });

  test('overlay badge applies sn-badge--overlay class', async ({ page }) => {
    const demoArea = demo(page, 'Overlay - pinned to child\'s top-right corner');
    const overlayBadge = demoArea.locator('sn-badge').first();
    await expect(overlayBadge).toHaveClass(/\bsn-badge--overlay\b/);
  });

  test('overlay badge pip has aria-hidden="true"', async ({ page }) => {
    const demoArea = demo(page, 'Overlay - pinned to child\'s top-right corner');
    const pip = demoArea.locator('.sn-badge-pip--anchored').first();
    await expect(pip).toHaveAttribute('aria-hidden', 'true');
  });

  test('overlay badge contains projected content', async ({ page }) => {
    const demoArea = demo(page, 'Overlay - pinned to child\'s top-right corner');
    const button = demoArea.locator('button').first();
    await expect(button).toBeVisible();
  });

  test('custom re-skin badges apply inline CSS variables', async ({ page }) => {
    const demoArea = demo(page, 'Custom re-skin via CSS variables');
    const badge = demoArea.locator('sn-badge').first();
    const style = await badge.getAttribute('style');
    expect(style).toContain('--sn-badge-bg');
    expect(style).toContain('--sn-badge-text');
  });

  test('standalone badge has role="status" and aria-label', async ({ page }) => {
    const demoArea = demo(page, 'Standalone pill - color variants');
    const badge = demoArea.locator('sn-badge').first();
    await expect(badge).toHaveAttribute('role', 'status');
    await expect(badge).toHaveAttribute('aria-label', '3');
  });
});
