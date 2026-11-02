import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('ColorPicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.colorPicker);
  });

  test.describe('Default inline layout', () => {
    test('renders saturation/brightness area, hue slider, and hex input', async ({ page }) => {
      const d = demo(page, 'Default inline layout');
      await expect(d.locator('sn-color-area')).toBeVisible();
      await expect(d.locator('sn-color-slider[channel="hue"], sn-color-slider').first()).toBeVisible();
      await expect(d.locator('sn-color-input')).toBeVisible();
    });

    test('hue slider has role=slider with aria-valuemin=0 and aria-valuemax=360', async ({ page }) => {
      const d = demo(page, 'Default inline layout');
      // The hue slider is the first sn-color-slider in the default layout
      const hueSlider = d.locator('sn-color-slider').first();
      await expect(hueSlider).toHaveAttribute('role', 'slider');
      await expect(hueSlider).toHaveAttribute('aria-valuemin', '0');
      await expect(hueSlider).toHaveAttribute('aria-valuemax', '360');
    });

    test('ArrowRight on hue slider increases aria-valuenow', async ({ page }) => {
      const d = demo(page, 'Default inline layout');
      const hueSlider = d.locator('sn-color-slider').first();
      await hueSlider.focus();
      const beforeRaw = await hueSlider.getAttribute('aria-valuenow');
      const before = parseInt(beforeRaw ?? '0', 10);

      await hueSlider.press('ArrowRight');

      await expect(hueSlider).not.toHaveAttribute('aria-valuenow', String(before));
      const afterRaw = await hueSlider.getAttribute('aria-valuenow');
      const after = parseInt(afterRaw ?? '0', 10);
      expect(after).toBeGreaterThan(before);
    });

    test('Home sets hue slider to min (0)', async ({ page }) => {
      const d = demo(page, 'Default inline layout');
      const hueSlider = d.locator('sn-color-slider').first();
      await hueSlider.focus();
      await hueSlider.press('Home');
      await expect(hueSlider).toHaveAttribute('aria-valuenow', '0');
    });

    test('End sets hue slider to max (360)', async ({ page }) => {
      const d = demo(page, 'Default inline layout');
      const hueSlider = d.locator('sn-color-slider').first();
      await hueSlider.focus();
      await hueSlider.press('End');
      await expect(hueSlider).toHaveAttribute('aria-valuenow', '360');
    });

    test('typing a valid hex into the color input updates the hue slider (red #ff0000 → hue 0)', async ({ page }) => {
      const d = demo(page, 'Default inline layout');
      const hexInput = d.locator('sn-color-input input');
      await hexInput.focus();
      await hexInput.fill('#ff0000');
      await hexInput.press('Enter');

      const hueSlider = d.locator('sn-color-slider').first();
      await expect(hueSlider).toHaveAttribute('aria-valuenow', '0');
    });

    test('hue slider track --sn-color-slider-track contains linear-gradient (CSS v-bind regression)', async ({ page }) => {
      const d = demo(page, 'Default inline layout');
      const hueSlider = d.locator('sn-color-slider').first();
      const trackGradient = await hueSlider.evaluate((el) => {
        return (el as HTMLElement).style.getPropertyValue('--sn-color-slider-track');
      });
      expect(trackGradient).toContain('linear-gradient');
    });
  });

  test.describe('Popover mode', () => {
    test('clicking the swatch opens the overlay panel', async ({ page }) => {
      const d = demo(page, 'Popover mode');
      const swatch = d.locator('button.sn-color-picker-swatch');
      await expect(swatch).toBeVisible();
      await expect(swatch).toHaveAttribute('aria-expanded', 'false');

      await swatch.click();

      const panel = page.locator('.cdk-overlay-container .sn-color-picker-panel');
      await expect(panel).toBeVisible();
      await expect(swatch).toHaveAttribute('aria-expanded', 'true');
    });

    test('Escape closes the overlay panel', async ({ page }) => {
      const d = demo(page, 'Popover mode');
      const swatch = d.locator('button.sn-color-picker-swatch');
      await swatch.click();
      const panel = page.locator('.cdk-overlay-container .sn-color-picker-panel');
      await expect(panel).toBeVisible();

      await page.keyboard.press('Escape');

      await expect(panel).not.toBeVisible();
    });
  });
});
