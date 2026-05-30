import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['Search.spec.ts', 'Room-Listing.spec.ts'],
  timeout: 90_000,
  expect: { timeout: 15_000 },
  workers: 1,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
