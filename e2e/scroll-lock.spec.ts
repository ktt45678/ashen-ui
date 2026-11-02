import { expect, test } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

/**
 * `ScrollLock` wraps the CDK's `BlockScrollStrategy`.
 *
 * None of this is unit-testable: the strategy only engages when the document
 * actually overflows, and jsdom performs no layout, so `scrollHeight` is always
 * 0 and the strategy never runs. These specs are the only coverage of the two
 * failure modes the rewrite exists to fix.
 */
test.describe('ScrollLock', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.dialog);
    await page.setViewportSize({ width: 1280, height: 600 });

    // The showcase shell is an inner-scroll layout (`html, body { height: 100% }`
    // and `.docs-main { overflow-y: auto }`), so the DOCUMENT never overflows and
    // BlockScrollStrategy correctly no-ops -- that is the documented
    // "app scrolls an inner container" case, not a bug. Give the document real
    // overflow so there is something to lock.
    //
    // The spacer goes ABOVE the app, not below it. Playwright scrolls an
    // element into view before clicking it, so with the spacer at the bottom
    // the act of opening the dialog scrolled the page back to the trigger near
    // y=0, and "restore the scroll position" then had nothing to restore. It
    // passed only where the default font metrics happened to put the trigger
    // below the scroll offset the test had set.
    await page.evaluate(() => {
      document.documentElement.style.height = 'auto';
      document.body.style.height = 'auto';
      const spacer = document.createElement('div');
      spacer.id = 'sn-scroll-spacer';
      spacer.style.height = '3000px';
      document.body.insertBefore(spacer, document.body.firstChild);
    });
  });

  const htmlStyles = (page: import('@playwright/test').Page) =>
    page.evaluate(() => {
      const html = document.documentElement;
      return {
        blocked: html.classList.contains('cdk-global-scrollblock'),
        paddingRight: html.style.paddingRight,
        scrollbarGutter: html.style.scrollbarGutter,
        background: html.style.background,
        position: getComputedStyle(html).position,
      };
    });

  async function openFirstDialog(page: import('@playwright/test').Page) {
    const section = demo(page, 'Basic');
    await section.getByRole('button').first().click();
    await page.locator('.sn-dialog-panel').first().waitFor({ state: 'visible' });
  }

  test('blocks page scroll while a dialog is open and restores it on close', async ({ page }) => {
    expect(await htmlStyles(page)).toMatchObject({ blocked: false });

    await openFirstDialog(page);
    expect(await htmlStyles(page)).toMatchObject({ blocked: true, position: 'fixed' });

    await page.keyboard.press('Escape');
    await page.locator('.sn-dialog-panel').first().waitFor({ state: 'detached' });
    expect(await htmlStyles(page)).toMatchObject({ blocked: false });
  });

  test('reserves no gutter and repaints no background', async ({ page }) => {
    // Failure mode 1: the old lock painted html.style.background with a
    // semi-transparent overlay token that could never match the opaque mask,
    // and being the shorthand it also wiped any background-image.
    // Failure mode 2: padding-right / scrollbar-gutter shifted fixed layout.
    await openFirstDialog(page);

    expect(await htmlStyles(page)).toMatchObject({
      blocked: true,
      paddingRight: '',
      scrollbarGutter: '',
      background: '',
    });
  });

  test('does not shift a fixed right-anchored element', async ({ page }) => {
    await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.id = 'sn-fixed-probe';
      probe.style.cssText = 'position:fixed;top:0;right:0;width:50px;height:50px;';
      document.body.appendChild(probe);
    });
    const probe = page.locator('#sn-fixed-probe');
    const before = await probe.boundingBox();

    await openFirstDialog(page);
    const during = await probe.boundingBox();

    expect(during!.x).toBe(before!.x);
    expect(during!.width).toBe(before!.width);
  });

  test('restores the scroll position it froze', async ({ page }) => {
    // Scroll the trigger into view FIRST, so the click that opens the dialog
    // has no scrolling of its own to do and `before` is the position the lock
    // actually freezes.
    const trigger = demo(page, 'Basic').getByRole('button').first();
    await trigger.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => window.scrollY);
    expect(before).toBeGreaterThan(0);

    await trigger.click();
    await page.locator('.sn-dialog-panel').first().waitFor({ state: 'visible' });
    // While blocked, the page is pinned: `html` is position:fixed at -before.
    expect(await page.evaluate(() => document.documentElement.style.top)).toBe(`-${before}px`);

    await page.keyboard.press('Escape');
    await page.locator('.sn-dialog-panel').first().waitFor({ state: 'detached' });

    expect(await page.evaluate(() => window.scrollY)).toBe(before);
  });

  test('returns focus to the trigger on close', async ({ page }) => {
    const trigger = demo(page, 'Basic').getByRole('button').first();
    await trigger.scrollIntoViewIfNeeded();
    const triggerText = (await trigger.textContent())?.trim();

    await trigger.click();
    await page.locator('.sn-dialog-panel').first().waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await page.locator('.sn-dialog-panel').first().waitFor({ state: 'detached' });

    const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
    expect(focused).toBe(triggerText);
  });
});
