import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Chip', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.chip);
  });

  test('label text renders: Basic chips', async ({ page }) => {
    const demoSection = demo(page, 'Basic chips');

    const chips = demoSection.locator('sn-chip');
    await expect(chips).toHaveCount(3);

    // Check that label text is rendered in .sn-chip-label using retrying assertions
    await expect(chips.nth(0).locator('.sn-chip-label')).toHaveText('Streaming');
    await expect(chips.nth(1).locator('.sn-chip-label')).toHaveText('macros');
    await expect(chips.nth(2).locator('.sn-chip-label')).toHaveText('deploy');
  });

  test('removable chip: aria-label from SnIntl.removeChip(label)', async ({ page }) => {
    const demoSection = demo(page, 'Removable chips');

    // Get the first removable chip
    const firstChip = demoSection.locator('sn-chip').nth(0);
    const removeBtn = firstChip.locator('.sn-chip-remove');

    // Verify the remove button has the correct aria-label
    // SnIntl.removeChip(label) returns "Remove <label>"
    await expect(removeBtn).toHaveAttribute('aria-label', /^Remove/);

    // Extract the aria-label to verify it matches the chip label
    const label = firstChip.locator('.sn-chip-label');
    const chipText = await label.textContent();
    const expectedLabel = `Remove ${chipText}`;

    await expect(removeBtn).toHaveAttribute('aria-label', expectedLabel);
  });

  test('removing chip: click remove button emits removed and updates DOM', async ({ page }) => {
    const demoSection = demo(page, 'Removable chips');

    // Get the first chip label for verification
    const firstChip = demoSection.locator('sn-chip').nth(0);
    const firstLabel = firstChip.locator('.sn-chip-label');
    const firstChipText = await firstLabel.textContent();

    // Click the remove button
    const removeBtn = firstChip.locator('.sn-chip-remove');
    await removeBtn.click();

    // Gate with retrying assertion to ensure the @for re-render has flushed
    const chips = demoSection.locator('sn-chip');
    await expect(chips).toHaveCount(3); // Was 4, now 3 after removal

    // Verify the specific chip text is no longer in the demo
    const chipTexts = await demoSection.locator('.sn-chip-label').allTextContents();
    expect(chipTexts).not.toContain(firstChipText);
  });

  test('icon slot: With icon renders .sn-chip-icon', async ({ page }) => {
    const demoSection = demo(page, 'With icon');

    const chips = demoSection.locator('sn-chip');

    // First chip with videocam icon
    const chip1 = chips.nth(0);
    const icon1 = chip1.locator('.sn-chip-icon');
    await expect(icon1).toBeVisible();
    await expect(icon1).toHaveText('videocam');

    // Second chip with headphones icon
    const chip2 = chips.nth(1);
    const icon2 = chip2.locator('.sn-chip-icon');
    await expect(icon2).toBeVisible();
    await expect(icon2).toHaveText('headphones');

    // Third chip with settings icon
    const chip3 = chips.nth(2);
    const icon3 = chip3.locator('.sn-chip-icon');
    await expect(icon3).toBeVisible();
    await expect(icon3).toHaveText('settings');
  });

  test('selected state applies sn-chip--selected class', async ({ page }) => {
    const demoSection = demo(page, 'Selected state');

    const chips = demoSection.locator('sn-chip');

    // First chip is selected
    const selectedChip = chips.nth(0);
    await expect(selectedChip).toHaveClass(/\bsn-chip--selected\b/);

    // Second chip is not selected
    const unselectedChip = chips.nth(1);
    await expect(unselectedChip).not.toHaveClass(/\bsn-chip--selected\b/);

    // Third chip is selected (with icon)
    const selectedWithIcon = chips.nth(2);
    await expect(selectedWithIcon).toHaveClass(/\bsn-chip--selected\b/);
  });

  test('toggle selected state: interactive click toggles sn-chip--selected', async ({
    page,
  }) => {
    const demoSection = demo(page, 'Toggle selected (interactive)');

    const firstChip = demoSection.locator('sn-chip').nth(0);

    // Check initial selected state (from component definition, it's selected=true)
    await expect(firstChip).toHaveClass(/\bsn-chip--selected\b/);

    // Click to toggle
    await firstChip.click();

    // Verify the class was toggled off using retrying assertion
    await expect(firstChip).not.toHaveClass(/\bsn-chip--selected\b/);

    // Click again to toggle back on
    await firstChip.click();
    await expect(firstChip).toHaveClass(/\bsn-chip--selected\b/);
  });

  test('content projection: chip with text content renders in label', async ({ page }) => {
    const demoSection = demo(page, 'Content projection');

    const chips = demoSection.locator('sn-chip');

    // First chip with content projection "angular"
    const label1 = chips.nth(0).locator('.sn-chip-label');
    await expect(label1).toHaveText('angular');

    // Second chip "typescript"
    const label2 = chips.nth(1).locator('.sn-chip-label');
    await expect(label2).toHaveText('typescript');

    // Third chip "rxjs" with removable
    const label3 = chips.nth(2).locator('.sn-chip-label');
    await expect(label3).toHaveText('rxjs');
    const removeBtn3 = chips.nth(2).locator('.sn-chip-remove');
    await expect(removeBtn3).toBeVisible();
  });

  test('removable marker class sn-chip--removable applies when removable=true', async ({
    page,
  }) => {
    const demoSection = demo(page, 'Removable chips');

    const chips = demoSection.locator('sn-chip');
    const firstChip = chips.nth(0);

    // Verify the removable class and remove button exist
    await expect(firstChip).toHaveClass(/\bsn-chip--removable\b/);
    await expect(firstChip.locator('.sn-chip-remove')).toBeVisible();
  });

  test('host always has sn-chip base class', async ({ page }) => {
    const demoSection = demo(page, 'Basic chips');

    const chip = demoSection.locator('sn-chip').nth(0);
    await expect(chip).toHaveClass(/\bsn-chip\b/);
  });
});
