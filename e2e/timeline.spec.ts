import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Timeline', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.timeline);
  });

  test('timeline with icons renders an ordered list of items', async ({ page }) => {
    const d = demo(page, 'With icons and times');
    await expect(d.locator('ol.sn-timeline-list')).toBeVisible();
    const items = d.locator('sn-timeline-item');
    await expect(items).toHaveCount(3);
  });

  test('items with icon input carry sn-timeline-marker--icon class', async ({ page }) => {
    const d = demo(page, 'With icons and times');
    const firstItem = d.locator('sn-timeline-item').first();
    await expect(firstItem.locator('.sn-timeline-marker--icon')).toBeVisible();
  });

  test('last item carries sn-timeline-item--last class and has no connector', async ({ page }) => {
    const d = demo(page, 'With icons and times');
    const lastItem = d.locator('sn-timeline-item').last();
    await expect(lastItem).toHaveClass(/\bsn-timeline-item--last\b/);
    await expect(lastItem.locator('.sn-timeline-connector')).toHaveCount(0);
  });

  test('items display title text', async ({ page }) => {
    const d = demo(page, 'With icons and times');
    await expect(d.locator('.sn-timeline-title-text').first()).toContainText('Grid created');
    await expect(d.locator('.sn-timeline-title-text').nth(1)).toContainText('Tile added');
  });

  test('time stamps are rendered for items with times', async ({ page }) => {
    const d = demo(page, 'With icons and times');
    await expect(d.locator('.sn-timeline-time').first()).toContainText('09:12');
  });

  test('subtitle text is rendered when present', async ({ page }) => {
    const d = demo(page, 'With icons and times');
    await expect(d.locator('.sn-timeline-subtitle').first()).toContainText('Play Music');
  });

  test('dot-only markers render without sn-timeline-marker--icon', async ({ page }) => {
    const d = demo(page, 'Dot markers only');
    const items = d.locator('sn-timeline-item');
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      await expect(items.nth(i).locator('.sn-timeline-marker--icon')).toHaveCount(0);
    }
  });

  test('dot-only example renders all three items', async ({ page }) => {
    const d = demo(page, 'Dot markers only');
    await expect(d.locator('sn-timeline-item')).toHaveCount(3);
    await expect(d.locator('.sn-timeline-title-text').first()).toContainText('Draft saved');
    await expect(d.locator('.sn-timeline-title-text').last()).toContainText('Published');
  });

  test('custom colors example renders icon markers with colored styles', async ({ page }) => {
    const d = demo(page, 'Custom colors');
    const markers = d.locator('.sn-timeline-marker--icon');
    await expect(markers).toHaveCount(3);
  });

  test('axis column is aria-hidden to hide decorative markers from AT', async ({ page }) => {
    const d = demo(page, 'With icons and times');
    const axisCol = d.locator('[aria-hidden="true"]').first();
    await expect(axisCol).toBeAttached();
  });
});
