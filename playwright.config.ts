import { defineConfig, devices } from '@playwright/test';
const port=process.env['PLAYWRIGHT_PORT']??'4200';
export default defineConfig({
  testDir: './e2e', fullyParallel: false, timeout: 120000,
 use: { baseURL: `http://127.0.0.1:${port}`, trace: 'retain-on-failure', actionTimeout:15000, screenshot:'only-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
 webServer: { command: `npm start -- --port ${port}`, url: `http://127.0.0.1:${port}`, reuseExistingServer: !process.env['CI'], timeout: 120000 }
});
