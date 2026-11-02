import { test, expect } from '@playwright/test';
import { ROUTES } from './support/pages';

test.describe('smoke', () => {
  Object.entries(ROUTES).forEach(([name, route]) => {
    test(`should load ${name} (${route})`, async ({ page }) => {
      // Collect console errors
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // Navigate to the route
      await page.goto(route);

      // Wait for page to load and assert h1 is visible
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // Assert page has a non-empty title
      const pageTitle = await page.title();
      expect(pageTitle).toBeTruthy();
      expect(pageTitle.length).toBeGreaterThan(0);

      // Assert no console errors occurred
      expect(consoleErrors).toEqual([]);
    });
  });
});
