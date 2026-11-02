import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Paginator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.paginator);
  });

  test.describe('Basic paginator (10 pages)', () => {
    test('wrapped in a nav landmark with aria-label', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      const nav = d.locator('nav.sn-paginator-nav');
      await expect(nav).toBeVisible();
      await expect(nav).toHaveAttribute('aria-label', /pagination/i);
    });

    test('page 1 button has aria-current=page and class sn-paginator-page--current', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      const firstPageBtn = d.locator('.sn-paginator-page').first();
      await expect(firstPageBtn).toHaveAttribute('aria-current', 'page');
      await expect(firstPageBtn).toHaveClass(/sn-paginator-page--current/);
    });

    test('page buttons have aria-label of the form "Page N"', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      const pageBtns = d.locator('.sn-paginator-page');
      await expect(pageBtns.first()).toHaveAttribute('aria-label', 'Page 1');
    });

    test('first and prev buttons are disabled on page 1', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      await expect(d.locator('.sn-paginator-first')).toBeDisabled();
      await expect(d.locator('.sn-paginator-prev')).toBeDisabled();
    });

    test('last and next buttons are enabled on page 1', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      await expect(d.locator('.sn-paginator-last')).not.toBeDisabled();
      await expect(d.locator('.sn-paginator-next')).not.toBeDisabled();
    });

    test('clicking next advances to page 2', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      await d.locator('.sn-paginator-next').click();
      const pageBtns = d.locator('.sn-paginator-page');
      const currentBtn = pageBtns.filter({ hasText: '2' });
      await expect(currentBtn).toHaveAttribute('aria-current', 'page');
    });

    test('clicking last goes to the last page, disabling next and last', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      await d.locator('.sn-paginator-last').click();
      await expect(d.locator('.sn-paginator-next')).toBeDisabled();
      await expect(d.locator('.sn-paginator-last')).toBeDisabled();
      await expect(d.locator('.sn-paginator-first')).not.toBeDisabled();
      await expect(d.locator('.sn-paginator-prev')).not.toBeDisabled();
    });

    test('clicking first from the last page goes back to page 1', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      await d.locator('.sn-paginator-last').click();
      await d.locator('.sn-paginator-first').click();
      await expect(d.locator('.sn-paginator-first')).toBeDisabled();
      await expect(d.locator('.sn-paginator-prev')).toBeDisabled();
      const firstPageBtn = d.locator('.sn-paginator-page').first();
      await expect(firstPageBtn).toHaveAttribute('aria-current', 'page');
    });

    test('clicking a page number button makes it the current page', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      // Navigate a few pages so siblings are visible then click page 2
      await d.locator('.sn-paginator-next').click();
      await d.locator('.sn-paginator-next').click();
      // page 2 button (label "Page 2", text "2") should be visible in the window
      const pageBtn = d.locator('.sn-paginator-page[aria-label="Page 2"]');
      await pageBtn.click();
      await expect(pageBtn).toHaveAttribute('aria-current', 'page');
      await expect(pageBtn).toHaveClass(/sn-paginator-page--current/);
    });

    test('report label shows "1–10 of 100" on page 1', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      await expect(d.locator('.sn-paginator-report')).toHaveText('1–10 of 100');
    });

    test('report label updates after navigating to page 2', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      await d.locator('.sn-paginator-next').click();
      await expect(d.locator('.sn-paginator-report')).toHaveText('11–20 of 100');
    });

    test('report label shows correct range on last page', async ({ page }) => {
      const d = demo(page, 'Basic paginator (10 pages)');
      await d.locator('.sn-paginator-last').click();
      await expect(d.locator('.sn-paginator-report')).toHaveText('91–100 of 100');
    });
  });

  test.describe('Without edge (first / last) buttons', () => {
    test('first and last buttons are not rendered', async ({ page }) => {
      const d = demo(page, 'Without edge (first / last) buttons');
      await expect(d.locator('.sn-paginator-first')).toHaveCount(0);
      await expect(d.locator('.sn-paginator-last')).toHaveCount(0);
    });

    test('prev and next buttons are still present', async ({ page }) => {
      const d = demo(page, 'Without edge (first / last) buttons');
      await expect(d.locator('.sn-paginator-prev')).toBeVisible();
      await expect(d.locator('.sn-paginator-next')).toBeVisible();
    });
  });

  test.describe('Middle page with siblings and ellipsis jump panel', () => {
    test('ellipsis button has aria-haspopup=dialog', async ({ page }) => {
      const d = demo(page, 'Middle page with siblings and ellipsis jump panel');
      await d.locator('.sn-paginator-next').click();
      await d.locator('.sn-paginator-next').click();
      await d.locator('.sn-paginator-next').click();
      const ellipsis = d.locator('.sn-paginator-ellipsis').first();
      await expect(ellipsis).toHaveAttribute('aria-haspopup', 'dialog');
    });

    test('clicking ellipsis opens a dialog jump panel', async ({ page }) => {
      const d = demo(page, 'Middle page with siblings and ellipsis jump panel');
      await d.locator('.sn-paginator-next').click();
      await d.locator('.sn-paginator-next').click();
      await d.locator('.sn-paginator-next').click();
      const ellipsis = d.locator('.sn-paginator-ellipsis').first();
      await ellipsis.click();
      await expect(page.locator('.sn-paginator-jump-panel[role="dialog"]')).toBeVisible();
    });

    test('selecting a page from the jump panel closes it and navigates', async ({ page }) => {
      const d = demo(page, 'Middle page with siblings and ellipsis jump panel');
      await d.locator('.sn-paginator-next').click();
      await d.locator('.sn-paginator-next').click();
      await d.locator('.sn-paginator-next').click();
      const ellipsis = d.locator('.sn-paginator-ellipsis').first();
      await ellipsis.click();
      const jumpPanel = page.locator('.sn-paginator-jump-panel');
      await expect(jumpPanel).toBeVisible();
      await jumpPanel.locator('.sn-paginator-jump-page[aria-label="Page 1"]').click();
      await expect(jumpPanel).not.toBeVisible();
      await expect(d.locator('.sn-paginator-page[aria-label="Page 1"]').first()).toHaveAttribute('aria-current', 'page');
    });

    test('Escape closes the jump panel', async ({ page }) => {
      const d = demo(page, 'Middle page with siblings and ellipsis jump panel');
      await d.locator('.sn-paginator-next').click();
      await d.locator('.sn-paginator-next').click();
      await d.locator('.sn-paginator-next').click();
      const ellipsis = d.locator('.sn-paginator-ellipsis').first();
      await ellipsis.click();
      const jumpPanel = page.locator('.sn-paginator-jump-panel');
      await expect(jumpPanel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(jumpPanel).not.toBeVisible();
    });
  });

  test.describe('With styled rows-per-page selector', () => {
    test('rows-per-page trigger button is present', async ({ page }) => {
      const d = demo(page, 'With styled rows-per-page selector');
      await expect(d.locator('.sn-paginator-rows-trigger')).toBeVisible();
    });

    test('rows trigger has aria-haspopup=listbox and aria-expanded=false initially', async ({ page }) => {
      const d = demo(page, 'With styled rows-per-page selector');
      const trigger = d.locator('.sn-paginator-rows-trigger');
      await expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    test('clicking the rows trigger opens a listbox panel', async ({ page }) => {
      const d = demo(page, 'With styled rows-per-page selector');
      await d.locator('.sn-paginator-rows-trigger').click();
      await expect(page.locator('.sn-paginator-rows-panel[role="listbox"]')).toBeVisible();
    });

    test('selecting a different rows option changes the report label', async ({ page }) => {
      const d = demo(page, 'With styled rows-per-page selector');
      await d.locator('.sn-paginator-rows-trigger').click();
      const panel = page.locator('.sn-paginator-rows-panel');
      await expect(panel).toBeVisible();
      await panel.locator('.sn-paginator-rows-option').filter({ hasText: '25' }).click();
      await expect(panel).not.toBeVisible();
      await expect(d.locator('.sn-paginator-report')).toHaveText('1–25 of 200');
    });

    test('Escape closes the rows panel', async ({ page }) => {
      const d = demo(page, 'With styled rows-per-page selector');
      await d.locator('.sn-paginator-rows-trigger').click();
      const panel = page.locator('.sn-paginator-rows-panel');
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
    });

    test('current rows option has aria-selected=true', async ({ page }) => {
      const d = demo(page, 'With styled rows-per-page selector');
      await d.locator('.sn-paginator-rows-trigger').click();
      const panel = page.locator('.sn-paginator-rows-panel');
      const selectedOption = panel.locator('.sn-paginator-rows-option[aria-selected="true"]');
      await expect(selectedOption).toHaveText('10');
    });
  });
});
