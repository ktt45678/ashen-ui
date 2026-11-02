import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Splitter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.splitter);
  });

  test.describe('Horizontal split', () => {
    test('gutter has role=separator, tabindex=0, and aria-orientation=vertical', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('[role="separator"]');
      await expect(gutter).toHaveAttribute('tabindex', '0');
      await expect(gutter).toHaveAttribute('aria-orientation', 'vertical');
    });

    test('gutter has aria-valuenow, aria-valuemin, aria-valuemax', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('[role="separator"]');
      await expect(gutter).toHaveAttribute('aria-valuenow', '50');
      await expect(gutter).toHaveAttribute('aria-valuemin', '15');
      await expect(gutter).toHaveAttribute('aria-valuemax', '85');
    });

    test('gutter has aria-controls attribute set to the expected panel id', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('[role="separator"]');
      const controls = await gutter.getAttribute('aria-controls');
      expect(controls).toBeTruthy();
      expect(controls).toMatch(/sn-splitter-panel-\d+/);
      const target = d.locator(`#${controls}`);
      await expect(target).toBeVisible();
      await expect(target).toHaveClass(/sn-splitter-panel/);
    });

    test('two panels are present', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      await expect(d.locator('.sn-splitter-panel')).toHaveCount(2);
    });

    test('dragging the gutter right expands the first panel', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('.sn-splitter-gutter');
      const panels = d.locator('.sn-splitter-panel');

      const gutterBox = await gutter.boundingBox();
      expect(gutterBox).not.toBeNull();

      const cx = gutterBox!.x + gutterBox!.width / 2;
      const cy = gutterBox!.y + gutterBox!.height / 2;

      const initialWidth = (await panels.first().boundingBox())!.width;

      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 80, cy, { steps: 5 });
      await page.mouse.up();

      await expect.poll(async () => (await panels.first().boundingBox())!.width).toBeGreaterThan(initialWidth);
    });

    test('dragging the gutter right updates aria-valuenow', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('.sn-splitter-gutter');

      const gutterBox = await gutter.boundingBox();
      const cx = gutterBox!.x + gutterBox!.width / 2;
      const cy = gutterBox!.y + gutterBox!.height / 2;

      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 80, cy, { steps: 5 });
      await page.mouse.up();

      await expect.poll(async () => {
        const val = await gutter.getAttribute('aria-valuenow');
        return Number(val);
      }).toBeGreaterThan(50);
    });

    test('keyboard ArrowRight increases first panel size by 10%', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('[role="separator"]');
      await gutter.focus();
      await expect(gutter).toBeFocused();
      await expect(gutter).toHaveAttribute('aria-valuenow', '50');

      await page.keyboard.press('ArrowRight');
      await expect(gutter).toHaveAttribute('aria-valuenow', '60');
    });

    test('keyboard ArrowLeft decreases first panel size by 10%', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('[role="separator"]');
      await gutter.focus();
      await page.keyboard.press('ArrowLeft');
      await expect(gutter).toHaveAttribute('aria-valuenow', '40');
    });

    test('keyboard Home sets first panel to minSize', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('[role="separator"]');
      await gutter.focus();
      await page.keyboard.press('Home');
      await expect(gutter).toHaveAttribute('aria-valuenow', '15');
    });

    test('keyboard End sets first panel to 100-minSize', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('[role="separator"]');
      await gutter.focus();
      await page.keyboard.press('End');
      await expect(gutter).toHaveAttribute('aria-valuenow', '85');
    });

    test('ArrowRight is clamped at maxSize (85)', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('[role="separator"]');
      await gutter.focus();
      await page.keyboard.press('End');
      await expect(gutter).toHaveAttribute('aria-valuenow', '85');
      await page.keyboard.press('ArrowRight');
      await expect(gutter).toHaveAttribute('aria-valuenow', '85');
    });

    test('ArrowLeft is clamped at minSize (15)', async ({ page }) => {
      const d = demo(page, 'Horizontal split');
      const gutter = d.locator('[role="separator"]');
      await gutter.focus();
      await page.keyboard.press('Home');
      await expect(gutter).toHaveAttribute('aria-valuenow', '15');
      await page.keyboard.press('ArrowLeft');
      await expect(gutter).toHaveAttribute('aria-valuenow', '15');
    });
  });

  test.describe('Vertical split', () => {
    test('gutter aria-orientation is horizontal for vertical layout', async ({ page }) => {
      const d = demo(page, 'Vertical split');
      const gutter = d.locator('[role="separator"]');
      await expect(gutter).toHaveAttribute('aria-orientation', 'horizontal');
    });

    test('keyboard ArrowDown increases top panel size by 10%', async ({ page }) => {
      const d = demo(page, 'Vertical split');
      const gutter = d.locator('[role="separator"]');
      await gutter.focus();
      await expect(gutter).toHaveAttribute('aria-valuenow', '50');
      await page.keyboard.press('ArrowDown');
      await expect(gutter).toHaveAttribute('aria-valuenow', '60');
    });

    test('keyboard ArrowUp decreases top panel size by 10%', async ({ page }) => {
      const d = demo(page, 'Vertical split');
      const gutter = d.locator('[role="separator"]');
      await gutter.focus();
      await page.keyboard.press('ArrowUp');
      await expect(gutter).toHaveAttribute('aria-valuenow', '40');
    });

    test('dragging the gutter down expands the top panel', async ({ page }) => {
      const d = demo(page, 'Vertical split');
      const gutter = d.locator('.sn-splitter-gutter');
      const panels = d.locator('.sn-splitter-panel');

      await gutter.scrollIntoViewIfNeeded();
      const gutterBox = await gutter.boundingBox();
      const cx = gutterBox!.x + gutterBox!.width / 2;
      const cy = gutterBox!.y + gutterBox!.height / 2;

      const initialHeight = (await panels.first().boundingBox())!.height;

      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx, cy + 80, { steps: 10 });
      await page.mouse.up();

      await expect.poll(async () => (await panels.first().boundingBox())!.height).toBeGreaterThan(initialHeight);
    });
  });

  test.describe('Custom minimum size', () => {
    test('gutter aria-valuemin reflects minSize=25', async ({ page }) => {
      const d = demo(page, 'Custom minimum size');
      const gutter = d.locator('[role="separator"]');
      await expect(gutter).toHaveAttribute('aria-valuemin', '25');
      await expect(gutter).toHaveAttribute('aria-valuemax', '75');
    });

    test('keyboard Home sets first panel to 25', async ({ page }) => {
      const d = demo(page, 'Custom minimum size');
      const gutter = d.locator('[role="separator"]');
      await gutter.focus();
      await page.keyboard.press('Home');
      await expect(gutter).toHaveAttribute('aria-valuenow', '25');
    });
  });

  test.describe('Controlled via [(size)]', () => {
    test('demo readout reflects the current size', async ({ page }) => {
      const d = demo(page, 'Controlled via [(size)]');
      await expect(d.locator('.demo-readout')).toContainText('First panel: 40%');
    });

    test('keyboard ArrowRight updates the readout by step', async ({ page }) => {
      const d = demo(page, 'Controlled via [(size)]');
      const gutter = d.locator('[role="separator"]');
      const initialText = await d.locator('.demo-readout').textContent();
      const initialPct = parseInt(initialText!.match(/(\d+)%/)![1], 10);
      await gutter.focus();
      await page.keyboard.press('ArrowRight');
      await expect(d.locator('.demo-readout')).toContainText(`First panel: ${initialPct + 10}%`);
    });
  });
});
