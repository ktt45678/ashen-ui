import { test, expect } from '@playwright/test';
import { ROUTES } from './support/pages';

/**
 * The unit specs dispatch a synthetic `error` event and assert layout classes.
 * Neither proves what actually breaks in a browser: that a real failed image
 * reaches the handler, and that the stack overlaps.
 */
test.describe('avatar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.avatar);
  });

  test('an image the browser cannot load falls back to the initials', async ({ page }) => {
    const demo = page.locator('doc-example', { hasText: 'Broken image' });
    const avatar = demo.locator('sn-avatar').first();

    await expect(avatar.locator('.sn-avatar-initials')).toHaveText('AL');
    await expect(avatar.locator('img')).toHaveCount(0);
  });

  test('an avatar with nothing left to fall back to shows the icon', async ({ page }) => {
    const demo = page.locator('doc-example', { hasText: 'Broken image' });
    const avatar = demo.locator('sn-avatar').nth(1);

    await expect(avatar.locator('.sn-avatar-icon')).toHaveText('person');
  });

  test('group avatars overlap and the counter comes last', async ({ page }) => {
    const group = page.locator('sn-avatar-group').first();
    const visible = group.locator('sn-avatar:not(.sn-avatar--overflowed)');
    await expect(visible).toHaveCount(3);

    const first = (await visible.nth(0).boundingBox())!;
    const second = (await visible.nth(1).boundingBox())!;
    expect(second.x).toBeLessThan(first.x + first.width);
    expect(second.x).toBeGreaterThan(first.x);

    const counter = group.locator('.sn-avatar-counter');
    await expect(counter).toHaveText('+1');
    expect((await counter.boundingBox())!.x).toBeGreaterThan(second.x);
  });

  test('overflowed avatars take no space', async ({ page }) => {
    const group = page.locator('sn-avatar-group').first();

    await expect(group.locator('.sn-avatar--overflowed')).toHaveCount(1);
    await expect(group.locator('.sn-avatar--overflowed')).toBeHidden();
  });

  test('the counter follows the group as members come and go', async ({ page }) => {
    const demo = page.locator('doc-example', { hasText: 'Group (interactive)' });
    const group = demo.locator('sn-avatar-group');

    await expect(group.locator('.sn-avatar-counter')).toHaveText('+2');

    await demo.getByRole('button', { name: 'Add' }).click();
    await expect(group.locator('.sn-avatar-counter')).toHaveText('+3');

    for (let i = 0; i < 3; i++) await demo.getByRole('button', { name: 'Remove' }).click();
    await expect(group.locator('.sn-avatar-counter')).toHaveCount(0);
    await expect(group.locator('sn-avatar')).toHaveCount(3);
  });

  test('a group avatar gets a ring, a standalone one does not', async ({ page }) => {
    const ring = (locator: ReturnType<typeof page.locator>) =>
      locator.evaluate((el) => getComputedStyle(el).boxShadow);

    const standalone = page.locator('doc-example', { hasText: 'The fallback chain' })
      .locator('sn-avatar')
      .first();
    const stacked = page.locator('sn-avatar-group').first().locator('sn-avatar').first();

    // A ring of 0px still computes to a box-shadow, so compare the widths.
    expect(await ring(standalone)).toContain('0px 0px 0px 0px');
    expect(await ring(stacked)).toContain('0px 0px 0px 2px');
  });

  test('the size on a group reaches its avatars, and an avatar overrides it', async ({ page }) => {
    const group = page.locator('doc-example', { hasText: 'Group size and shape' })
      .locator('sn-avatar-group');
    const avatars = group.locator('sn-avatar');

    await expect(avatars.nth(0)).toHaveAttribute('data-sn-size', 'lg');
    await expect(avatars.nth(0)).toHaveAttribute('data-sn-shape', 'square');
    await expect(avatars.nth(2)).toHaveAttribute('data-sn-size', 'sm');

    const big = (await avatars.nth(0).boundingBox())!;
    const small = (await avatars.nth(2).boundingBox())!;
    expect(big.width).toBeGreaterThan(small.width);
  });
});
