import { expect, test } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

/**
 * `data-sn-*` state attributes.
 *
 * The point of these is that an app can style any component state from Tailwind
 * with no library API involved, so what matters is that the attribute is
 * actually ON the host at the right moment, not merely that a signal flipped.
 */
test.describe('data-sn-* state attributes', () => {
  test('button exposes its enumerations as values, not one boolean each', async ({ page }) => {
    await page.goto(ROUTES.button);
    const btn = page.locator('button.sn-button').first();

    // Enumerations carry a value so an app writes data-[sn-size=sm]:… once,
    // instead of the library shipping a boolean attribute per member.
    await expect(btn).toHaveAttribute('data-sn-size', /^(sm|md|lg)$/);
    await expect(btn).toHaveAttribute('data-sn-variant', /\S/);
    await expect(btn).toHaveAttribute('data-sn-color', /\S/);
  });

  test('select reflects open state on the host and clears it on close', async ({ page }) => {
    await page.goto(ROUTES.select);
    const host = page.locator('sn-select').first();

    await expect(host).not.toHaveAttribute('data-sn-open', /.*/);

    await host.locator('.sn-select-trigger').click();
    await page.locator('.sn-select-panel').first().waitFor({ state: 'visible' });
    await expect(host).toHaveAttribute('data-sn-open', '');

    await page.keyboard.press('Escape');
    await page.locator('.sn-select-panel').first().waitFor({ state: 'detached' });
    await expect(host).not.toHaveAttribute('data-sn-open', /.*/);
  });

  test('boolean states are absent rather than "false" when off', async ({ page }) => {
    // data-[sn-open]:… matches on presence, so an "off" state MUST remove the
    // attribute. Emitting data-sn-open="false" would match the variant and
    // silently invert every rule written against it.
    await page.goto(ROUTES.select);
    const host = page.locator('sn-select').first();
    expect(await host.getAttribute('data-sn-open')).toBeNull();
  });

  test('form-field reflects focus and validity', async ({ page }) => {
    await page.goto(ROUTES.formField);
    const field = demo(page, 'Error state (manual)').locator('sn-form-field');
    await expect(field).toHaveAttribute('data-sn-invalid', '');

    const basic = demo(page, 'Basic').locator('sn-form-field');
    await expect(basic).not.toHaveAttribute('data-sn-focused', /.*/);
    await basic.locator('input').focus();
    await expect(basic).toHaveAttribute('data-sn-focused', '');
  });

  test('dialog reflects open state while it is on screen', async ({ page }) => {
    await page.goto(ROUTES.dialog);
    await demo(page, 'Basic').getByRole('button').first().click();

    const dialog = page.locator('sn-dialog').first();
    await expect(dialog).toHaveAttribute('data-sn-open', '');

    await page.keyboard.press('Escape');
    await page.locator('.sn-dialog-panel').first().waitFor({ state: 'detached' });
    await expect(dialog).not.toHaveAttribute('data-sn-open', /.*/);
  });

  test('the sn-open Tailwind variant compiles to a working rule', async ({ page }) => {
    await page.goto(ROUTES.select);

    // Proves the @custom-variant set in styles/tailwind.css is wired up, not
    // just that the attribute exists. The showcase compiles the library's
    // Tailwind entry, so a variant that failed to register would produce no
    // rule at all and the assertion below would read the unstyled value.
    const applies = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.setAttribute('data-sn-open', '');
      probe.className = 'sn-open:opacity-50';
      document.body.appendChild(probe);
      const opacity = getComputedStyle(probe).opacity;
      probe.remove();
      return opacity;
    });
    expect(applies).toBe('0.5');
  });
});
