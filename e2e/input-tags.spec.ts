import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('InputTags', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.inputTags);
  });

  test.describe('Basic', () => {
    test('typing and pressing Enter adds a chip and clears the input', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('angular');
      await input.press('Enter');
      await expect(d.locator('sn-chip')).toHaveCount(1);
      await expect(d.locator('sn-chip').first()).toContainText('angular');
      await expect(input).toHaveValue('');
    });

    test('pressing comma adds a chip and clears the input', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('typescript');
      await input.press(',');
      await expect(d.locator('sn-chip')).toHaveCount(1);
      await expect(input).toHaveValue('');
    });

    test('duplicate tag is silently rejected', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('react');
      await input.press('Enter');
      await expect(d.locator('sn-chip')).toHaveCount(1);
      await input.fill('react');
      await input.press('Enter');
      await expect(d.locator('sn-chip')).toHaveCount(1);
    });

    test('empty input is not added as a tag', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input.sn-input-tags-field');
      await input.press('Enter');
      await expect(d.locator('sn-chip')).toHaveCount(0);
    });

    test('remove button on chip removes exactly that tag', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('one');
      await input.press('Enter');
      await input.fill('two');
      await input.press('Enter');
      await expect(d.locator('sn-chip')).toHaveCount(2);
      const firstChip = d.locator('sn-chip').first();
      await firstChip.getByRole('button', { name: /remove/i }).click();
      await expect(d.locator('sn-chip')).toHaveCount(1);
      await expect(d.locator('sn-chip').first()).toContainText('two');
    });

    test('Backspace on empty input removes the last tag', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('alpha');
      await input.press('Enter');
      await input.fill('beta');
      await input.press('Enter');
      await expect(d.locator('sn-chip')).toHaveCount(2);
      await input.press('Backspace');
      await expect(d.locator('sn-chip')).toHaveCount(1);
      await expect(d.locator('sn-chip').first()).toContainText('alpha');
    });

    test('Backspace with text in input does not remove a tag', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('gamma');
      await input.press('Enter');
      await expect(d.locator('sn-chip')).toHaveCount(1);
      await input.fill('del');
      await input.press('Backspace');
      await expect(d.locator('sn-chip')).toHaveCount(1);
    });

    test('blurring commits pending text as a tag', async ({ page }) => {
      const d = demo(page, 'Basic');
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('committed');
      await input.blur();
      await expect(d.locator('sn-chip')).toHaveCount(1);
      await expect(d.locator('sn-chip').first()).toContainText('committed');
    });

    test('clicking the shell focuses the input', async ({ page }) => {
      const d = demo(page, 'Basic');
      await d.locator('.sn-input-tags-shell').click();
      await expect(d.locator('input.sn-input-tags-field')).toBeFocused();
    });
  });

  test.describe('Preset tags', () => {
    test('preset tags are rendered as chips', async ({ page }) => {
      const d = demo(page, 'Preset tags');
      await expect(d.locator('sn-chip').first()).toBeVisible();
      await expect(d.locator('sn-chip')).not.toHaveCount(0);
    });
  });

  test.describe('Disabled', () => {
    test('has sn-input-tags--disabled class', async ({ page }) => {
      const d = demo(page, 'Disabled');
      await expect(d.locator('.sn-input-tags-shell')).toHaveClass(/\bsn-input-tags--disabled\b/);
    });

    test('the text input becomes disabled', async ({ page }) => {
      const d = demo(page, 'Disabled');
      await expect(d.locator('input.sn-input-tags-field')).toBeDisabled();
    });

    test('typing on disabled input does not add a chip', async ({ page }) => {
      const d = demo(page, 'Disabled');
      const chips = d.locator('sn-chip');
      await expect(chips).toHaveCount(2);
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('blocked', { force: true });
      await input.press('Enter', { force: true });
      await expect(chips).toHaveCount(2);
    });

    test('chip remove buttons are absent when disabled', async ({ page }) => {
      const d = demo(page, 'Disabled');
      await expect(d.locator('sn-chip').first()).toBeVisible();
      await expect(d.locator('sn-chip').first().getByRole('button')).toHaveCount(0);
    });
  });

  test.describe('Reactive form', () => {
    test('adding a tag updates the reactive form readout', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('vue');
      await input.press('Enter');
      await expect(d.locator('.hint-text')).toContainText('"vue"');
    });

    test('removing a tag updates the reactive form readout', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('svelte');
      await input.press('Enter');
      await expect(d.locator('.hint-text')).toContainText('"svelte"');
      await d.locator('sn-chip').first().getByRole('button', { name: /remove/i }).click();
      await expect(d.locator('.hint-text')).not.toContainText('"svelte"');
    });

    test('initial readout shows empty array', async ({ page }) => {
      const d = demo(page, 'Reactive form');
      await expect(d.locator('.hint-text')).toContainText('[]');
    });
  });

  test.describe('ngModel', () => {
    test('adding a tag updates the ngModel readout', async ({ page }) => {
      const d = demo(page, 'ngModel');
      const input = d.locator('input.sn-input-tags-field');
      await input.fill('node');
      await input.press('Enter');
      await expect(d.locator('.hint-text')).toContainText('"node"');
    });

    test('initial readout shows empty array', async ({ page }) => {
      const d = demo(page, 'ngModel');
      await expect(d.locator('.hint-text')).toContainText('[]');
    });
  });

  test.describe('Inside FormField', () => {
    test('input receives id wired to the label', async ({ page }) => {
      const d = demo(page, 'Inside FormField');
      const label = d.locator('label');
      const input = d.locator('input.sn-input-tags-field');
      const labelFor = await label.getAttribute('for');
      const inputId = await input.getAttribute('id');
      expect(labelFor).toBeTruthy();
      expect(inputId).toBeTruthy();
      expect(labelFor).toBe(inputId);
    });
  });
});
