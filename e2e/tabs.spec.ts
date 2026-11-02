import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.tabs);
  });

  test.describe('Basic tabs', () => {
    test('tablist and tab roles are present', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      await expect(d.locator('[role="tablist"]')).toBeVisible();
      const tabs = d.locator('[role="tab"]');
      await expect(tabs).toHaveCount(3);
    });

    test('first tab is selected by default with aria-selected=true and tabindex=0', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      const tabs = d.locator('[role="tab"]');
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
      await expect(tabs.nth(0)).toHaveAttribute('tabindex', '0');
    });

    test('non-selected tabs have tabindex=-1', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      const tabs = d.locator('[role="tab"]');
      await expect(tabs.nth(1)).toHaveAttribute('tabindex', '-1');
      await expect(tabs.nth(2)).toHaveAttribute('tabindex', '-1');
    });

    test('exactly one tabpanel is visible and aria-labelledby points at the selected tab', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      const panels = d.locator('[role="tabpanel"]');
      await expect(panels).toHaveCount(1);
      const panel = panels.first();
      const labelledBy = await panel.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      const selectedTab = d.locator('[role="tab"][aria-selected="true"]');
      const tabId = await selectedTab.getAttribute('id');
      expect(labelledBy).toBe(tabId);
    });

    test('clicking a tab switches the panel content', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(1).click();
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
      const panel = d.locator('[role="tabpanel"]');
      await expect(panel).toContainText('Icon, colors, and opacity');
    });

    test('keyboard: ArrowRight moves selection AND DOM focus to next tab', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(0).focus();
      await expect(tabs.nth(0)).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await expect(tabs.nth(1)).toBeFocused();
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    });

    test('keyboard: ArrowLeft moves selection AND DOM focus to previous tab', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(1).click();
      await expect(tabs.nth(1)).toBeFocused();
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
      await page.keyboard.press('ArrowLeft');
      await expect(tabs.nth(0)).toBeFocused();
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    });

    test('keyboard: Home moves focus to the first tab', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(2).click();
      await expect(tabs.nth(2)).toBeFocused();
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
      await page.keyboard.press('Home');
      await expect(tabs.nth(0)).toBeFocused();
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    });

    test('keyboard: End moves focus to the last tab', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(0).focus();
      await page.keyboard.press('End');
      await expect(tabs.nth(2)).toBeFocused();
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    });

    test('keyboard: ArrowRight from last tab wraps to first', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(2).click();
      await expect(tabs.nth(2)).toBeFocused();
      // Wait for aria-selected to confirm Angular effect has run and key manager is in sync
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
      await page.keyboard.press('ArrowRight');
      await expect(tabs.nth(0)).toBeFocused();
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    });

    test('keyboard: ArrowLeft from first tab wraps to last', async ({ page }) => {
      const d = demo(page, 'Basic tabs');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(0).focus();
      await page.keyboard.press('ArrowLeft');
      await expect(tabs.nth(2)).toBeFocused();
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('With a disabled tab', () => {
    test('disabled tab has the disabled attribute', async ({ page }) => {
      const d = demo(page, 'With a disabled tab');
      const tabs = d.locator('[role="tab"]');
      await expect(tabs.nth(1)).toBeDisabled();
    });

    test('keyboard: ArrowRight skips the disabled tab', async ({ page }) => {
      const d = demo(page, 'With a disabled tab');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(0).focus();
      await expect(tabs.nth(0)).toBeFocused();
      await page.keyboard.press('ArrowRight');
      // tab 1 is disabled - focus should jump to tab 2
      await expect(tabs.nth(2)).toBeFocused();
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
    });

    test('keyboard: ArrowLeft skips the disabled tab', async ({ page }) => {
      const d = demo(page, 'With a disabled tab');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(2).click();
      await expect(tabs.nth(2)).toBeFocused();
      // Wait for aria-selected to confirm Angular effect has run and key manager is in sync
      await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
      await page.keyboard.press('ArrowLeft');
      // tab 1 is disabled - focus should jump to tab 0
      await expect(tabs.nth(0)).toBeFocused();
      await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
    });
  });

  test.describe('Controlled via [(selectedIndex)]', () => {
    test('switching tab updates the readout', async ({ page }) => {
      const d = demo(page, 'Controlled via [(selectedIndex)]');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(1).click();
      await expect(d.locator('.demo-readout')).toContainText('Active tab index: 1');
    });
  });

  test.describe('Controlled via [(value)]', () => {
    test('the tab named by the incoming value starts selected', async ({ page }) => {
      const d = demo(page, 'Controlled via [(value)]');
      const tabs = d.locator('[role="tab"]');
      await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
      await expect(d.locator('.demo-readout')).toContainText('Active tab value: appearance');
    });

    test('switching tab reports the new tab value', async ({ page }) => {
      const d = demo(page, 'Controlled via [(value)]');
      await d.locator('[role="tab"]').nth(2).click();
      await expect(d.locator('.demo-readout')).toContainText('Active tab value: options');
    });

    test('arrow keys report the value they land on', async ({ page }) => {
      const d = demo(page, 'Controlled via [(value)]');
      const tabs = d.locator('[role="tab"]');
      await tabs.nth(1).click();
      await tabs.nth(1).press('ArrowLeft');
      await expect(d.locator('.demo-readout')).toContainText('Active tab value: general');
    });
  });

  // Whether a list overflows at all is a layout question, so the parts that
  // matter here can only be checked against a real browser.
  test.describe('Scrollable', () => {
    test('the list overflows rather than squeezing the buttons', async ({ page }) => {
      const list = demo(page, 'Scrollable').locator('.sn-tabs-list');
      const { scrollWidth, clientWidth } = await list.evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }));
      expect(scrollWidth).toBeGreaterThan(clientWidth);
    });

    test('the back control starts disabled and the forward one live', async ({ page }) => {
      const d = demo(page, 'Scrollable');
      await expect(d.locator('.sn-tabs-scroll-btn-back')).toBeDisabled();
      await expect(d.locator('.sn-tabs-scroll-btn-forward')).toBeEnabled();
    });

    test('the forward control scrolls the list and enables the back one', async ({ page }) => {
      const d = demo(page, 'Scrollable');
      const list = d.locator('.sn-tabs-list');
      const before = await list.evaluate((el) => el.scrollLeft);

      await d.locator('.sn-tabs-scroll-btn-forward').click();

      await expect
        .poll(async () => list.evaluate((el) => el.scrollLeft))
        .toBeGreaterThan(before);
      await expect(d.locator('.sn-tabs-scroll-btn-back')).toBeEnabled();
    });

    test('scrolling to the end disables the forward control', async ({ page }) => {
      const d = demo(page, 'Scrollable');
      const list = d.locator('.sn-tabs-list');

      await list.evaluate((el) => el.scrollTo({ left: el.scrollWidth }));

      await expect(d.locator('.sn-tabs-scroll-btn-forward')).toBeDisabled();
      await expect(d.locator('.sn-tabs-scroll-btn-back')).toBeEnabled();
    });

    test('arrowing to a tab past the edge brings it into view', async ({ page }) => {
      const d = demo(page, 'Scrollable');
      const tabs = d.locator('[role="tab"]');
      const list = d.locator('.sn-tabs-list');
      await tabs.first().click();
      expect(await list.evaluate((el) => el.scrollLeft)).toBeLessThanOrEqual(1);

      // Far enough along that the tab cannot already be on screen.
      for (let i = 0; i < 6; i++) {
        await d.locator('[role="tab"][aria-selected="true"]').press('ArrowRight');
      }

      await expect.poll(async () => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(1);
      await expect(d.locator('[role="tab"][aria-selected="true"]')).toBeInViewport();
    });
  });
});
