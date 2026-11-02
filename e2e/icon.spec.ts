import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.icon);
  });

  test('renders the icon glyph element with sn-icon class', async ({ page }) => {
    const demoArea = demo(page, 'Default (md, outline)');
    const icon = demoArea.locator('sn-icon').first();
    await expect(icon).toHaveClass(/\bsn-icon\b/);
    await expect(icon).toHaveClass(/\bicon-ms\b/);
  });

  test('size="sm" applies sn-size-sm class and smaller font-size', async ({ page }) => {
    const demoArea = demo(page, 'Sizes');
    const smIcon = demoArea.locator('sn-icon').filter({ has: page.locator('text="star"').first() }).first();
    await expect(smIcon).toHaveClass(/\bsn-size-sm\b/);

    const smSize = await smIcon.evaluate((el) => getComputedStyle(el).fontSize);
    const mdSize = await demoArea.locator('sn-icon').nth(1).evaluate((el) => getComputedStyle(el).fontSize);
    const lgSize = await demoArea.locator('sn-icon').nth(2).evaluate((el) => getComputedStyle(el).fontSize);

    // Verify size progression: sm < md < lg
    expect(parseFloat(smSize)).toBeLessThan(parseFloat(mdSize));
    expect(parseFloat(mdSize)).toBeLessThan(parseFloat(lgSize));
  });

  test('size="lg" applies sn-size-lg class and larger font-size', async ({ page }) => {
    const demoArea = demo(page, 'Sizes');
    const lgIcon = demoArea.locator('sn-icon').nth(2);
    await expect(lgIcon).toHaveClass(/\bsn-size-lg\b/);
  });

  test('fill=true applies sn-filled class', async ({ page }) => {
    const demoArea = demo(page, 'Filled (FILL axis = 1)');
    const filledIcon = demoArea.locator('sn-icon').first();
    await expect(filledIcon).toHaveClass(/\bsn-filled\b/);
  });

  test('decorative icon has aria-hidden="true"', async ({ page }) => {
    const demoArea = demo(page, 'Default (md, outline)');
    const icon = demoArea.locator('sn-icon').first();
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('accessible icon with ariaLabel has role="img" and aria-label', async ({ page }) => {
    const demoArea = demo(page, 'Accessible (labeled icon)');
    const icon = demoArea.locator('sn-icon');
    await expect(icon).toHaveAttribute('role', 'img');
    await expect(icon).toHaveAttribute('aria-label', 'Settings');
    await expect(icon).not.toHaveAttribute('aria-hidden', 'true');
  });

  test('weight input adjusts font-weight', async ({ page }) => {
    const demoArea = demo(page, 'Weight axis');
    const weights = [300, 400, 500, 600];
    const icons = demoArea.locator('sn-icon');

    for (let i = 0; i < weights.length; i++) {
      const icon = icons.nth(i);
      const cssVar = await icon.evaluate((el) => getComputedStyle(el).getPropertyValue('--sn-icon-weight'));
      expect(cssVar.trim()).toBe(weights[i].toString());
    }
  });

  test('icon grid renders multiple icons', async ({ page }) => {
    const demoArea = demo(page, 'Icon grid');
    const icons = demoArea.locator('sn-icon');

    // Gate with retrying assertion to ensure icons have rendered before reading count
    await expect(icons).toHaveCount(12); // Icon grid has 12 icons

    const count = await icons.count();
    expect(count).toBeGreaterThan(1);
  });

  // A resolved glyph paints; an unresolved one leaves an empty box. Only a real
  // browser can tell those apart, which is the whole point of the set feature.
  test('a ligature set draws a name that was never safelisted', async ({ page }) => {
    const demoArea = demo(page, 'Ligature set (a name chosen at runtime)');
    const icon = demoArea.locator('sn-icon[set="ms"]');

    await expect(icon).toHaveText('rocket_launch');
    const before = (await icon.boundingBox())!;
    expect(before.width).toBeGreaterThan(0);

    await demoArea.getByRole('button', { name: 'travel_explore' }).click();
    await expect(icon).toHaveText('travel_explore');
    // The class-mode default would render an empty box for either name.
    expect((await icon.boundingBox())!.width).toBeGreaterThan(0);
  });

  test('a sprite set resolves through use[href]', async ({ page }) => {
    const demoArea = demo(page, 'Sprite set');
    const icons = demoArea.locator('sn-icon[set="demo"]');
    await expect(icons).toHaveCount(3);

    const use = icons.first().locator('svg.sn-icon-svg use');
    await expect(use).toHaveAttribute('href', 'icons/demo-sprite.svg#spark');

    // A sprite that failed to load leaves a zero-area <use>.
    const box = await use.boundingBox();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
  });

  test('a sprite glyph takes its colour and size from the icon', async ({ page }) => {
    const icon = demo(page, 'Sprite set').locator('sn-icon[set="demo"]').first();

    const [fill, svgSize, iconFontSize] = await icon.evaluate((el) => {
      const svg = el.querySelector('svg')!;
      return [
        getComputedStyle(svg).fill,
        getComputedStyle(svg).width,
        getComputedStyle(el).fontSize,
      ];
    });
    expect(fill).toBe(await icon.evaluate((el) => getComputedStyle(el).color));
    expect(parseFloat(svgSize)).toBeCloseTo(parseFloat(iconFontSize), 0);
  });
});
