import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('MeterGroup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.meterGroup);
  });

  test('basic meter group renders three segments', async ({ page }) => {
    const d = demo(page, 'Basic');
    await expect(d.locator('.sn-meter-group-segment')).toHaveCount(3);
  });

  test('segments have role=meter with aria-valuenow/min/max', async ({ page }) => {
    const d = demo(page, 'Basic');
    const seg = d.locator('[role="meter"]').first();
    await expect(seg).toHaveAttribute('aria-valuemin', '0');
    await expect(seg).toHaveAttribute('aria-valuemax', '100');
    await expect(seg).toHaveAttribute('aria-valuenow', '42');
  });

  test('segment aria-label matches the meter label input', async ({ page }) => {
    const d = demo(page, 'Basic');
    await expect(d.locator('[role="meter"]').first()).toHaveAttribute('aria-label', 'Apps');
  });

  test('legend is rendered with one item per meter', async ({ page }) => {
    const d = demo(page, 'Basic');
    await expect(d.locator('.sn-meter-group-legend')).toBeVisible();
    await expect(d.locator('.sn-meter-group-legend-item')).toHaveCount(3);
  });

  test('legend labels display meter label text', async ({ page }) => {
    const d = demo(page, 'Basic');
    await expect(d.locator('.sn-meter-group-legend-label').first()).toContainText('Apps');
  });

  test('legend values display meter values with unit', async ({ page }) => {
    const d = demo(page, 'Basic');
    await expect(d.locator('.sn-meter-group-legend-value').first()).toContainText('42');
  });

  test('custom max example uses the provided max for aria-valuemax', async ({ page }) => {
    const d = demo(page, 'Custom max and unit');
    const seg = d.locator('[role="meter"]').first();
    await expect(seg).toHaveAttribute('aria-valuemax', '500');
    await expect(seg).toHaveAttribute('aria-valuenow', '210');
  });

  test('custom max example legend shows GB unit', async ({ page }) => {
    const d = demo(page, 'Custom max and unit');
    await expect(d.locator('.sn-meter-group-legend-value').first()).toContainText('GB');
  });

  test('showLegend=false hides the legend row', async ({ page }) => {
    const d = demo(page, 'Without legend');
    await expect(d.locator('.sn-meter-group-legend')).toHaveCount(0);
  });

  test('without legend bar segments are still visible', async ({ page }) => {
    const d = demo(page, 'Without legend');
    await expect(d.locator('.sn-meter-group-segment').first()).toBeVisible();
  });

  test('bar track has sn-meter-group-bar class', async ({ page }) => {
    const d = demo(page, 'Basic');
    await expect(d.locator('.sn-meter-group-bar')).toBeVisible();
  });

  test('host has sn-meter-group base class', async ({ page }) => {
    const d = demo(page, 'Basic');
    await expect(d.locator('sn-meter-group')).toHaveClass(/\bsn-meter-group\b/);
  });
});
