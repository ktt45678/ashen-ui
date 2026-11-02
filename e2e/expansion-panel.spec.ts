import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('ExpansionPanel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.expansionPanel);
  });

  test.describe('Single-open accordion (default)', () => {
    test('header buttons have aria-expanded=false initially', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const buttons = d.locator('button.sn-expansion-panel-button');
      await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'false');
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'false');
      await expect(buttons.nth(2)).toHaveAttribute('aria-expanded', 'false');
    });

    test('header button has aria-controls pointing at the content region', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const btn = d.locator('button.sn-expansion-panel-button').first();
      const controls = await btn.getAttribute('aria-controls');
      expect(controls).toBeTruthy();
      const content = d.locator(`#${controls}`);
      await expect(content).toHaveAttribute('role', 'region');
    });

    test('clicking a header expands it (aria-expanded=true)', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const btn = d.locator('button.sn-expansion-panel-button').first();
      await btn.click();
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
    });

    test('clicking an expanded header collapses it (aria-expanded=false)', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const btn = d.locator('button.sn-expansion-panel-button').first();
      await btn.click();
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-expanded', 'false');
    });

    test('button gets sn-expansion-panel-button--expanded class when open', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const btn = d.locator('button.sn-expansion-panel-button').first();
      await btn.click();
      await expect(btn).toHaveClass(/\bsn-expansion-panel-button--expanded\b/);
    });

    test('chevron gets sn-expansion-panel-toggle--expanded class when open', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const btn = d.locator('button.sn-expansion-panel-button').first();
      await btn.click();
      await expect(d.locator('sn-icon.sn-expansion-panel-toggle').first()).toHaveClass(
        /\bsn-expansion-panel-toggle--expanded\b/,
      );
    });

    test('content region is accessible (not inert) when expanded', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const btn = d.locator('button.sn-expansion-panel-button').first();
      const controls = await btn.getAttribute('aria-controls');
      const content = d.locator(`#${controls}`);
      await btn.click();
      await expect(content).not.toHaveAttribute('inert');
    });

    test('content region is inert when collapsed', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const btn = d.locator('button.sn-expansion-panel-button').first();
      const controls = await btn.getAttribute('aria-controls');
      const content = d.locator(`#${controls}`);
      await expect(content).toHaveAttribute('inert');
    });

    test('opening one panel collapses the previously open panel', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const buttons = d.locator('button.sn-expansion-panel-button');
      await buttons.nth(0).click();
      await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'true');
      await buttons.nth(1).click();
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true');
      await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'false');
    });

    test('Enter key on focused header toggles expansion', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const btn = d.locator('button.sn-expansion-panel-button').first();
      await btn.focus();
      await expect(btn).toBeFocused();
      await page.keyboard.press('Enter');
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
    });

    test('Space key on focused header toggles expansion', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const btn = d.locator('button.sn-expansion-panel-button').first();
      await btn.focus();
      await expect(btn).toBeFocused();
      await page.keyboard.press('Space');
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
    });

    test('ArrowDown moves focus to next panel header', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const buttons = d.locator('button.sn-expansion-panel-button');
      await buttons.nth(0).click();
      await expect(buttons.nth(0)).toBeFocused();
      await page.keyboard.press('ArrowDown');
      await expect(buttons.nth(1)).toBeFocused();
    });

    test('ArrowUp moves focus to previous panel header', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const buttons = d.locator('button.sn-expansion-panel-button');
      await buttons.nth(1).click();
      await expect(buttons.nth(1)).toBeFocused();
      await page.keyboard.press('ArrowUp');
      await expect(buttons.nth(0)).toBeFocused();
    });

    test('Home moves focus to the first panel header', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const buttons = d.locator('button.sn-expansion-panel-button');
      await buttons.nth(2).focus();
      await expect(buttons.nth(2)).toBeFocused();
      await page.keyboard.press('Home');
      await expect(buttons.nth(0)).toBeFocused();
    });

    test('End moves focus to the last panel header', async ({ page }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const buttons = d.locator('button.sn-expansion-panel-button');
      await buttons.nth(0).focus();
      await expect(buttons.nth(0)).toBeFocused();
      await page.keyboard.press('End');
      await expect(buttons.nth(2)).toBeFocused();
    });

    test('content region has aria-labelledby pointing to its header button', async ({
      page,
    }) => {
      const d = demo(page, 'Single-open accordion (default)');
      const btn = d.locator('button.sn-expansion-panel-button').first();
      const controls = await btn.getAttribute('aria-controls');
      const headerId = await btn.getAttribute('id');
      const content = d.locator(`#${controls}`);
      const labelledBy = await content.getAttribute('aria-labelledby');
      expect(labelledBy).toBe(headerId);
    });
  });

  test.describe('Multiple-open accordion', () => {
    test('multiple panels can be expanded simultaneously', async ({ page }) => {
      const d = demo(page, 'Multiple-open accordion');
      const buttons = d.locator('button.sn-expansion-panel-button');
      // first two start expanded per the template
      await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'true');
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true');
      // opening the third does not collapse the first two
      await buttons.nth(2).click();
      await expect(buttons.nth(2)).toHaveAttribute('aria-expanded', 'true');
      await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'true');
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true');
    });
  });

  test.describe('With a disabled section', () => {
    test('disabled panel button has the disabled attribute', async ({ page }) => {
      const d = demo(page, 'With a disabled section');
      const buttons = d.locator('button.sn-expansion-panel-button');
      await expect(buttons.nth(1)).toBeDisabled();
    });

    test('clicking the disabled panel does not expand it', async ({ page }) => {
      const d = demo(page, 'With a disabled section');
      const buttons = d.locator('button.sn-expansion-panel-button');
      await buttons.nth(1).click({ force: true });
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test.describe('Standalone panel (no accordion)', () => {
    test('header button has aria-expanded=false initially', async ({ page }) => {
      const d = demo(page, 'Standalone panel (no accordion)');
      await expect(d.locator('button.sn-expansion-panel-button')).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    test('clicking expands the panel', async ({ page }) => {
      const d = demo(page, 'Standalone panel (no accordion)');
      const btn = d.locator('button.sn-expansion-panel-button');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
    });

    test('standalone panel does not affect other panels', async ({ page }) => {
      const d = demo(page, 'Standalone panel (no accordion)');
      const btn = d.locator('button.sn-expansion-panel-button');
      await btn.click();
      await expect(btn).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
