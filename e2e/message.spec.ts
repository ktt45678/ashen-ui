import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Message', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.message);
  });

  test('info message has sn-message--info class and role=status', async ({ page }) => {
    const d = demo(page, 'Severities');
    const msg = d.locator('sn-message').filter({ hasText: 'Widgets refresh every second' });
    await expect(msg).toHaveClass(/\bsn-message--info\b/);
    await expect(msg).toHaveAttribute('role', 'status');
  });

  test('success message has sn-message--success class and role=status', async ({ page }) => {
    const d = demo(page, 'Severities');
    const msg = d.locator('sn-message').filter({ hasText: 'Grid saved' }).first();
    await expect(msg).toHaveClass(/\bsn-message--success\b/);
    await expect(msg).toHaveAttribute('role', 'status');
  });

  test('warning message has sn-message--warning class and role=alert', async ({ page }) => {
    const d = demo(page, 'Severities');
    const msg = d.locator('sn-message').filter({ hasText: 'overlapping tiles' });
    await expect(msg).toHaveClass(/\bsn-message--warning\b/);
    await expect(msg).toHaveAttribute('role', 'alert');
  });

  test('error message has sn-message--error class and role=alert', async ({ page }) => {
    const d = demo(page, 'Severities');
    const msg = d.locator('sn-message').filter({ hasText: 'Name is required' });
    await expect(msg).toHaveClass(/\bsn-message--error\b/);
    await expect(msg).toHaveAttribute('role', 'alert');
  });

  test('severity icon is rendered', async ({ page }) => {
    const d = demo(page, 'Severities');
    await expect(d.locator('.sn-message-icon').first()).toBeVisible();
  });

  test('icon size tokens win over the base icon size', async ({ page }) => {
    const d = demo(page, 'Severities');
    const icon = d.locator('.sn-message-icon').first();
    await expect(icon).toHaveCSS('font-size', '18px');
    await expect(icon).toHaveCSS('width', '18px');
  });

  test('closable message shows a close button with aria-label', async ({ page }) => {
    const d = demo(page, 'Closable');
    const closeBtn = d.locator('.sn-message-close');
    await expect(closeBtn).toBeVisible();
    const label = await closeBtn.getAttribute('aria-label');
    expect(label).toBeTruthy();
  });

  test('clicking close removes the message from the DOM', async ({ page }) => {
    const d = demo(page, 'Closable');
    const msg = d.locator('sn-message');
    await expect(msg).toBeVisible();
    await d.locator('.sn-message-close').click();
    // The showcase @if destroys the element on closed; message disappears
    await expect(msg).not.toBeAttached();
  });

  test('custom icon overrides the default severity icon glyph', async ({ page }) => {
    const d = demo(page, 'Custom icon');
    await expect(d.locator('.sn-message-icon')).toContainText('notifications');
  });

  test('rich content is projected into the message', async ({ page }) => {
    const d = demo(page, 'Rich content');
    await expect(d.locator('sn-message strong')).toContainText('Overlapping tiles detected');
  });

  test('all messages have sn-message base class', async ({ page }) => {
    const d = demo(page, 'Severities');
    const messages = d.locator('sn-message');
    const count = await messages.count();
    for (let i = 0; i < count; i++) {
      await expect(messages.nth(i)).toHaveClass(/\bsn-message\b/);
    }
  });
});
