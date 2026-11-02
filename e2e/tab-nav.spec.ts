import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Tab Nav', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.tabNav);
  });

  test('router links follow the URL', async ({ page }) => {
    const nav = demo(page, 'Router links').locator('nav.sn-tab-nav');
    const general = nav.getByRole('link', { name: 'General' });
    const appearance = nav.getByRole('link', { name: 'Appearance' });
    await expect(general).toHaveAttribute('aria-current', 'page');
    await expect(appearance).not.toHaveAttribute('aria-current', /.+/);

    await appearance.click();
    await expect(page).toHaveURL(/section=appearance/);
    await expect(appearance).toHaveAttribute('aria-current', 'page');
    await expect(appearance).toHaveClass(/sn-tab-link-active/);
    await expect(general).not.toHaveAttribute('aria-current', /.+/);
  });

  test('the indicator moves under the active link', async ({ page }) => {
    const d = demo(page, 'Buttons with a bound active state');
    const indicator = d.locator('.sn-tab-nav-indicator');
    const target = d.getByRole('button', { name: 'Notifications' });

    await target.click();
    await expect(target).toHaveAttribute('aria-current', 'true');
    await expect(d.locator('.demo-readout')).toHaveText('Selected: Notifications');
    await expect
      .poll(async () => {
        const [a, b] = await Promise.all([indicator.boundingBox(), target.boundingBox()]);
        return a && b ? Math.round(a.x - b.x) + Math.round(a.width - b.width) : NaN;
      })
      .toBe(0);
  });

  test('links are reachable with Tab, without arrow-key roving', async ({ page }) => {
    const d = demo(page, 'Buttons with a bound active state');
    const buttons = d.locator('[snTabLink]');
    await buttons.first().focus();
    await page.keyboard.press('Tab');
    await expect(buttons.nth(1)).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(buttons.nth(1)).toBeFocused();
  });

  test('an overflowing bar shows scroll controls that scroll the links', async ({ page }) => {
    const d = demo(page, 'Scrolling overflow');
    const back = d.locator('.sn-tab-nav-scroll-btn-back');
    const forward = d.locator('.sn-tab-nav-scroll-btn-forward');
    const list = d.locator('.sn-tab-nav-list');
    await d.scrollIntoViewIfNeeded();

    await expect(forward).toBeVisible();
    await expect(back).toBeDisabled();
    await expect(forward).toHaveAttribute('aria-hidden', 'true');

    await forward.click();
    await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    await expect(back).toBeEnabled();
  });

  test('a bar that fits shows no scroll controls', async ({ page }) => {
    const d = demo(page, 'With icons');
    await expect(d.locator('.sn-tab-link')).toHaveCount(3);
    await expect(d.locator('.sn-tab-nav-scroll-btn')).toHaveCount(0);
  });

  test('vertical bar stacks the links and hides the indicator', async ({ page }) => {
    const d = demo(page, 'Vertical');
    const nav = d.locator('nav.sn-tab-nav');
    await expect(nav).toHaveClass(/sn-tab-nav-vertical/);
    const links = d.locator('.sn-tab-link');
    const [first, second] = await Promise.all([links.nth(0).boundingBox(), links.nth(1).boundingBox()]);
    expect(second!.y).toBeGreaterThan(first!.y);
    await expect(d.locator('.sn-tab-nav-indicator')).toHaveCount(0);

    await links.nth(2).click();
    await expect(links.nth(2)).toHaveClass(/sn-tab-link-active/);
  });
});
