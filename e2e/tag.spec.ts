import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Tag', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.tag);
  });

  test('all tags have sn-tag base class', async ({ page }) => {
    const demoArea = demo(page, 'Severity variants');
    const tag = demoArea.locator('sn-tag').first();
    await expect(tag).toHaveClass(/\bsn-tag\b/);
  });

  test('primary severity tag applies sn-tag-primary class', async ({ page }) => {
    const demoArea = demo(page, 'Severity variants');
    const tag = demoArea.locator('sn-tag').first();
    await expect(tag).toHaveClass(/\bsn-tag-primary\b/);
  });

  test('success severity tag applies sn-tag-success class', async ({ page }) => {
    const demoArea = demo(page, 'Severity variants');
    const successTag = demoArea.locator('sn-tag').filter({ has: demoArea.page().getByText('Saved', { exact: true }).first() }).first();
    await expect(successTag).toHaveClass(/\bsn-tag-success\b/);
  });

  test('warning severity tag applies sn-tag-warning class', async ({ page }) => {
    const demoArea = demo(page, 'Severity variants');
    const warningTag = demoArea.locator('sn-tag').filter({ has: demoArea.page().getByText('Overlap', { exact: true }).first() }).first();
    await expect(warningTag).toHaveClass(/\bsn-tag-warning\b/);
  });

  test('error severity tag applies sn-tag-error class', async ({ page }) => {
    const demoArea = demo(page, 'Severity variants');
    const errorTag = demoArea.locator('sn-tag').filter({ has: demoArea.page().getByText('Invalid', { exact: true }).first() }).first();
    await expect(errorTag).toHaveClass(/\bsn-tag-error\b/);
  });

  test('info severity tag applies sn-tag-info class', async ({ page }) => {
    const demoArea = demo(page, 'Severity variants');
    const infoTag = demoArea.locator('sn-tag').filter({ has: demoArea.page().getByText('Widget', { exact: true }).first() }).first();
    await expect(infoTag).toHaveClass(/\bsn-tag-info\b/);
  });

  test('secondary severity tag applies sn-tag-secondary class', async ({ page }) => {
    const demoArea = demo(page, 'Severity variants');
    const secondaryTag = demoArea.locator('sn-tag').filter({ has: demoArea.page().getByText('Draft', { exact: true }).first() }).first();
    await expect(secondaryTag).toHaveClass(/\bsn-tag-secondary\b/);
  });

  test('tag displays value text via sn-tag-label', async ({ page }) => {
    const demoArea = demo(page, 'Severity variants');
    const label = demoArea.locator('.sn-tag-label').first();
    await expect(label).toContainText('Button');
  });

  test('tag with icon renders sn-tag-icon with aria-hidden="true"', async ({ page }) => {
    const demoArea = demo(page, 'With icon');
    const icon = demoArea.locator('.sn-tag-icon').first();
    await expect(icon).toBeVisible();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
    await expect(icon).toHaveClass(/\bicon-ms\b/);
  });

  test('tag with icon displays icon glyph', async ({ page }) => {
    const demoArea = demo(page, 'With icon');
    const icon = demoArea.locator('.sn-tag-icon').first();
    await expect(icon).toContainText('widgets');
  });

  test('tag with icon displays label text', async ({ page }) => {
    const demoArea = demo(page, 'With icon');
    const label = demoArea.locator('.sn-tag-label').first();
    await expect(label).toContainText('Widget');
  });

  test('tag with content projection displays projected text', async ({ page }) => {
    const demoArea = demo(page, 'Content projection');
    const tag = demoArea.locator('sn-tag').first();
    await expect(tag).toContainText('Streaming');
  });

  test('tag with content projection applies severity class', async ({ page }) => {
    const demoArea = demo(page, 'Content projection');
    const tag = demoArea.locator('sn-tag').first();
    await expect(tag).toHaveClass(/\bsn-tag-success\b/);
  });

  test('custom re-skin tag applies inline CSS variable', async ({ page }) => {
    const demoArea = demo(page, 'Custom re-skin via CSS variables');
    const tag = demoArea.locator('sn-tag').first();
    const style = await tag.getAttribute('style');
    expect(style).toContain('--sn-tag-color');
  });
});
