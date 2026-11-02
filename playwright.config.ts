import { defineConfig, devices } from '@playwright/test';

// The suite runs the showcase on its own port, not the 4200 `pnpm start` uses.
// With reuseExistingServer, whatever already answers on the baseURL is driven as
// if it were the showcase, so sharing 4200 with a hand-started dev server (or
// another app entirely) silently points all 1104 specs at the wrong site and
// every one of them times out.
const PORT = 4301;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm start:e2e',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
