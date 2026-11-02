import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('InfiniteScroll', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.infiniteScroll);
  });

  test.describe('Element scroller - load more on scroll down', () => {
    test('initial items are rendered on mount (auto-fill fires when list shorter than viewport)', async ({ page }) => {
      const d = demo(page, 'Element scroller - load more on scroll down');
      // The directive auto-fires scrolled on mount; the page starts with BATCH=20 items then may
      // have loaded more already. Assert at least 20 are present.
      await expect(d.locator('.list-item').first()).toBeVisible();
      const count = await d.locator('.list-item').count();
      expect(count).toBeGreaterThanOrEqual(20);
    });

    test('total-loaded counter is visible', async ({ page }) => {
      const d = demo(page, 'Element scroller - load more on scroll down');
      await expect(d.locator('.demo-count')).toBeVisible();
    });

    test('scrolling to the bottom loads more items', async ({ page }) => {
      const d = demo(page, 'Element scroller - load more on scroll down');
      const container = d.locator('.scroll-container');
      await expect(d.locator('.list-item').first()).toBeVisible();

      const countBefore = await d.locator('.list-item').count();

      await container.evaluate((el) => { el.scrollTop = el.scrollHeight; });

      await expect.poll(async () => d.locator('.list-item').count(), { timeout: 5000 })
        .toBeGreaterThan(countBefore);
    });

    test('repeated scrolling loads more items each time', async ({ page }) => {
      const d = demo(page, 'Element scroller - load more on scroll down');
      const container = d.locator('.scroll-container');
      await expect(d.locator('.list-item').first()).toBeVisible();

      await container.evaluate((el) => { el.scrollTop = el.scrollHeight; });
      await expect.poll(() => d.locator('.list-item').count(), { timeout: 5000 })
        .toBeGreaterThan(20);

      const afterFirst = await d.locator('.list-item').count();

      await container.evaluate((el) => { el.scrollTop = el.scrollHeight; });
      await expect.poll(() => d.locator('.list-item').count(), { timeout: 5000 })
        .toBeGreaterThan(afterFirst);
    });

    test('item count grows and total-loaded counter reflects it', async ({ page }) => {
      const d = demo(page, 'Element scroller - load more on scroll down');
      const container = d.locator('.scroll-container');
      await expect(d.locator('.demo-count')).toBeVisible();

      const textBefore = await d.locator('.demo-count').textContent();

      await container.evaluate((el) => { el.scrollTop = el.scrollHeight; });

      await expect.poll(() => d.locator('.demo-count').textContent(), { timeout: 5000 })
        .not.toBe(textBefore);
    });

    test('loading indicator appears while fetching', async ({ page }) => {
      const d = demo(page, 'Element scroller - load more on scroll down');
      const container = d.locator('.scroll-container');
      await expect(d.locator('.list-item').first()).toBeVisible();

      await container.evaluate((el) => { el.scrollTop = el.scrollHeight; });
      // .loading-row appears transiently; wait for it then wait for it to disappear
      await expect(d.locator('.loading-row')).toBeVisible({ timeout: 3000 });
      await expect(d.locator('.loading-row')).toBeHidden({ timeout: 5000 });
    });
  });

  test.describe('Load older content on scroll up (chat history)', () => {
    test('initial chat messages are rendered', async ({ page }) => {
      const d = demo(page, 'Load older content on scroll up (chat history)');
      await expect(d.locator('.chat-bubble').first()).toBeVisible();
    });

    test('chat container shows multiple messages on load', async ({ page }) => {
      const d = demo(page, 'Load older content on scroll up (chat history)');
      await expect(d.locator('.chat-bubble').first()).toBeVisible();
      const count = await d.locator('.chat-bubble').count();
      expect(count).toBeGreaterThan(1);
    });

    test('scrolling to the top of the chat loads older messages (prepends)', async ({ page }) => {
      const d = demo(page, 'Load older content on scroll up (chat history)');
      const container = d.locator('.chat-container');
      await expect(d.locator('.chat-bubble').first()).toBeVisible();

      const countBefore = await d.locator('.chat-bubble').count();
      const firstTextBefore = await d.locator('.chat-bubble').first().textContent();

      // Re-drive the down→up cycle each poll: the first scrolledUp emit is
      // suppressed when the top sentinel's IO callback outruns the scroll listener.
      await expect
        .poll(async () => {
          await container.evaluate((el) => { el.scrollTop = el.scrollHeight; });
          await container.evaluate((el) => { el.scrollTop = 0; });
          return d.locator('.chat-bubble').count();
        }, { timeout: 8000 })
        .toBeGreaterThan(countBefore);

      await expect.poll(() => d.locator('.chat-bubble').first().textContent(), { timeout: 6000 })
        .not.toBe(firstTextBefore);
    });

    test('chat bubbles have author labels', async ({ page }) => {
      const d = demo(page, 'Load older content on scroll up (chat history)');
      await expect(d.locator('.chat-author').first()).toBeVisible();
    });
  });

  test.describe('Composed with sn-table - scrollable log viewer', () => {
    test('table renders initial rows', async ({ page }) => {
      const d = demo(page, 'Composed with sn-table - scrollable log viewer');
      await expect(d.locator('sn-table tbody tr').first()).toBeVisible();
    });

    test('scrolling the table wrapper loads more rows', async ({ page }) => {
      const d = demo(page, 'Composed with sn-table - scrollable log viewer');
      const wrapper = d.locator('.table-scroll-wrap');
      await expect(d.locator('sn-table tbody tr').first()).toBeVisible();

      const rowsBefore = await d.locator('sn-table tbody tr').count();

      await wrapper.evaluate((el) => { el.scrollTop = el.scrollHeight; });

      await expect.poll(() => d.locator('sn-table tbody tr').count(), { timeout: 5000 })
        .toBeGreaterThan(rowsBefore);
    });

    test('table has Level and Message columns', async ({ page }) => {
      const d = demo(page, 'Composed with sn-table - scrollable log viewer');
      await expect(d.locator('sn-table')).toContainText('Level');
      await expect(d.locator('sn-table')).toContainText('Message');
    });
  });

  test.describe('Disabled toggle', () => {
    test('disabled example renders list items', async ({ page }) => {
      const d = demo(page, 'Disabled toggle');
      await expect(d.locator('.list-item').first()).toBeVisible();
    });

    test('status text shows "enabled" when checkbox is unchecked', async ({ page }) => {
      const d = demo(page, 'Disabled toggle');
      await expect(d.locator('.demo-count')).toContainText('enabled');
    });

    test('when disabled, scrolling does not load more items', async ({ page }) => {
      const d = demo(page, 'Disabled toggle');
      const container = d.locator('.scroll-container');

      // Enable disabled state via the checkbox
      const checkbox = d.locator('input[type="checkbox"]');
      if (!(await checkbox.isChecked())) {
        await checkbox.click();
      }
      await expect(d.locator('.demo-count')).toContainText('disabled');

      const countBefore = await d.locator('.list-item').count();

      await container.evaluate((el) => { el.scrollTop = el.scrollHeight; });

      // Give CD time to react; item count must NOT change
      await page.waitForTimeout(600);
      const countAfter = await d.locator('.list-item').count();
      expect(countAfter).toBe(countBefore);
    });

    test('toggling the checkbox switches between enabled and disabled states', async ({ page }) => {
      const d = demo(page, 'Disabled toggle');
      const checkbox = d.locator('input[type="checkbox"]');

      // Ensure not already disabled
      if (await checkbox.isChecked()) {
        await checkbox.click();
      }
      await expect(d.locator('.demo-count')).toContainText('enabled');

      await checkbox.click();
      await expect(d.locator('.demo-count')).toContainText('disabled');

      await checkbox.click();
      await expect(d.locator('.demo-count')).toContainText('enabled');
    });
  });
});
