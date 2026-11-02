import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('ProgressSpinner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.progressSpinner);
  });

  test('indeterminate spinner has role=progressbar', async ({ page }) => {
    const d = demo(page, 'Indeterminate (default)');
    await expect(d.locator('sn-progress-spinner')).toHaveAttribute('role', 'progressbar');
  });

  test('indeterminate spinner has aria-valuemin and aria-valuemax', async ({ page }) => {
    const d = demo(page, 'Indeterminate (default)');
    const spinner = d.locator('sn-progress-spinner');
    await expect(spinner).toHaveAttribute('aria-valuemin', '0');
    await expect(spinner).toHaveAttribute('aria-valuemax', '100');
  });

  test('indeterminate spinner has aria-label for screen readers', async ({ page }) => {
    const d = demo(page, 'Indeterminate (default)');
    const label = await d.locator('sn-progress-spinner').getAttribute('aria-label');
    expect(label).toBeTruthy();
  });

  test('indeterminate spinner has no aria-valuenow', async ({ page }) => {
    const d = demo(page, 'Indeterminate (default)');
    const valuenow = await d.locator('sn-progress-spinner').getAttribute('aria-valuenow');
    expect(valuenow).toBeNull();
  });

  test('indeterminate SVG carries the rotation animation class', async ({ page }) => {
    const d = demo(page, 'Indeterminate (default)');
    await expect(d.locator('.sn-progress-spinner-svg--rotate')).toBeVisible();
  });

  test('host has sn-progress-spinner base class', async ({ page }) => {
    const d = demo(page, 'Indeterminate (default)');
    await expect(d.locator('sn-progress-spinner')).toHaveClass(/\bsn-progress-spinner\b/);
  });

  test('determinate spinner has sn-progress-spinner--determinate class', async ({ page }) => {
    const d = demo(page, 'Determinate');
    await expect(d.locator('sn-progress-spinner').first()).toHaveClass(/\bsn-progress-spinner--determinate\b/);
  });

  test('determinate spinner has aria-valuenow matching the value', async ({ page }) => {
    const d = demo(page, 'Determinate');
    await expect(d.locator('sn-progress-spinner').first()).toHaveAttribute('aria-valuenow', '70');
  });

  test('material variant has sn-progress-spinner--material class', async ({ page }) => {
    const d = demo(page, 'Material variant');
    await expect(d.locator('sn-progress-spinner').first()).toHaveClass(/\bsn-progress-spinner--material\b/);
  });

  test('material indeterminate SVG uses material rotation class', async ({ page }) => {
    const d = demo(page, 'Material variant');
    await expect(d.locator('.sn-progress-spinner-svg--rotate-material').first()).toBeVisible();
  });

  test('custom color variant renders an SVG element', async ({ page }) => {
    const d = demo(page, 'Custom color via CSS variable');
    await expect(d.locator('sn-progress-spinner svg')).toBeVisible();
  });
});
