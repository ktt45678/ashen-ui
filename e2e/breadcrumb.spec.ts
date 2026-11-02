import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Breadcrumb', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.breadcrumb);
  });

  test.describe('Basic breadcrumb', () => {
    test('renders a nav landmark with an ordered list', async ({ page }) => {
      const d = demo(page, 'Basic breadcrumb');
      const nav = d.locator('nav');
      await expect(nav).toBeVisible();
      await expect(nav).toHaveAttribute('aria-label', /\S/);
      await expect(nav.locator('ol')).toBeVisible();
    });

    test('contains the correct number of list items', async ({ page }) => {
      const d = demo(page, 'Basic breadcrumb');
      await expect(d.locator('li.sn-breadcrumb-list-item')).toHaveCount(3);
    });

    test('non-last items with href render as anchor elements', async ({ page }) => {
      const d = demo(page, 'Basic breadcrumb');
      const homeLink = d.locator('a.sn-breadcrumb-link').first();
      await expect(homeLink).toBeVisible();
      await expect(homeLink).toHaveAttribute('href', '/');
    });

    test('last item is not a link - renders as a span with aria-current=page', async ({ page }) => {
      const d = demo(page, 'Basic breadcrumb');
      const currentItem = d.locator('.sn-breadcrumb-link--current');
      await expect(currentItem).toBeVisible();
      await expect(currentItem).toHaveAttribute('aria-current', 'page');
      // Must be a span, not an anchor
      await expect(d.locator('a.sn-breadcrumb-link--current')).not.toBeAttached();
    });

    test('exactly one item has aria-current=page', async ({ page }) => {
      const d = demo(page, 'Basic breadcrumb');
      await expect(d.locator('[aria-current="page"]')).toHaveCount(1);
    });

    test('separators are aria-hidden and not exposed as interactive', async ({ page }) => {
      const d = demo(page, 'Basic breadcrumb');
      const separators = d.locator('.sn-breadcrumb-separator');
      // 3 items → 2 separators
      await expect(separators).toHaveCount(2);
      for (let i = 0; i < 2; i++) {
        await expect(separators.nth(i)).toHaveAttribute('aria-hidden', 'true');
      }
    });

    test('link items show the correct text content', async ({ page }) => {
      const d = demo(page, 'Basic breadcrumb');
      await expect(d.locator('.sn-breadcrumb-link').nth(0)).toContainText('Home');
      await expect(d.locator('.sn-breadcrumb-link').nth(1)).toContainText('Library');
      await expect(d.locator('.sn-breadcrumb-link--current')).toContainText('Current Page');
    });
  });

  test.describe('With icons', () => {
    test('first item renders a leading icon', async ({ page }) => {
      const d = demo(page, 'With icons');
      await expect(d.locator('.sn-breadcrumb-item-icon').first()).toBeVisible();
    });

    test('last item still has aria-current=page when icons are present', async ({ page }) => {
      const d = demo(page, 'With icons');
      await expect(d.locator('[aria-current="page"]')).toHaveCount(1);
      await expect(d.locator('.sn-breadcrumb-link--current')).toContainText('Play Music');
    });
  });

  test.describe('Single item (current page only)', () => {
    test('single item is aria-current=page with no separators', async ({ page }) => {
      const d = demo(page, 'Single item (current page only)');
      await expect(d.locator('[aria-current="page"]')).toHaveCount(1);
      await expect(d.locator('.sn-breadcrumb-separator')).toHaveCount(0);
      await expect(d.locator('.sn-breadcrumb-link--current')).toContainText('Dashboard');
    });

    test('single item renders no anchor links', async ({ page }) => {
      const d = demo(page, 'Single item (current page only)');
      await expect(d.locator('a.sn-breadcrumb-link')).toHaveCount(0);
    });
  });

  test.describe('Custom aria-label', () => {
    test('nav has the custom aria-label', async ({ page }) => {
      const d = demo(page, 'Custom aria-label');
      await expect(d.locator('nav')).toHaveAttribute('aria-label', 'Site Navigation');
    });

    test('last item is aria-current=page', async ({ page }) => {
      const d = demo(page, 'Custom aria-label');
      await expect(d.locator('[aria-current="page"]')).toHaveCount(1);
      await expect(d.locator('.sn-breadcrumb-link--current')).toContainText('About');
    });
  });

  test.describe('snClass pass-through', () => {
    test('custom class is applied to the breadcrumb host', async ({ page }) => {
      const d = demo(page, 'snClass pass-through');
      await expect(d.locator('sn-breadcrumb.my-breadcrumb')).toBeVisible();
    });

    test('link snClass is applied to the anchor element', async ({ page }) => {
      const d = demo(page, 'snClass pass-through');
      await expect(d.locator('a.sn-breadcrumb-link.my-link')).toBeVisible();
    });
  });
});
