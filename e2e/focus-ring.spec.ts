import { expect, test } from '@playwright/test';

/**
 * `--sn-focus-ring-style`.
 *
 * The switch is a CSS style container query, which no unit test can exercise:
 * jsdom has no cascade for `@container style()`. These specs are the only thing
 * that proves the token actually reaches a rendered outline.
 */
test.describe('focus ring style switch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/button');
    await page.locator('button.sn-button').first().waitFor();
  });

  async function focusedRing(page: import('@playwright/test').Page) {
    const el = page.locator('button.sn-button').first();
    await el.focus();
    return el.evaluate((node) => {
      const s = getComputedStyle(node);
      return {
        width: s.outlineWidth,
        style: s.outlineStyle,
        offset: s.outlineOffset,
      };
    });
  }

  test('defaults to an outward outline', async ({ page }) => {
    const ring = await focusedRing(page);
    expect(ring.style).toBe('solid');
    expect(ring.width).toBe('2px');
    // --sn-focus-ring-offset: 2px, drawn outside the border box.
    expect(ring.offset).toBe('2px');
  });

  test('inset pulls the same outline inside the border box', async ({ page }) => {
    await page.evaluate(() =>
      document.documentElement.style.setProperty('--sn-focus-ring-style', 'inset'),
    );
    const ring = await focusedRing(page);
    // Still an outline - box-shadow would be stripped in forced-colors mode.
    expect(ring.style).toBe('solid');
    expect(ring.width).toBe('2px');
    // calc(-1 * --sn-focus-ring-width) == -2px.
    expect(ring.offset).toBe('-2px');
  });

  test('scopes to a subtree rather than only the document root', async ({ page }) => {
    await page.evaluate(() => {
      const btn = document.querySelector('button.sn-button')!;
      (btn.parentElement as HTMLElement).style.setProperty('--sn-focus-ring-style', 'inset');
    });
    const ring = await focusedRing(page);
    expect(ring.offset).toBe('-2px');
  });

  test('width and offset stay independently themeable', async ({ page }) => {
    await page.evaluate(() => {
      const root = document.documentElement.style;
      root.setProperty('--sn-focus-ring-width', '3px');
      root.setProperty('--sn-focus-ring-offset', '5px');
    });
    expect(await focusedRing(page)).toMatchObject({ width: '3px', offset: '5px' });

    await page.evaluate(() =>
      document.documentElement.style.setProperty('--sn-focus-ring-style', 'inset'),
    );
    // inset offset is derived from the width, not the outward offset.
    expect(await focusedRing(page)).toMatchObject({ width: '3px', offset: '-3px' });
  });
});
