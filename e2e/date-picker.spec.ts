import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('DatePicker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.datePicker);
  });

  test.describe('Basic', () => {
    test('closed trigger shows placeholder text', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-select-trigger');
      await expect(trigger.locator('.sn-select-placeholder')).toBeVisible();
    });

    test('clicking trigger opens panel with role=dialog containing role=grid', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('[role="grid"]')).toBeVisible();
    });

    // The weeks are separate grid containers now, one per role=row, so the
    // columns only line up if each row resolves to the same seven tracks.
    test('weekday headers line up with the day columns', async ({ page }) => {
      const d = demo(page, 'Basic');
      await d.locator('button.sn-select-trigger').click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();

      const header = panel.locator('[role="columnheader"]').first();
      const firstCell = panel.locator('[role="row"]').nth(1).locator('[role="gridcell"]').first();
      const headerBox = (await header.boundingBox())!;
      const cellBox = (await firstCell.boundingBox())!;

      expect(Math.abs(headerBox.x - cellBox.x)).toBeLessThan(1);
      expect(Math.abs(headerBox.width - cellBox.width)).toBeLessThan(1);
    });

    test('clicking a day commits value, closes panel, trigger shows formatted date', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();

      // Wait for focus to land on the initial day (setTimeout 0)
      const focusedDay = panel.locator('button.sn-date-picker-cell[tabindex="0"]');
      await expect(focusedDay).toBeVisible();

      // Click day 15 (always present in any month)
      const day15 = panel.locator('button.sn-date-picker-cell[data-day="15"]');
      await day15.click();

      await expect(panel).not.toBeVisible();
      await expect(trigger.locator('.sn-select-value')).not.toContainText('Select date');
      const valueText = await trigger.locator('.sn-select-value').textContent();
      expect(valueText!.trim().length).toBeGreaterThan(0);
    });

    test('Escape closes panel without committing a value', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      // Wait for focus to settle before pressing Escape
      await expect(panel.locator('button.sn-date-picker-cell[tabindex="0"]')).toBeVisible();

      await page.keyboard.press('Escape');

      await expect(panel).not.toBeVisible();
      await expect(trigger.locator('.sn-select-placeholder')).toBeVisible();
    });

    test('ArrowRight moves focus to the next day', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();

      const firstFocused = panel.locator('button.sn-date-picker-cell[tabindex="0"]');
      await expect(firstFocused).toBeVisible();
      const firstDay = await firstFocused.getAttribute('data-day');
      expect(firstDay).toBeTruthy();

      await page.keyboard.press('ArrowRight');

      // After ArrowRight the focused gridcell moves - wait for focus to change
      // tabindex=0 moves to next day (could cross month boundary, handled by component)
      await expect(panel.locator('button.sn-date-picker-cell[tabindex="0"]')).not.toHaveAttribute(
        'data-day',
        firstDay!,
      );
    });

    test('month header button switches to months view', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();

      const monthBtn = panel.locator('button.sn-date-picker-head-btn').first();
      const monthText = await monthBtn.textContent();
      expect(monthText!.trim().length).toBeGreaterThan(0);

      await monthBtn.click();

      // Months grid should appear
      await expect(panel.locator('.sn-date-picker-grid-months')).toBeVisible();
      // Day grid should be hidden
      await expect(panel.locator('.sn-date-picker-grid-days')).not.toBeVisible();
    });

    test('year header button switches to years view', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();

      // Second head button is the year
      const yearBtn = panel.locator('button.sn-date-picker-head-btn').nth(1);
      await yearBtn.click();

      await expect(panel.locator('.sn-date-picker-grid-years')).toBeVisible();
      await expect(panel.locator('.sn-date-picker-grid-days')).not.toBeVisible();
    });

    test('previous navigation button changes the displayed month label', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();

      const monthBtn = panel.locator('button.sn-date-picker-head-btn').first();
      const beforeText = await monthBtn.textContent();

      const prevBtn = panel.locator('button.sn-date-picker-nav-btn').first();
      await prevBtn.click();

      await expect(monthBtn).not.toHaveText(beforeText!.trim());
    });

    test('next navigation button changes the displayed month label', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();

      const monthBtn = panel.locator('button.sn-date-picker-head-btn').first();
      const beforeText = await monthBtn.textContent();

      const nextBtn = panel.locator('button.sn-date-picker-nav-btn').nth(1);
      await nextBtn.click();

      await expect(monthBtn).not.toHaveText(beforeText!.trim());
    });

    test('clicking a month cell returns to days view', async ({ page }) => {
      const d = demo(page, 'Basic');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();

      const monthBtn = panel.locator('button.sn-date-picker-head-btn').first();
      await monthBtn.click();
      await expect(panel.locator('.sn-date-picker-grid-months')).toBeVisible();

      const firstMonthCell = panel.locator('.sn-date-picker-grid-months button.sn-date-picker-cell').first();
      await firstMonthCell.click();

      await expect(panel.locator('.sn-date-picker-grid-days')).toBeVisible();
    });
  });

  // The demo range is a week either side of today, so the boundary always falls
  // inside the visible month and the month it lands in is never fixed.
  test.describe('Minimum and maximum date', () => {
    const openRange = async (page: import('@playwright/test').Page) => {
      const d = demo(page, 'Minimum and maximum date');
      await d.locator('button.sn-select-trigger').click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('button.sn-date-picker-cell[tabindex="0"]')).toBeFocused();
      return panel;
    };

    // Playwright reads aria-disabled as disabled for actionability, which is the
    // point of setting it. What has to stay true is that the button is not
    // NATIVELY disabled, because that is what would take it out of the grid.
    test('a day outside the range reads as unavailable and can still take focus', async ({
      page,
    }) => {
      const panel = await openRange(page);
      const blocked = panel.locator('button.sn-date-picker-cell[aria-disabled="true"]').first();

      await expect(blocked).toHaveClass(/sn-date-picker-cell-disabled/);
      expect(await blocked.evaluate((el: HTMLButtonElement) => el.disabled)).toBe(false);

      await blocked.focus();
      await expect(blocked).toBeFocused();
    });

    test('clicking a day outside the range leaves the panel open and the value unset', async ({
      page,
    }) => {
      const d = demo(page, 'Minimum and maximum date');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      await expect(panel.locator('button.sn-date-picker-cell[tabindex="0"]')).toBeVisible();

      // force, because the browser really would deliver this click: the button
      // is not natively disabled. Refusing it is the component's job.
      await panel
        .locator('button.sn-date-picker-cell[aria-disabled="true"]')
        .first()
        .click({ force: true });

      await expect(panel).toBeVisible();
      await expect(trigger.locator('.sn-select-placeholder')).toBeVisible();
    });

    test('an arrow key can still reach a day outside the range', async ({ page }) => {
      const panel = await openRange(page);
      const focusedCell = panel.locator('button.sn-date-picker-cell[tabindex="0"]');
      const focusedLabel = () => focusedCell.getAttribute('aria-label');

      // The component moves focus from a setTimeout, so there is a window where
      // the active element is not a cell yet and a keypress goes nowhere. Each
      // step waits for focus to land before pressing and for the move after it.
      let current = (await focusedLabel())!;
      const start = new Date(current);
      for (let i = 0; i < 8; i++) {
        const before = current;
        await expect(focusedCell).toBeFocused();
        await page.keyboard.press('ArrowLeft');
        await expect.poll(focusedLabel, { timeout: 10_000 }).not.toBe(before);
        current = (await focusedLabel())!;
      }

      expect(new Date(current).getTime()).toBeLessThan(start.getTime());
      await expect(focusedCell).toHaveAttribute('aria-disabled', 'true');
    });

    test('a day inside the range still commits', async ({ page }) => {
      const d = demo(page, 'Minimum and maximum date');
      const trigger = d.locator('button.sn-select-trigger');
      await trigger.click();
      const panel = page.locator('.cdk-overlay-container [role="dialog"]');
      const focused = panel.locator('button.sn-date-picker-cell[tabindex="0"]');
      await expect(focused).toBeVisible();

      await focused.click();

      await expect(panel).toHaveCount(0);
      await expect(trigger.locator('.sn-select-placeholder')).toHaveCount(0);
    });
  });
});
