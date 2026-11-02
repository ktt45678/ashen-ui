import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.slider);
  });

  test.describe('Basic', () => {
    test('input type=range exists with min/max/step attributes', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await expect(input).toBeVisible();
      await expect(input).toHaveAttribute('min', '0');
      await expect(input).toHaveAttribute('max', '100');
      await expect(input).toHaveAttribute('step', '1');
    });

    test('initial value matches the page signal (40)', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await expect(input).toHaveValue('40');
      await expect(d.locator('.hint-text')).toContainText('Value: 40');
    });

    test('ArrowRight increments value by 1', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await input.focus();
      await expect(input).toBeFocused();
      const before = Number(await input.inputValue());
      await page.keyboard.press('ArrowRight');
      await expect(input).toHaveValue(String(before + 1));
      await expect(d.locator('.hint-text')).toContainText(`Value: ${before + 1}`);
    });

    test('ArrowUp increments value by 1', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await input.focus();
      const before = Number(await input.inputValue());
      await page.keyboard.press('ArrowUp');
      await expect(input).toHaveValue(String(before + 1));
    });

    test('ArrowLeft decrements value by 1', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await input.focus();
      const before = Number(await input.inputValue());
      await page.keyboard.press('ArrowLeft');
      await expect(input).toHaveValue(String(before - 1));
    });

    test('ArrowDown decrements value by 1', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await input.focus();
      const before = Number(await input.inputValue());
      await page.keyboard.press('ArrowDown');
      await expect(input).toHaveValue(String(before - 1));
    });

    test('Home jumps to min (0)', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await input.focus();
      await page.keyboard.press('Home');
      await expect(input).toHaveValue('0');
    });

    test('End jumps to max (100)', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await input.focus();
      await page.keyboard.press('End');
      await expect(input).toHaveValue('100');
    });

    test('PageUp increases value by a larger step', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await input.focus();
      await page.keyboard.press('Home');
      await expect(input).toHaveValue('0');
      await page.keyboard.press('PageUp');
      const after = Number(await input.inputValue());
      expect(after).toBeGreaterThan(0);
    });

    test('PageDown decreases value by a larger step', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await input.focus();
      await page.keyboard.press('End');
      await expect(input).toHaveValue('100');
      await page.keyboard.press('PageDown');
      const after = Number(await input.inputValue());
      expect(after).toBeLessThan(100);
    });

    test('showcase readout reflects value after keyboard change', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      await input.focus();
      await page.keyboard.press('End');
      await expect(d.locator('.hint-text')).toContainText('Value: 100');
    });

    test('clicking the track jumps the value', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      const track = d.locator('.sn-slider-track');
      const box = await track.boundingBox();
      expect(box).not.toBeNull();
      // Click near the right end of the track (~90%)
      await page.mouse.click(box!.x + box!.width * 0.9, box!.y + box!.height / 2);
      const value = Number(await input.inputValue());
      expect(value).toBeGreaterThan(50);
    });

    test('dragging the thumb changes value continuously', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input[type="range"]');
      const track = d.locator('.sn-slider-track');

      await expect.poll(() => track.boundingBox()).not.toBeNull();
      const trackBox = (await track.boundingBox())!;

      const startX = trackBox.x + trackBox.width * 0.1;
      const endX = trackBox.x + trackBox.width * 0.8;
      const y = trackBox.y + trackBox.height / 2;

      await page.mouse.move(startX, y);
      await page.mouse.down();
      await page.mouse.move(endX, y, { steps: 10 });
      await page.mouse.up();

      await expect.poll(async () => Number(await input.inputValue())).toBeGreaterThan(30);
    });
  });

  test.describe('Custom min / max / step', () => {
    test('has correct min, max, step attributes', async ({ page }) => {
      const d = demo(page, 'Custom min / max / step');
      const input = d.locator('input[type="range"]');
      await expect(input).toHaveAttribute('min', '10');
      await expect(input).toHaveAttribute('max', '50');
      await expect(input).toHaveAttribute('step', '5');
    });

    test('initial value matches the page signal (50)', async ({ page }) => {
      const d = demo(page, 'Custom min / max / step');
      const input = d.locator('input[type="range"]');
      await expect(input).toHaveValue('50');
    });

    test('ArrowRight increments by step of 5', async ({ page }) => {
      const d = demo(page, 'Custom min / max / step');
      const input = d.locator('input[type="range"]');
      await input.focus();
      // Move to Home first so we have headroom to increment
      await page.keyboard.press('Home');
      await expect(input).toHaveValue('10');
      await page.keyboard.press('ArrowRight');
      await expect(input).toHaveValue('15');
    });

    test('ArrowLeft decrements by step of 5', async ({ page }) => {
      const d = demo(page, 'Custom min / max / step');
      const input = d.locator('input[type="range"]');
      await input.focus();
      await page.keyboard.press('End');
      await expect(input).toHaveValue('50');
      await page.keyboard.press('ArrowLeft');
      await expect(input).toHaveValue('45');
    });

    test('Home jumps to custom min of 10', async ({ page }) => {
      const d = demo(page, 'Custom min / max / step');
      const input = d.locator('input[type="range"]');
      await input.focus();
      await page.keyboard.press('Home');
      await expect(input).toHaveValue('10');
    });

    test('End jumps to custom max of 50', async ({ page }) => {
      const d = demo(page, 'Custom min / max / step');
      const input = d.locator('input[type="range"]');
      await input.focus();
      await page.keyboard.press('End');
      await expect(input).toHaveValue('50');
    });

    test('showcase readout reflects current value', async ({ page }) => {
      const d = demo(page, 'Custom min / max / step');
      const input = d.locator('input[type="range"]');
      await input.focus();
      await page.keyboard.press('Home');
      await expect(d.locator('.hint-text')).toContainText('Value: 10');
    });
  });

  test.describe('Disabled', () => {
    test('input is disabled', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const input = d.locator('input[type="range"]');
      await expect(input).toBeDisabled();
    });

    test('host has sn-slider-disabled class', async ({ page }) => {
      const d = demo(page, 'Disabled');
      await expect(d.locator('sn-slider')).toHaveClass(/\bsn-slider-disabled\b/);
    });

    test('disabled slider value stays at 40', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const input = d.locator('input[type="range"]');
      await expect(input).toHaveValue('40');
    });
  });

  test.describe('Format value - percentage', () => {
    test('aria-valuetext is set to formatted percentage string', async ({ page }) => {
      const d = demo(page, 'Format value - percentage');
      const input = d.locator('input[type="range"]');
      await expect(input).toHaveAttribute('aria-valuetext', /\d+%/);
    });
  });

  // A vertical range is the one thing here that cannot be settled from the
  // markup: the input is a rotated horizontal range, so whether a drag up and
  // an ArrowUp both raise the value is a question about real layout.
  test.describe('Vertical', () => {
    test('the track is taller than it is wide', async ({ page }) => {
      const track = demo(page, 'Vertical').locator('.sn-slider-track');
      const box = (await track.boundingBox())!;
      expect(box.height).toBeGreaterThan(box.width * 4);
    });

    test('the rotated input covers the track', async ({ page }) => {
      const d = demo(page, 'Vertical');
      const trackBox = (await d.locator('.sn-slider-track').boundingBox())!;
      const inputBox = (await d.locator('input[type="range"]').boundingBox())!;

      // Same span along the track, and centred across it.
      expect(Math.abs(inputBox.height - trackBox.height)).toBeLessThan(2);
      const trackCentre = trackBox.x + trackBox.width / 2;
      const inputCentre = inputBox.x + inputBox.width / 2;
      expect(Math.abs(trackCentre - inputCentre)).toBeLessThan(2);
    });

    test('ArrowUp raises the value and ArrowDown lowers it', async ({ page }) => {
      const d = demo(page, 'Vertical');
      const input = d.locator('input[type="range"]');
      await input.focus();
      const start = Number(await input.inputValue());

      await input.press('ArrowUp');
      await expect(input).toHaveValue(String(start + 1));

      await input.press('ArrowDown');
      await expect(input).toHaveValue(String(start));
    });

    test('the fill grows upward from the bottom of the track', async ({ page }) => {
      const d = demo(page, 'Vertical');
      const track = d.locator('.sn-slider-track');
      const fill = d.locator('.sn-slider-fill');

      const trackBox = (await track.boundingBox())!;
      const fillBox = (await fill.boundingBox())!;

      // Bottom edges coincide, and the fill is shorter than the track at 60.
      const trackBottom = trackBox.y + trackBox.height;
      const fillBottom = fillBox.y + fillBox.height;
      expect(Math.abs(trackBottom - fillBottom)).toBeLessThan(2);
      expect(fillBox.height).toBeLessThan(trackBox.height);
    });

    test('dragging up the track raises the value', async ({ page }) => {
      const d = demo(page, 'Vertical');
      const input = d.locator('input[type="range"]');
      const track = d.locator('.sn-slider-track');
      // Mouse moves take viewport coordinates and do not scroll, so the track
      // has to be on screen before its box is worth anything.
      await track.scrollIntoViewIfNeeded();
      const trackBox = (await track.boundingBox())!;
      const start = Number(await input.inputValue());

      const x = trackBox.x + trackBox.width / 2;
      await page.mouse.move(x, trackBox.y + trackBox.height * 0.5);
      await page.mouse.down();
      await page.mouse.move(x, trackBox.y + trackBox.height * 0.1);
      await page.mouse.up();

      expect(Number(await input.inputValue())).toBeGreaterThan(start);
    });
  });
});
