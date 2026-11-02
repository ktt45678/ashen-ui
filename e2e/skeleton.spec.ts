import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Skeleton', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.skeleton);
  });

  test('all skeletons have sn-skeleton base class', async ({ page }) => {
    const demoArea = demo(page, 'Shimmer (default)');
    const skeleton = demoArea.locator('sn-skeleton').first();
    await expect(skeleton).toHaveClass(/\bsn-skeleton\b/);
  });

  test('skeleton has aria-hidden="true"', async ({ page }) => {
    const demoArea = demo(page, 'Shimmer (default)');
    const skeleton = demoArea.locator('sn-skeleton').first();
    await expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  });

  test('text shape skeleton applies sn-skeleton-text class', async ({ page }) => {
    const demoArea = demo(page, 'Shape variants');
    const textSkeleton = demoArea.locator('sn-skeleton').first();
    await expect(textSkeleton).toHaveClass(/\bsn-skeleton-text\b/);
  });

  test('rect shape skeleton applies sn-skeleton-rect class', async ({ page }) => {
    const demoArea = demo(page, 'Shape variants');
    const rectSkeleton = demoArea.locator('sn-skeleton').nth(1);
    await expect(rectSkeleton).toHaveClass(/\bsn-skeleton-rect\b/);
  });

  test('circle shape skeleton applies sn-skeleton-circle class', async ({ page }) => {
    const demoArea = demo(page, 'Shape variants');
    const circleSkeleton = demoArea.locator('sn-skeleton').nth(2);
    await expect(circleSkeleton).toHaveClass(/\bsn-skeleton-circle\b/);
  });

  test('tile shape skeleton applies sn-skeleton-tile class', async ({ page }) => {
    const demoArea = demo(page, 'Shape variants');
    const tileSkeleton = demoArea.locator('sn-skeleton').nth(3);
    await expect(tileSkeleton).toHaveClass(/\bsn-skeleton-tile\b/);
  });

  test('default animation (shimmer) has animationName other than "none"', async ({ page }) => {
    const demoArea = demo(page, 'Shimmer (default)');
    const skeleton = demoArea.locator('sn-skeleton').first();
    const animationName = await skeleton.evaluate((el) => getComputedStyle(el, '::after').animationName);
    expect(animationName).not.toBe('none');
  });

  test('pulse animation applies sn-skeleton-pulse class and animates', async ({ page }) => {
    const demoArea = demo(page, 'Pulse animation');
    const pulseSkeleton = demoArea.locator('sn-skeleton').first();
    await expect(pulseSkeleton).toHaveClass(/\bsn-skeleton-pulse\b/);
    const animationName = await pulseSkeleton.evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).not.toBe('none');
  });

  test('static animation (none) applies sn-skeleton-static class and no animation', async ({ page }) => {
    const demoArea = demo(page, 'Static (no animation)');
    const staticSkeleton = demoArea.locator('sn-skeleton').first();
    await expect(staticSkeleton).toHaveClass(/\bsn-skeleton-static\b/);
    const animationName = await staticSkeleton.evaluate((el) => getComputedStyle(el).animationName);
    expect(animationName).toBe('none');
  });

  test('custom width applies inline style', async ({ page }) => {
    const demoArea = demo(page, 'Custom dimensions');
    const skeleton = demoArea.locator('sn-skeleton');
    const width = await skeleton.evaluate((el) => getComputedStyle(el).width);
    // 100% width should resolve to the demo area width
    expect(width).not.toBe('0px');
  });

  test('custom height applies inline style', async ({ page }) => {
    const demoArea = demo(page, 'Custom dimensions');
    const skeleton = demoArea.locator('sn-skeleton');
    const height = await skeleton.evaluate((el) => getComputedStyle(el).height);
    expect(height).toBe('120px');
  });

  test('skeleton with width="70%" in shimmer example applies width', async ({ page }) => {
    const demoArea = demo(page, 'Shimmer (default)');
    const skeletons = demoArea.locator('sn-skeleton');
    // Second text skeleton in the column should have 70% width
    const secondText = skeletons.nth(1);
    const width = await secondText.evaluate((el) => el.getAttribute('style'));
    expect(width).toContain('width');
  });

  test('re-skin example applies custom CSS variables via inline style', async ({ page }) => {
    const demoArea = demo(page, 'Re-skin via CSS variables');
    const skeleton = demoArea.locator('sn-skeleton');
    const style = await skeleton.getAttribute('style');
    expect(style).toContain('--sn-skeleton-bg');
    expect(style).toContain('--sn-skeleton-shimmer-color');
  });

  test('circle shape skeleton in shimmer example has animation', async ({ page }) => {
    const demoArea = demo(page, 'Shimmer (default)');
    const circleSkeleton = demoArea.locator('sn-skeleton').first();
    await expect(circleSkeleton).toHaveClass(/\bsn-skeleton-circle\b/);
    const animationName = await circleSkeleton.evaluate((el) => getComputedStyle(el, '::after').animationName);
    expect(animationName).not.toBe('none');
  });

  test('card placeholder composes multiple skeletons', async ({ page }) => {
    const demoArea = demo(page, 'Card placeholder');
    const skeletons = demoArea.locator('sn-skeleton');

    // Gate with retrying assertion to ensure skeletons have rendered before reading
    await expect(skeletons).toHaveCount(4);

    const count = await skeletons.count();
    expect(count).toBe(4); // 1 rect + 3 text skeletons
  });
});
