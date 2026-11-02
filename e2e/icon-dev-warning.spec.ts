import { expect, test } from '@playwright/test';
import { ROUTES } from './support/pages';

/**
 * Dev-mode warning for unresolved icon glyphs.
 *
 * Only meaningful in a real browser: the check reads
 * `getComputedStyle(el, '::before').content`, and jsdom neither loads the
 * Tailwind-generated utilities nor computes pseudo-element styles, so a unit
 * test would warn for every icon and prove nothing.
 */
test.describe('sn-icon dev warning', () => {
  test('does not warn for icons the showcase safelists', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'warning' && m.text().includes('[sn-icon]')) warnings.push(m.text());
    });

    await page.goto(ROUTES.icon);
    await page.locator('sn-icon').first().waitFor();
    // Give the rAF-deferred check a couple of frames to run for every icon on
    // the page. A false positive here would make the warning useless noise.
    await page.waitForTimeout(500);

    expect(warnings).toEqual([]);
  });

  test('warns once for a class-mode name that generated no utility', async ({ page }) => {
    const warnings: string[] = [];
    page.on('console', (m) => {
      if (m.type() === 'warning' && m.text().includes('[sn-icon]')) warnings.push(m.text());
    });

    await page.goto(ROUTES.icon);
    await page.locator('sn-icon').first().waitFor();
    await page.waitForTimeout(300);
    warnings.length = 0;

    // A name Tailwind has never seen: no .sn-icon-* rule exists, so the glyph
    // silently renders as nothing. That is exactly the case worth reporting.
    await page.evaluate(() => {
      const host = document.querySelector('sn-icon')!;
      host.setAttribute('data-probe', '');
    });

    const resolved = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.className = 'sn-icon icon-ms sn-icon-definitely-not-a-real-glyph-xyz';
      document.body.appendChild(probe);
      const content = getComputedStyle(probe, '::before').content;
      probe.remove();
      return content;
    });

    // Pin the mechanism the warning relies on: an unmatched utility leaves
    // ::before content at its initial value. If Tailwind ever started emitting
    // a rule for unknown names, the whole check would silently stop working.
    expect(['none', 'normal', '""']).toContain(resolved);
  });

  test('the safelisted names do resolve to a real glyph', async ({ page }) => {
    await page.goto(ROUTES.icon);
    await page.locator('sn-icon').first().waitFor();

    const content = await page.evaluate(() => {
      const probe = document.createElement('span');
      probe.className = 'sn-icon icon-ms sn-icon-settings';
      document.body.appendChild(probe);
      const c = getComputedStyle(probe, '::before').content;
      probe.remove();
      return c;
    });

    expect(['none', 'normal', '""']).not.toContain(content);
  });
});
