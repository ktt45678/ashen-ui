import { test, expect } from '@playwright/test';
import { ROUTES, demo, describedbyIds } from './support/pages';

test.describe('FormField', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.formField);
  });

  test('Basic: label for attribute equals input id', async ({ page }) => {
    const demoSection = demo(page, 'Basic');
    const label = demoSection.locator('label');
    const input = demoSection.locator('input');

    const labelFor = await label.getAttribute('for');
    const inputId = await input.getAttribute('id');

    expect(labelFor).toBeTruthy();
    expect(inputId).toBeTruthy();
    expect(labelFor).toBe(inputId);
  });

  test('Basic: required label shows * indicator with aria-hidden', async ({ page }) => {
    const demoSection = demo(page, 'Basic');
    const label = demoSection.locator('label');
    const requiredIndicator = label.locator('.sn-form-field-required-indicator');

    await expect(requiredIndicator).toBeVisible();
    const ariaHidden = await requiredIndicator.getAttribute('aria-hidden');
    expect(ariaHidden).toBe('true');
    await expect(requiredIndicator).toContainText('*');
  });

  test('Basic: input has aria-required when label is required', async ({ page }) => {
    const demoSection = demo(page, 'Basic');
    const input = demoSection.locator('input');

    const ariaRequired = await input.getAttribute('aria-required');
    expect(ariaRequired).toBe('true');
  });

  test('With hint: hint id appears in input aria-describedby', async ({ page }) => {
    const demoSection = demo(page, 'With hint');
    const input = demoSection.locator('input');
    const hint = demoSection.locator('.sn-form-field-hint');

    await expect(hint).toBeVisible();
    // Gate aria-describedby read with retrying assertion to ensure registration has flushed
    await expect(input).toHaveAttribute('aria-describedby', /\S/);

    const hintId = await hint.getAttribute('id');
    const describedByIds = await describedbyIds(input);

    expect(hintId).toBeTruthy();
    expect(describedByIds).toContain(hintId);
  });

  test('With hint: hint text is visible', async ({ page }) => {
    const demoSection = demo(page, 'With hint');
    const hint = demoSection.locator('.sn-form-field-hint');

    await expect(hint).toContainText('Shown under the tile icon');
  });

  test('Error state: wrapper has sn-form-field-invalid class', async ({ page }) => {
    const demoSection = demo(page, 'Error state (manual)');
    const wrapper = demoSection.locator('sn-form-field');

    await expect(wrapper).toHaveClass(/\bsn-form-field-invalid\b/);
  });

  test('Error state: input has aria-invalid true', async ({ page }) => {
    const demoSection = demo(page, 'Error state (manual)');
    const input = demoSection.locator('input');

    await expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('Error state: error element has role alert', async ({ page }) => {
    const demoSection = demo(page, 'Error state (manual)');
    const error = demoSection.locator('.sn-form-field-error');

    await expect(error).toHaveAttribute('role', 'alert');
  });

  test('Error state: error id is in input aria-describedby', async ({ page }) => {
    const demoSection = demo(page, 'Error state (manual)');
    const input = demoSection.locator('input');
    const error = demoSection.locator('.sn-form-field-error');

    // Gate aria-describedby read with retrying assertion to ensure registration has flushed
    await expect(input).toHaveAttribute('aria-describedby', /\S/);

    const errorId = await error.getAttribute('id');
    const describedByIds = await describedbyIds(input);

    expect(errorId).toBeTruthy();
    expect(describedByIds).toContain(errorId);
  });

  test('Multiple errors: both error ids in aria-describedby', async ({ page }) => {
    const demoSection = demo(page, 'Multiple errors');
    const input = demoSection.locator('input');
    const errors = demoSection.locator('.sn-form-field-error');

    // Gate with retrying assertion to ensure both errors have rendered
    await expect(errors).toHaveCount(2);
    // Also ensure aria-describedby has flushed before reading it
    await expect(input).toHaveAttribute('aria-describedby', /\S+\s+\S+/);

    const errorIds = await errors.all().then(els =>
      Promise.all(els.map(el => el.getAttribute('id')))
    );

    expect(errorIds).toHaveLength(2);
    expect(errorIds[0]).toBeTruthy();
    expect(errorIds[1]).toBeTruthy();

    const describedByIds = await describedbyIds(input);
    expect(describedByIds).toContain(errorIds[0]);
    expect(describedByIds).toContain(errorIds[1]);
  });

  test('Multiple errors: both error messages visible', async ({ page }) => {
    const demoSection = demo(page, 'Multiple errors');
    const errors = demoSection.locator('.sn-form-field-error');

    // Gate with retrying assertion to ensure both errors have rendered before reading
    await expect(errors).toHaveCount(2);

    const errorElements = await errors.all();
    expect(errorElements).toHaveLength(2);

    await expect(errorElements[0]).toBeVisible();
    await expect(errorElements[0]).toContainText('File is too large (max 10 MB)');

    await expect(errorElements[1]).toBeVisible();
    await expect(errorElements[1]).toContainText('Unsupported file type');
  });

  test('Interactive validation: no error visible initially', async ({ page }) => {
    const demoSection = demo(page, 'Automatic error display (default)');
    const input = demoSection.locator('input');
    const error = demoSection.locator('.sn-form-field-error');

    // Focus and type something
    await input.fill('somevalue');
    await expect(error).not.toBeVisible();
  });

  test('Interactive validation: error appears on blur when empty', async ({ page }) => {
    const demoSection = demo(page, 'Automatic error display (default)');
    const input = demoSection.locator('input');
    const error = demoSection.locator('.sn-form-field-error');

    // Type and then clear
    await input.fill('somevalue');
    await input.clear();
    // Blur by pressing Tab
    await input.press('Tab');

    await expect(error).toBeVisible();
    // Gate aria-describedby read with retrying assertion to ensure registration has flushed
    await expect(input).toHaveAttribute('aria-describedby', /\S/);

    const errorId = await error.getAttribute('id');
    const describedByIds = await describedbyIds(input);
    expect(describedByIds).toContain(errorId);
  });

  test('Interactive validation: error disappears when value entered again', async ({ page }) => {
    const demoSection = demo(page, 'Automatic error display (default)');
    const input = demoSection.locator('input');
    const error = demoSection.locator('.sn-form-field-error');

    // Clear and blur to show error
    await input.clear();
    await input.press('Tab');
    await expect(error).toBeVisible();

    // Capture the error id while the error is still visible
    const errorId = await error.getAttribute('id');

    // Re-focus and type
    await input.focus();
    await input.fill('newvalue');

    // Error should disappear
    await expect(error).not.toBeVisible();
    // After error disappears, aria-describedby may be updated; wait for its removal
    // by asserting it doesn't contain the error id anymore
    const describedByIds = await describedbyIds(input);
    expect(describedByIds).not.toContain(errorId);
  });

  test('No label (control only): no label element', async ({ page }) => {
    const demoSection = demo(page, 'No label (control only)');
    const label = demoSection.locator('label');

    await expect(label).not.toBeVisible();
  });

  test('No label (control only): hint id is still in aria-describedby', async ({ page }) => {
    const demoSection = demo(page, 'No label (control only)');
    const input = demoSection.locator('input');
    const hint = demoSection.locator('.sn-form-field-hint');

    // Gate aria-describedby read with retrying assertion to ensure registration has flushed
    await expect(input).toHaveAttribute('aria-describedby', /\S/);

    const hintId = await hint.getAttribute('id');
    const describedByIds = await describedbyIds(input);

    expect(hintId).toBeTruthy();
    expect(describedByIds).toContain(hintId);
  });

  test('Focus: wrapper gains sn-form-field-focused when input focused', async ({ page }) => {
    const demoSection = demo(page, 'Basic');
    const wrapper = demoSection.locator('sn-form-field');
    const input = demoSection.locator('input');

    await input.focus();
    await expect(wrapper).toHaveClass(/\bsn-form-field-focused\b/);
  });

  test('Focus: wrapper loses sn-form-field-focused when input blurred', async ({ page }) => {
    const demoSection = demo(page, 'Basic');
    const wrapper = demoSection.locator('sn-form-field');
    const input = demoSection.locator('input');

    // Focus first
    await input.focus();
    await expect(wrapper).toHaveClass(/\bsn-form-field-focused\b/);

    // Then blur
    await input.blur();
    await expect(wrapper).not.toHaveClass(/\bsn-form-field-focused\b/);
  });

  // ── Notched outline paint order ───────────────────────────────────────────

  /**
   * With `floatLabel`, the control's own border is transparent and
   * `.sn-form-field-outline` draws the field's border instead. That only works
   * while the outline paints ABOVE the control, and the control has an opaque
   * background, so anything that lifts it up the stacking order erases the
   * border completely. Geometry assertions cannot see this: every box stays
   * exactly where it belongs, and the field just loses its outline.
   */
  test('Floating: the outline paints above the control, not under it', async ({ page }) => {
    const field = demo(page, 'Floating label').locator('sn-form-field').first();
    await field.scrollIntoViewIfNeeded();

    const painted = await field.evaluate((el: HTMLElement) => {
      const ctrl = el.querySelector('.sn-form-field-control') as HTMLElement;
      const r = ctrl.getBoundingClientRect();
      // elementFromPoint skips pointer-events:none, which the outline sets, so
      // enable them for the probe. Hit order then follows paint order.
      el.querySelectorAll<HTMLElement>('.sn-form-field-outline, .sn-form-field-outline *').forEach(
        (n) => (n.style.pointerEvents = 'auto'),
      );
      const at = (x: number, y: number) =>
        (document.elementFromPoint(x, y) as HTMLElement | null)?.className ?? '';
      return {
        top: at(r.left + r.width / 2, r.top + 0.5),
        bottom: at(r.left + r.width / 2, r.bottom - 0.5),
        left: at(r.left + 0.5, r.top + r.height / 2),
      };
    });

    expect(painted.top).toContain('sn-form-field-outline');
    expect(painted.bottom).toContain('sn-form-field-outline');
    expect(painted.left).toContain('sn-form-field-outline');
  });

  // ── Affixes (snPrefix / snSuffix) ─────────────────────────────────────────
  // These assert real layout. Every structural claim about affixes is a CSS
  // claim, and jsdom resolves none of it, so the unit specs can only prove the
  // markup exists. This proves it lands where it should.

  test('Affix: prefix icon sits inside the control, and the text clears it', async ({ page }) => {
    const field = demo(page, 'Prefix and suffix').locator('sn-form-field').first();
    const input = field.locator('input');
    const affix = field.locator('.sn-form-field-affix--prefix');

    await expect(affix).toBeVisible();
    // Room reserved is measured from the slot: 12px padding + a 24px icon +
    // 12px padding. Not the 2.5rem minimum, which the content exceeds.
    expect(await input.evaluate((el) => getComputedStyle(el).paddingInlineStart)).toBe('48px');

    // The affix overlays the control rather than displacing it.
    const inputBox = (await input.boundingBox())!;
    const affixBox = (await affix.boundingBox())!;
    expect(affixBox.x).toBeGreaterThanOrEqual(inputBox.x - 1);
    expect(affixBox.x + affixBox.width).toBeLessThanOrEqual(inputBox.x + inputBox.width + 1);
  });

  test('Affix: clicking a decorative prefix focuses the input underneath', async ({ page }) => {
    const field = demo(page, 'Prefix and suffix').locator('sn-form-field').first();
    const affix = field.locator('.sn-form-field-affix--prefix');
    const box = (await affix.boundingBox())!;

    // Deliberately a raw mouse click at the affix's own coordinates rather than
    // locator.click(): Playwright's actionability check refuses to click an
    // element with pointer-events:none, which is exactly the property under
    // test. A real user's click at these coordinates must reach the input.
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(field.locator('input')).toBeFocused();
  });

  test('Affix: an interactive suffix still receives its own clicks', async ({ page }) => {
    const field = demo(page, 'Prefix and suffix').locator('sn-form-field').nth(1);
    await expect(field.locator('.sn-form-field-affix--suffix')).toBeVisible();
    expect(
      await field.locator('input').evaluate((el) => getComputedStyle(el).paddingInlineEnd),
    ).toBe('48px');
  });

  test('Affix: a field without one keeps its original padding', async ({ page }) => {
    const input = demo(page, 'Basic').locator('input');
    // The zero-regression guard, measured rather than asserted on a class.
    const [start, end] = await input.evaluate((el) => {
      const s = getComputedStyle(el);
      return [s.paddingInlineStart, s.paddingInlineEnd];
    });
    expect(start).toBe(end);
    expect(start).not.toBe('40px');
  });

  test('Your own ids: the label follows an authored control id', async ({ page }) => {
    const field = demo(page, 'Your own ids').locator('sn-form-field');
    await expect(field.locator('input')).toHaveAttribute('id', 'signup-email');
    await expect(field.locator('label')).toHaveAttribute('for', 'signup-email');
    await expect(page.locator('#signup-email')).toHaveCount(1);
  });

  test('Your own ids: an authored aria-describedby keeps the field ids', async ({ page }) => {
    const field = demo(page, 'Your own ids').locator('sn-form-field');
    const ids = await describedbyIds(field.locator('input'));
    expect(ids).toEqual(['signup-legend', 'signup-email-hint']);
    await expect(field.locator('.sn-form-field-hint')).toHaveAttribute('id', 'signup-email-hint');
  });

  test('Floating label - invalid: the resting label is already invalid', async ({ page }) => {
    const field = demo(page, 'Floating label - invalid').locator('sn-form-field');
    const label = field.locator('label');
    const invalid = await field.evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--sn-color-invalid').trim(),
    );

    // Not floated yet, so this is the state that used to fall back to the
    // placeholder color and gave no sign the field was invalid.
    await expect(field).not.toHaveClass(/sn-form-field-should-float/);
    await expect(label).toHaveCSS('color', invalid);

    await field.locator('input').click();
    await expect(field).toHaveClass(/sn-form-field-should-float/);
    // Invalid outranks focus: the label does not turn blue on the way up.
    await expect(label).toHaveCSS('color', invalid);
  });

  test('Affix: a text prefix is measured, not configured', async ({ page }) => {
    const field = demo(page, 'Prefix and suffix').locator('sn-form-field').nth(3);
    const pad = await field
      .locator('input')
      .evaluate((el) => parseFloat(getComputedStyle(el).paddingInlineStart));

    // "USD" is wider than an icon and wider than the 40px minimum, and nobody
    // told the field so. This is the case Material needs matTextPrefix for.
    expect(pad).toBeGreaterThan(48);
    const slot = (await field.locator('.sn-form-field-affix--prefix').boundingBox())!.width;
    expect(pad).toBeCloseTo(slot, 0);
  });

  test('Affix: --sn-form-field-affix-width sets a minimum gutter', async ({ page }) => {
    const field = demo(page, 'Prefix and suffix').locator('sn-form-field').nth(4);
    // Read the gutter the demo asks for rather than restating it: the expected
    // number went stale last time the demo was retuned.
    const { requested, measured, padding } = await field.evaluate((el) => ({
      requested: getComputedStyle(el).getPropertyValue('--sn-form-field-affix-width').trim(),
      measured: parseFloat(getComputedStyle(el).getPropertyValue('--sn-form-field-prefix-width')),
      padding: parseFloat(getComputedStyle(el.querySelector('input')!).paddingInlineStart),
    }));
    const minimum = parseFloat(requested) * 16;

    // The affix is narrower than the gutter, so the minimum is what shows: a
    // column of fields with mixed affixes still lines up.
    expect(measured).toBeLessThan(minimum);
    expect(padding).toBeCloseTo(minimum, 0);
  });

  test('Affix: the prefix offset rides the transform, so the float animates', async ({ page }) => {
    const field = demo(page, 'Prefix and suffix').locator('sn-form-field').nth(2);
    const label = field.locator('.sn-form-field-label');
    const input = field.locator('input');

    // Deterministic half: while resting with a prefix, the horizontal offset
    // must live in the transform matrix (e = translateX), not in a positional
    // property. `transform` is transitioned; `inset-inline-start` is not, so an
    // offset held there snaps the label left under the prefix icon the instant
    // the float starts, and leaves it there for the whole animation.
    const restingShift = await label.evaluate((el) => {
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
      return m.e;
    });
    expect(restingShift).toBeGreaterThan(0);

    const resting = (await label.boundingBox())!.x;

    // Behavioural half: partway through the transition the label must be
    // somewhere between where it started and where it ends up.
    await input.focus();
    await page.waitForTimeout(60); // --sn-motion-slow is 200ms
    const mid = (await label.boundingBox())!.x;

    await page.waitForTimeout(400);
    const settled = (await label.boundingBox())!.x;

    expect(settled).toBeLessThan(resting);
    expect(mid).toBeLessThan(resting);
    expect(mid).toBeGreaterThan(settled);
  });

  test('Affix: the resting floating label clears the prefix, and returns when floated', async ({
    page,
  }) => {
    const field = demo(page, 'Prefix and suffix').locator('sn-form-field').nth(2);
    // `sn-label` is display:contents and has no box; the real element is inside.
    const label = field.locator('.sn-form-field-label');
    const resting = (await label.boundingBox())!.x;

    await field.locator('input').fill('example.com');
    await expect(field).toHaveClass(/\bsn-form-field-should-float\b/);
    // Let the transition finish. This used to read correctly the instant the
    // class landed, because the horizontal move was an unanimated snap, the
    // very bug the test above now guards. Reading mid-flight reads the start.
    await page.waitForTimeout(400);
    const floated = (await label.boundingBox())!.x;

    // Floated, the label belongs in the outline notch at the field's edge, so
    // it moves back left past the prefix it was clearing.
    expect(floated).toBeLessThan(resting);
  });
});
