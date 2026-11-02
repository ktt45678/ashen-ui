import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.panel);
  });

  test('basic panel renders header text and content', async ({ page }) => {
    const d = demo(page, 'Basic panel');
    await expect(d.locator('.sn-panel-title')).toContainText('Grid Settings');
    await expect(d.locator('.sn-panel-content')).toBeVisible();
  });

  test('basic panel has no toggle button', async ({ page }) => {
    const d = demo(page, 'Basic panel');
    await expect(d.locator('.sn-panel-toggle')).toHaveCount(0);
  });

  test('panel with leading icon renders icon element', async ({ page }) => {
    const d = demo(page, 'With leading icon');
    await expect(d.locator('.sn-panel-icon')).toBeVisible();
  });

  test('toggleable panel starts collapsed and has toggle button with aria-expanded=false', async ({ page }) => {
    const d = demo(page, 'Toggleable (collapsed by default)');
    const toggle = d.locator('.sn-panel-toggle');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(d.locator('.sn-panel-content')).not.toBeVisible();
  });

  test('clicking toggle expands the panel', async ({ page }) => {
    const d = demo(page, 'Toggleable (collapsed by default)');
    const toggle = d.locator('.sn-panel-toggle');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(d.locator('.sn-panel-content')).toBeVisible();
  });

  test('clicking toggle again collapses the panel', async ({ page }) => {
    const d = demo(page, 'Toggleable (collapsed by default)');
    const toggle = d.locator('.sn-panel-toggle');
    await toggle.click();
    await expect(d.locator('.sn-panel-content')).toBeVisible();
    await toggle.click();
    await expect(d.locator('.sn-panel-content')).not.toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('toggle button aria-controls points at content id', async ({ page }) => {
    const d = demo(page, 'With actions slot');
    const toggle = d.locator('.sn-panel-toggle');
    const controlsId = await toggle.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    await toggle.click();
    const content = d.locator('.sn-panel-content');
    await expect(content).toHaveAttribute('id', controlsId!);
  });

  test('panel with actions slot renders action button in header', async ({ page }) => {
    const d = demo(page, 'With actions slot');
    await expect(d.locator('.sn-panel-actions button')).toBeVisible();
  });

  test('custom projected title renders inside title span', async ({ page }) => {
    const d = demo(page, 'Custom projected title');
    await expect(d.locator('.sn-panel-title')).toContainText('Custom Title');
  });

  test('snClass pass-through applies extra class to panel root', async ({ page }) => {
    const d = demo(page, 'snClass pass-through');
    await expect(d.locator('sn-panel')).toHaveClass(/\bdemo-highlighted-panel\b/);
  });
});
