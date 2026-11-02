import { test, expect } from '@playwright/test';
import { ROUTES, demo } from './support/pages';

test.describe('Carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.carousel);
  });

  test.describe('Basic slides', () => {
    test('carousel region role and aria-roledescription are present', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      const carousel = d.locator('[role="region"][aria-roledescription="carousel"]');
      await expect(carousel).toBeVisible();
    });

    test('first slide is visible and others are aria-hidden', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      const slides = d.locator('[role="group"][aria-roledescription="slide"]');
      await expect(slides).toHaveCount(4);
      await expect(slides.nth(0)).not.toHaveAttribute('aria-hidden', 'true');
      await expect(slides.nth(1)).toHaveAttribute('aria-hidden', 'true');
      await expect(slides.nth(2)).toHaveAttribute('aria-hidden', 'true');
      await expect(slides.nth(3)).toHaveAttribute('aria-hidden', 'true');
    });

    test('each slide has an aria-label of the form "Slide N of M"', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      const slides = d.locator('[role="group"][aria-roledescription="slide"]');
      await expect(slides.nth(0)).toHaveAttribute('aria-label', /slide 1 of 4/i);
      await expect(slides.nth(3)).toHaveAttribute('aria-label', /slide 4 of 4/i);
    });

    test('next button advances the slide and track transform changes', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      const track = d.locator('.sn-carousel-track');
      const nextBtn = d.locator('.sn-carousel-btn-next');

      await expect(track).toHaveCSS('transform', /matrix/);
      const before = await track.evaluate((el) => getComputedStyle(el).transform);

      await nextBtn.click();

      await expect(track).not.toHaveCSS('transform', before);
      const slides = d.locator('[role="group"][aria-roledescription="slide"]');
      await expect(slides.nth(0)).toHaveAttribute('aria-hidden', 'true');
      await expect(slides.nth(1)).not.toHaveAttribute('aria-hidden', 'true');
    });

    test('prev button goes back to the previous slide', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      const nextBtn = d.locator('.sn-carousel-btn-next');
      const prevBtn = d.locator('.sn-carousel-btn-prev');

      await nextBtn.click();
      const slides = d.locator('[role="group"][aria-roledescription="slide"]');
      await expect(slides.nth(1)).not.toHaveAttribute('aria-hidden', 'true');

      await prevBtn.click();
      await expect(slides.nth(0)).not.toHaveAttribute('aria-hidden', 'true');
      await expect(slides.nth(1)).toHaveAttribute('aria-hidden', 'true');
    });

    test('dot indicators reflect the active index via aria-current and active class', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      const dots = d.locator('.sn-carousel-dot');
      await expect(dots).toHaveCount(4);
      await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');
      await expect(dots.nth(0)).toHaveClass(/sn-carousel-dot--active/);
      await expect(dots.nth(1)).not.toHaveAttribute('aria-current', 'true');

      await d.locator('.sn-carousel-btn-next').click();
      await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
      await expect(dots.nth(1)).toHaveClass(/sn-carousel-dot--active/);
      await expect(dots.nth(0)).not.toHaveAttribute('aria-current', 'true');
    });

    test('clicking a dot jumps to that slide', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      const dots = d.locator('.sn-carousel-dot');
      await dots.nth(2).click();

      const slides = d.locator('[role="group"][aria-roledescription="slide"]');
      await expect(slides.nth(2)).not.toHaveAttribute('aria-hidden', 'true');
      await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true');
    });

    test('prev button is disabled on the first slide', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      await expect(d.locator('.sn-carousel-btn-prev')).toBeDisabled();
    });

    test('next button is disabled on the last slide', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      const dots = d.locator('.sn-carousel-dot');
      await dots.nth(3).click();
      await expect(d.locator('.sn-carousel-btn-next')).toBeDisabled();
    });

    test('keyboard ArrowRight on the carousel region advances the slide', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      // Focus a child button so keydown bubbles to the carousel host keydown handler
      await d.locator('.sn-carousel-btn-next').focus();
      await page.keyboard.press('ArrowRight');

      const slides = d.locator('[role="group"][aria-roledescription="slide"]');
      await expect(slides.nth(1)).not.toHaveAttribute('aria-hidden', 'true');
    });

    test('keyboard ArrowLeft on the carousel region goes back', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      await d.locator('.sn-carousel-btn-next').click();
      const slides = d.locator('[role="group"][aria-roledescription="slide"]');
      await expect(slides.nth(1)).not.toHaveAttribute('aria-hidden', 'true');

      // Next button is now disabled; focus the prev button so keydown bubbles up
      await d.locator('.sn-carousel-btn-prev').focus();
      await page.keyboard.press('ArrowLeft');
      await expect(slides.nth(0)).not.toHaveAttribute('aria-hidden', 'true');
    });

    test('keyboard ArrowLeft is clamped at the first slide', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      await d.locator('.sn-carousel-btn-next').focus();
      await page.keyboard.press('ArrowLeft');

      const slides = d.locator('[role="group"][aria-roledescription="slide"]');
      await expect(slides.nth(0)).not.toHaveAttribute('aria-hidden', 'true');
    });

    test('keyboard ArrowRight is clamped at the last slide', async ({ page }) => {
      const d = demo(page, 'Basic slides');
      const dots = d.locator('.sn-carousel-dot');
      await dots.nth(3).click();
      // Prev button is not disabled at slide 4; focus it to bubble keydown to the host
      await d.locator('.sn-carousel-btn-prev').focus();
      await page.keyboard.press('ArrowRight');

      const slides = d.locator('[role="group"][aria-roledescription="slide"]');
      await expect(slides.nth(3)).not.toHaveAttribute('aria-hidden', 'true');
    });
  });

  test.describe('Two-way activeIndex binding', () => {
    test('next button updates the external activeIndex readout', async ({ page }) => {
      const d = demo(page, 'Two-way activeIndex binding');
      await d.locator('.sn-carousel-btn-next').click();
      await expect(d.locator('.demo-binding-info')).toContainText('Active index: 1');
    });

    test('clicking the second dot updates the readout to index 1', async ({ page }) => {
      const d = demo(page, 'Two-way activeIndex binding');
      await d.locator('.sn-carousel-dot').nth(1).click();
      await expect(d.locator('.demo-binding-info')).toContainText('Active index: 1');
    });
  });
});
