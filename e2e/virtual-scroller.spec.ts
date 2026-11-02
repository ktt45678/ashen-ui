import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('VirtualScroller', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.virtualScroller);
  });

  test.describe('Basic - 10,000 string rows', () => {
    test('only a small subset of items is rendered in the DOM', async ({ page }) => {
      const d = demo(page, 'Basic - 10,000 string rows');
      // 10,000 items - at most a few dozen should be in the DOM
      await expect(d.locator('.sn-virtual-scroller-item')).not.toHaveCount(0);
      const count = await d.locator('.sn-virtual-scroller-item').count();
      expect(count).toBeLessThan(100);
    });

    test('rendered items are far fewer than the total 10,000', async ({ page }) => {
      const d = demo(page, 'Basic - 10,000 string rows');
      await expect(d.locator('.sn-virtual-scroller-item').first()).toBeVisible();
      const count = await d.locator('.sn-virtual-scroller-item').count();
      expect(count).toBeLessThan(500);
    });

    test('first rendered item is visible at the top', async ({ page }) => {
      const d = demo(page, 'Basic - 10,000 string rows');
      const firstItem = d.locator('.sn-virtual-scroller-item').first();
      await expect(firstItem).toBeVisible();
    });

    test('scrolling the viewport renders different items', async ({ page }) => {
      const d = demo(page, 'Basic - 10,000 string rows');
      const viewport = d.locator('cdk-virtual-scroll-viewport');

      await expect(d.locator('.sn-virtual-scroller-item').first()).toBeVisible();
      const textBefore = await d.locator('.sn-virtual-scroller-item').first().textContent();

      await viewport.evaluate((el) => {
        el.scrollTop = 5000;
      });

      await expect.poll(async () => {
        const item = d.locator('.sn-virtual-scroller-item').first();
        return item.textContent();
      }).not.toBe(textBefore);
    });

    test('scrolling to the bottom renders items near the end of the list', async ({ page }) => {
      const d = demo(page, 'Basic - 10,000 string rows');
      const viewport = d.locator('cdk-virtual-scroll-viewport');

      await viewport.evaluate((el) => {
        el.scrollTop = el.scrollHeight;
      });

      await expect.poll(async () => {
        const items = d.locator('.sn-virtual-scroller-item');
        const last = items.last();
        return last.textContent();
      }).toMatch(/9[89]\d\d|10000/);
    });

    test('all rendered items have uniform height matching itemHeight=36', async ({ page }) => {
      const d = demo(page, 'Basic - 10,000 string rows');
      await expect(d.locator('.sn-virtual-scroller-item').first()).toBeVisible();
      const items = d.locator('.sn-virtual-scroller-item');
      const count = await items.count();
      for (let i = 0; i < Math.min(count, 5); i++) {
        const box = await items.nth(i).boundingBox();
        expect(box?.height).toBe(36);
      }
    });

    test('total scrollable height reflects full item count (≈ 10000 × 36px)', async ({ page }) => {
      const d = demo(page, 'Basic - 10,000 string rows');
      const viewport = d.locator('cdk-virtual-scroll-viewport');
      await expect(viewport).toBeVisible();
      const scrollHeight = await viewport.evaluate((el) => el.scrollHeight);
      // 10000 items × 36px = 360000px; allow ±10% for CDK spacer rounding
      expect(scrollHeight).toBeGreaterThan(300000);
    });

    test('viewport height is set to 240px as configured', async ({ page }) => {
      const d = demo(page, 'Basic - 10,000 string rows');
      const viewport = d.locator('cdk-virtual-scroll-viewport');
      const box = await viewport.boundingBox();
      expect(box?.height).toBe(240);
    });
  });

  test.describe('Custom item template', () => {
    test('custom template rows are rendered', async ({ page }) => {
      const d = demo(page, 'Custom item template');
      await expect(d.locator('.contact-row').first()).toBeVisible();
    });

    test('only a subset of contact rows is in the DOM', async ({ page }) => {
      const d = demo(page, 'Custom item template');
      await expect(d.locator('.contact-row').first()).toBeVisible();
      const count = await d.locator('.contact-row').count();
      expect(count).toBeLessThan(100);
    });

    test('scrolling custom template renders different contacts', async ({ page }) => {
      const d = demo(page, 'Custom item template');
      const viewport = d.locator('cdk-virtual-scroll-viewport');
      await expect(d.locator('.contact-name').first()).toBeVisible();
      const nameBefore = await d.locator('.contact-name').first().textContent();

      await viewport.evaluate((el) => {
        el.scrollTop = 2000;
      });

      await expect.poll(async () => {
        return d.locator('.contact-name').first().textContent();
      }).not.toBe(nameBefore);
    });

    test('viewport height is 260px as configured', async ({ page }) => {
      const d = demo(page, 'Custom item template');
      const viewport = d.locator('cdk-virtual-scroll-viewport');
      const box = await viewport.boundingBox();
      expect(box?.height).toBe(260);
    });
  });

  test.describe('Larger rows + more overscan', () => {
    test('rendered items have uniform height matching itemHeight=48', async ({ page }) => {
      const d = demo(page, 'Larger rows + more overscan');
      await expect(d.locator('.sn-virtual-scroller-item').first()).toBeVisible();
      const items = d.locator('.sn-virtual-scroller-item');
      const count = await items.count();
      for (let i = 0; i < Math.min(count, 5); i++) {
        const box = await items.nth(i).boundingBox();
        expect(box?.height).toBe(48);
      }
    });

    test('only a subset of items is rendered with overscan=8', async ({ page }) => {
      const d = demo(page, 'Larger rows + more overscan');
      await expect(d.locator('.sn-virtual-scroller-item').first()).toBeVisible();
      const count = await d.locator('.sn-virtual-scroller-item').count();
      expect(count).toBeLessThan(200);
    });

    test('total scrollable height reflects full item count (≈ 10000 × 48px)', async ({ page }) => {
      const d = demo(page, 'Larger rows + more overscan');
      const viewport = d.locator('cdk-virtual-scroll-viewport');
      await expect(viewport).toBeVisible();
      const scrollHeight = await viewport.evaluate((el) => el.scrollHeight);
      expect(scrollHeight).toBeGreaterThan(400000);
    });

    test('viewport height is 300px as configured', async ({ page }) => {
      const d = demo(page, 'Larger rows + more overscan');
      const viewport = d.locator('cdk-virtual-scroll-viewport');
      const box = await viewport.boundingBox();
      expect(box?.height).toBe(300);
    });
  });
});
