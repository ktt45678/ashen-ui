import { test, expect, type Page } from '@playwright/test';
import { ROUTES } from './support/pages';

/**
 * The unit specs assert classes and signals. What they cannot see is whether
 * the CSS agrees with them: a component can carry `--sticky-start` and still be
 * painted on the wrong edge. Every assertion here is a measured position or a
 * computed style, taken with the showcase's own direction toggle flipped.
 */

async function setDirection(page: Page, direction: 'ltr' | 'rtl'): Promise<void> {
  const label = direction === 'rtl' ? 'RTL' : 'LTR';
  await page.getByRole('navigation', { name: 'Text direction' }).getByRole('button', { name: label }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', direction);
}

test.describe('rtl', () => {
  test.afterEach(async ({ page }) => {
    // The toggle persists to localStorage, so leave it as the suite found it.
    await setDirection(page, 'ltr');
  });

  test('the slider thumb travels from the right edge', async ({ page }) => {
    await page.goto(ROUTES.slider);
    const track = page.locator('.sn-slider-track').first();
    const thumb = track.locator('.sn-slider-thumb');
    const ltrTrack = (await track.boundingBox())!;
    const ltrThumb = (await thumb.boundingBox())!;
    const fromStart = ltrThumb.x - ltrTrack.x;

    await setDirection(page, 'rtl');

    // The whole page mirrors, so the track has moved too and has to be
    // measured again rather than reused from the LTR pass.
    const rtlTrack = (await track.boundingBox())!;
    const rtlThumb = (await thumb.boundingBox())!;
    const fromEnd = rtlTrack.x + rtlTrack.width - (rtlThumb.x + rtlThumb.width);
    expect(fromEnd).toBeCloseTo(fromStart, -1);
  });

  test('a pinned table column sits on the inline start edge', async ({ page }) => {
    await page.goto(ROUTES.table);
    const demo = page.locator('doc-example', { hasText: 'Sticky header and sticky first column' });
    const cell = demo.locator('tbody td.sn-table-cell--sticky-start').first();
    const container = demo.locator('.sn-table-inner').first();

    await setDirection(page, 'rtl');

    const cellBox = (await cell.boundingBox())!;
    const containerBox = (await container.boundingBox())!;
    const gapFromRight = containerBox.x + containerBox.width - (cellBox.x + cellBox.width);
    expect(gapFromRight).toBeLessThan(2);
  });

  test('the floating label clears the prefix on whichever side it is on', async ({ page }) => {
    await page.goto(ROUTES.formField);
    const label = page
      .locator('sn-form-field.sn-form-field-has-prefix.sn-form-field-floating')
      .first()
      .locator('.sn-form-field-label');
    // The resting label is pushed clear of the prefix with a `translateX`,
    // which is physical: read the sign straight off the computed matrix. The
    // label transitions its transform, so poll past the interpolated frames.
    const shift = () => label.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m41);

    await expect.poll(shift).toBeGreaterThan(0);
    await setDirection(page, 'rtl');

    await expect.poll(shift).toBeLessThan(0);
  });

  test('the split-button segments join and divide on the inline start side', async ({ page }) => {
    await page.goto(ROUTES.splitButton);
    const main = page.locator('.sn-split-button-main').first();
    const trigger = page.locator('.sn-split-button-trigger').first();

    await setDirection(page, 'rtl');
    await expect(main).toHaveCSS('border-top-left-radius', '0px');
    await expect(trigger).toHaveCSS('border-top-right-radius', '0px');
    await expect(trigger).toHaveCSS('box-shadow', /inset$/);
    await expect(trigger).toHaveCSS('box-shadow', /\) -1px 0px 0px/);
  });

  test('the paginator chevrons turn around', async ({ page }) => {
    await page.goto(ROUTES.paginator);
    const prev = page.locator('.sn-paginator-prev .sn-icon').first();

    await expect(prev).toHaveText('chevron_left');
    await setDirection(page, 'rtl');
    await expect(prev).toHaveText('chevron_right');
  });

  test('the splitter gutter moves towards the left when the first panel grows', async ({ page }) => {
    await page.goto(ROUTES.splitter);
    const splitter = page.locator('sn-splitter').first();
    const gutter = splitter.locator('.sn-splitter-gutter').first();

    await setDirection(page, 'rtl');

    const splitterBox = (await splitter.boundingBox())!;
    const startX = (await gutter.boundingBox())!.x;
    await gutter.click();
    await gutter.press('ArrowLeft');

    // ArrowLeft grows the first panel, and the first panel is the right-hand
    // one in RTL. The panel transitions its width, so poll for the paint.
    await expect(gutter).toHaveAttribute('aria-valuenow', '60');
    await expect.poll(async () => (await gutter.boundingBox())!.x).toBeLessThan(startX);
    expect((await gutter.boundingBox())!.x).toBeGreaterThan(splitterBox.x);
  });

  test('a start drawer opens against the right edge, a left one stays left', async ({ page }) => {
    await page.goto(ROUTES.drawer);
    await setDirection(page, 'rtl');
    const viewport = page.viewportSize()!;

    // Each panel slides in from off-screen, so poll rather than measure the
    // first frame after it becomes visible.
    await page.getByRole('button', { name: 'Open Start Drawer' }).click();
    const startPanel = page.locator('.sn-drawer-panel--start');
    await expect
      .poll(async () => {
        const box = (await startPanel.boundingBox())!;
        return Math.round(box.x + box.width);
      })
      .toBe(viewport.width);
    await page.keyboard.press('Escape');
    await expect(startPanel).toBeHidden();

    await page.getByRole('button', { name: 'Open Left Drawer' }).click();
    const leftPanel = page.locator('.sn-drawer-panel--left');
    await expect.poll(async () => Math.round((await leftPanel.boundingBox())!.x)).toBe(0);
    await page.keyboard.press('Escape');
    // The mask outlives the key press by the exit animation, and it swallows
    // the clicks the teardown needs.
    await expect(page.locator('.sn-drawer-mask')).toHaveCount(0);
  });

  test('the calendar arrows walk the week the way it reads', async ({ page }) => {
    await page.goto(ROUTES.datePicker);
    await setDirection(page, 'rtl');

    const trigger = page.locator('button.sn-select-trigger').first();
    await trigger.click();
    const panel = page.locator('.cdk-overlay-container [role="dialog"]');
    await expect(panel).toBeVisible();

    // The previous-month button is first in the DOM and points along the
    // reading direction, so in RTL it carries the right-hand chevron.
    await expect(panel.locator('.sn-date-picker-nav-btn .sn-icon').first()).toHaveText(
      'chevron_right',
    );

    // Compared as dates, not as day numbers: the calendar opens on today, and
    // a step off the end of the month lands on the 1st of the next one.
    const focused = panel.locator('[data-day][tabindex="0"]');
    const before = new Date((await focused.getAttribute('aria-label'))!);
    const expected = new Date(before);
    expected.setDate(expected.getDate() + 1);

    await focused.press('ArrowLeft');
    await expect
      .poll(async () =>
        panel.locator('[data-day][tabindex="0"]').first().getAttribute('aria-label'),
      )
      .toBe(expected.toDateString());

    await page.keyboard.press('Escape');
    // The backdrop outlives the key press by the exit animation, and it
    // swallows the clicks the teardown needs.
    await expect(page.locator('.sn-select-backdrop')).toHaveCount(0);
  });

  test('tabs arrows walk the strip the way it reads', async ({ page }) => {
    await page.goto(ROUTES.tabs);
    const tabs = page.locator('sn-tabs').first();
    const buttons = tabs.locator('[role="tab"]');

    await setDirection(page, 'rtl');

    await buttons.first().click();
    await buttons.first().press('ArrowLeft');
    await expect(buttons.nth(1)).toHaveAttribute('aria-selected', 'true');
  });
});
