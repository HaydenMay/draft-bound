import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './e2e', fullyParallel: false, timeout: 120000,
  use: { baseURL: 'http://127.0.0.1:4200', trace: 'retain-on-failure', actionTimeout:15000, screenshot:'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'npm start -- --port 4200', url: 'http://127.0.0.1:4200', reuseExistingServer: !process.env['CI'], timeout: 120000 }
});
