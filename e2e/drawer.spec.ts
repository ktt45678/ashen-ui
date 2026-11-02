import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Drawer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.drawer);
  });

  test.describe('Basic (right, default)', () => {
    test('clicking Open Drawer shows role=dialog panel', async ({ page }) => {
      const d = demo(page, 'Basic (right, default)');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
    });

    test('drawer panel has aria-modal=true', async ({ page }) => {
      const d = demo(page, 'Basic (right, default)');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(panel).toHaveAttribute('aria-modal', 'true');
    });

    test('right drawer touches the right viewport edge', async ({ page }) => {
      const d = demo(page, 'Basic (right, default)');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();

      const vpWidth = page.viewportSize()!.width;
      await expect
        .poll(async () => {
          const box = await panel.boundingBox();
          return box ? box.x + box.width : Number.NaN;
        })
        .toBeCloseTo(vpWidth, -1);
    });

    test('focus moves into the drawer on open', async ({ page }) => {
      const d = demo(page, 'Basic (right, default)');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('.sn-drawer-close-button')).toBeFocused();
    });

    test('close button closes the drawer', async ({ page }) => {
      const d = demo(page, 'Basic (right, default)');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await panel.locator('.sn-drawer-close-button').click();
      await expect(panel).not.toBeVisible();
    });

    test('Escape closes the drawer', async ({ page }) => {
      const d = demo(page, 'Basic (right, default)');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('.sn-drawer-close-button')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
    });

    test('focus returns to opener after Escape', async ({ page }) => {
      const d = demo(page, 'Basic (right, default)');
      const opener = d.locator('button').filter({ hasText: 'Open Drawer' });
      await opener.click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(panel.locator('.sn-drawer-close-button')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
      await expect(opener).toBeFocused();
    });

    test('backdrop click closes the drawer', async ({ page }) => {
      const d = demo(page, 'Basic (right, default)');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await d.locator('.sn-drawer-mask').click({ force: true });
      await expect(panel).not.toBeVisible();
    });
  });

  test.describe('Left position', () => {
    test('left drawer panel has --left position class', async ({ page }) => {
      const d = demo(page, 'Left position');
      await d.locator('button').filter({ hasText: 'Open Left Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(panel).toHaveClass(/sn-drawer-panel--left/);
    });

    test('left drawer touches the left viewport edge', async ({ page }) => {
      const d = demo(page, 'Left position');
      await d.locator('button').filter({ hasText: 'Open Left Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();

      await expect
        .poll(async () => (await panel.boundingBox())?.x ?? Number.NaN)
        .toBeCloseTo(0, -1);
    });

    test('Escape closes the left drawer', async ({ page }) => {
      const d = demo(page, 'Left position');
      await d.locator('button').filter({ hasText: 'Open Left Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
    });
  });

  test.describe('With footer actions', () => {
    test('Tab cycles focus within the drawer (focus trap)', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();

      await expect(panel.locator('.sn-drawer-close-button')).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(panel.locator('button').filter({ hasText: 'Cancel' })).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(panel.locator('button').filter({ hasText: 'Save' })).toBeFocused();

      // Tab past last focusable must stay inside (focus trap)
      await page.keyboard.press('Tab');
      const focusInsideDrawer = await page.evaluate(() => {
        const dlg = document.querySelector('.sn-drawer-panel');
        return dlg?.contains(document.activeElement) ?? false;
      });
      expect(focusInsideDrawer).toBe(true);
    });

    test('Cancel button closes the drawer', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await panel.locator('button').filter({ hasText: 'Cancel' }).click();
      await expect(panel).not.toBeVisible();
    });

    test('Save button closes the drawer', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await panel.locator('button').filter({ hasText: 'Save' }).click();
      await expect(panel).not.toBeVisible();
    });

    test('focus returns to opener after close button', async ({ page }) => {
      const d = demo(page, 'With footer actions');
      const opener = d.locator('button').filter({ hasText: 'Open Drawer' });
      await opener.click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await panel.locator('.sn-drawer-close-button').click();
      await expect(panel).not.toBeVisible();
      await expect(opener).toBeFocused();
    });
  });

  test.describe('Without mask (no backdrop dim)', () => {
    test('drawer opens without a visible backdrop', async ({ page }) => {
      const d = demo(page, 'Without mask (no backdrop dim)');
      await d.locator('button').filter({ hasText: 'Open Without Mask' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await expect(d.locator('.sn-drawer-mask')).not.toBeVisible();
    });

    test('Escape still closes the drawer when mask=false', async ({ page }) => {
      const d = demo(page, 'Without mask (no backdrop dim)');
      await d.locator('button').filter({ hasText: 'Open Without Mask' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
    });
  });

  test.describe('Top position', () => {
    test('top drawer touches the top viewport edge', async ({ page }) => {
      const d = demo(page, 'Top position');
      await d.locator('button').filter({ hasText: 'Open Top Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();

      await expect
        .poll(async () => (await panel.boundingBox())?.y ?? Number.NaN)
        .toBeCloseTo(0, -1);
    });

    test('Escape closes the top drawer', async ({ page }) => {
      const d = demo(page, 'Top position');
      await d.locator('button').filter({ hasText: 'Open Top Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
    });
  });

  test.describe('Bottom position', () => {
    test('bottom drawer touches the bottom viewport edge', async ({ page }) => {
      const d = demo(page, 'Bottom position');
      await d.locator('button').filter({ hasText: 'Open Bottom Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();

      const vpHeight = page.viewportSize()!.height;
      await expect
        .poll(async () => {
          const box = await panel.boundingBox();
          return box ? box.y + box.height : Number.NaN;
        })
        .toBeCloseTo(vpHeight, -1);
    });

    test('Escape closes the bottom drawer', async ({ page }) => {
      const d = demo(page, 'Bottom position');
      await d.locator('button').filter({ hasText: 'Open Bottom Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(panel).not.toBeVisible();
    });
  });

  test.describe('Directive close - snDrawerClose', () => {
    test('snDrawerClose Save button closes the drawer', async ({ page }) => {
      const d = demo(page, 'Directive close - snDrawerClose');
      await d.locator('button').filter({ hasText: 'Open Drawer' }).click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await panel.locator('button').filter({ hasText: 'Save' }).click();
      await expect(panel).not.toBeVisible();
    });

    test('focus returns to opener after snDrawerClose', async ({ page }) => {
      const d = demo(page, 'Directive close - snDrawerClose');
      const opener = d.locator('button').filter({ hasText: 'Open Drawer' });
      await opener.click();
      const panel = d.locator('[role="dialog"]');
      await expect(panel).toBeVisible();
      await panel.locator('button').filter({ hasText: 'Cancel' }).click();
      await expect(panel).not.toBeVisible();
      await expect(opener).toBeFocused();
    });
  });
});
