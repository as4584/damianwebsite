import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  
  // AUTO-RETRY: Retry failed tests up to 3 times (local) or 2 times (CI)
  retries: process.env.CI ? 2 : 3,
  
  workers: process.env.CI ? 1 : undefined,
  
  // ENHANCED REPORTING: Multiple reporters for comprehensive results
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  use: {
    baseURL: 'http://localhost:3001',
    
    // TRACE: Always capture traces for debugging
    trace: 'on-first-retry',
    
    // SCREENSHOTS: Always capture on failure, optionally on success
    screenshot: 'only-on-failure',
    
    // VIDEO: Record video on failure for debugging
    video: 'retain-on-failure',
    
    // Timeout for actions (click, fill, etc.)
    actionTimeout: 15000,
    
    // Navigation timeout
    navigationTimeout: 30000,
  },
  
  // TIMEOUT: Global timeout for each test
  timeout: 60000,
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['iPhone SE'] },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad'] },
    },
  ],
  
  // webServer configuration handles startup and readiness signals
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:3001/api/health',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      PORT: '3001',
      NODE_ENV: 'production',
    },
  },
});
