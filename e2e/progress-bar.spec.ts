import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('ProgressBar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.progressBar);
  });

  test('determinate bar has role=progressbar with aria-valuemin/max', async ({ page }) => {
    const d = demo(page, 'Determinate');
    const track = d.locator('[role="progressbar"]');
    await expect(track).toHaveAttribute('aria-valuemin', '0');
    await expect(track).toHaveAttribute('aria-valuemax', '100');
  });

  test('determinate bar has aria-valuenow matching the value', async ({ page }) => {
    const d = demo(page, 'Determinate');
    const track = d.locator('[role="progressbar"]');
    await expect(track).toHaveAttribute('aria-valuenow', '64');
  });

  test('determinate bar fill width is proportional to value', async ({ page }) => {
    const d = demo(page, 'Determinate');
    const fill = d.locator('.sn-progress-bar-fill');
    await expect(fill).toBeVisible();
    const style = await fill.getAttribute('style');
    expect(style).toContain('64');
  });

  test('determinate bar shows value label', async ({ page }) => {
    const d = demo(page, 'Determinate');
    await expect(d.locator('.sn-progress-bar-value')).toContainText('64');
  });

  test('indeterminate bar has sn-progress-bar--indeterminate class', async ({ page }) => {
    const d = demo(page, 'Indeterminate');
    await expect(d.locator('sn-progress-bar')).toHaveClass(/\bsn-progress-bar--indeterminate\b/);
  });

  test('indeterminate bar does not have aria-valuenow', async ({ page }) => {
    const d = demo(page, 'Indeterminate');
    const track = d.locator('[role="progressbar"]');
    const valuenow = await track.getAttribute('aria-valuenow');
    expect(valuenow).toBeNull();
  });

  test('indeterminate fill has indeterminate animation class', async ({ page }) => {
    const d = demo(page, 'Indeterminate');
    await expect(d.locator('.sn-progress-bar-fill--indeterminate')).toBeVisible();
  });

  test('showValue=false hides the value label', async ({ page }) => {
    const d = demo(page, 'Without value label');
    await expect(d.locator('.sn-progress-bar-value')).toHaveCount(0);
  });

  test('material variant applies sn-progress-bar--material class', async ({ page }) => {
    const d = demo(page, 'Material variant');
    await expect(d.locator('sn-progress-bar').first()).toHaveClass(/\bsn-progress-bar--material\b/);
  });

  test('material variant track has sn-progress-bar-track--material class', async ({ page }) => {
    const d = demo(page, 'Material variant');
    await expect(d.locator('.sn-progress-bar-track--material').first()).toBeVisible();
  });

  test('host element has sn-progress-bar base class', async ({ page }) => {
    const d = demo(page, 'Determinate');
    await expect(d.locator('sn-progress-bar')).toHaveClass(/\bsn-progress-bar\b/);
  });
});
