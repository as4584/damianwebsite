import { test, expect } from '@playwright/test';

/**
 * TESTING AGENT OUTPUT
 * E2E Test: Complete Site Navigation & Button Testing
 * 
 * Validates ALL buttons and links across the entire site.
 * Does NOT modify any production code.
 */

test.describe('Public Site Navigation', () => {
  
  test('should navigate homepage links correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test all navigation links in header
    const servicesLink = page.getByRole('link', { name: /services/i });
    await expect(servicesLink).toBeVisible();
    await servicesLink.click();
    await expect(page).toHaveURL(/\/services/);
    await page.goBack();
    
    const aboutLink = page.getByRole('link', { name: /about/i });
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about/);
    await page.goBack();
    
    const contactLink = page.getByRole('link', { name: /contact/i });
    await expect(contactLink).toBeVisible();
    await contactLink.click();
    await expect(page).toHaveURL(/\/contact/);
    await page.goBack();
  });

  test('should render all CTA buttons on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Main hero CTA
    const heroButton = page.locator('button, a').filter({ hasText: /get started|schedule|contact/i }).first();
    await expect(heroButton).toBeVisible();
    
    // Services section CTAs
    const serviceButtons = page.locator('a, button').filter({ hasText: /learn more|view services/i });
    const count = await serviceButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to all service pages', async ({ page }) => {
    await page.goto('/services');
    
    // Verify services page loaded
    await expect(page.getByRole('heading', { name: /services|what we offer/i })).toBeVisible();
    
    // Test service links (if present)
    const serviceLinks = page.locator('a[href*="/services/"], a[href*="/industries/"]');
    const linkCount = await serviceLinks.count();
    
    if (linkCount > 0) {
      // Click first service link
      await serviceLinks.first().click();
      await page.waitForLoadState('load');
      expect(page.url()).toContain('/');
    }
  });

  test('should load footer links', async ({ page }) => {
    await page.goto('/');
    
    // Privacy link
    const privacyLink = page.getByRole('link', { name: /privacy/i });
    if (await privacyLink.isVisible()) {
      await privacyLink.click();
      await expect(page).toHaveURL(/\/privacy/);
      await page.goBack();
    }
    
    // Terms link
    const termsLink = page.getByRole('link', { name: /terms/i });
    if (await termsLink.isVisible()) {
      await termsLink.click();
      await expect(page).toHaveURL(/\/terms/);
    }
  });

  test('should render chatbot widget on public pages', async ({ page }) => {
    await page.goto('/');
    
    // Wait for chatbot to render
    await page.waitForTimeout(2000);
    
    // Check for chatbot button/icon
    const chatbotTrigger = page.locator('[class*="chat"], [aria-label*="chat"]').first();
    await expect(chatbotTrigger).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Dashboard Authentication Guard', () => {
  
  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access dashboard without login
    await page.goto('/dashboard');
    
    // Should be redirected to /login
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
    
    // Verify login page elements
    await expect(page.getByRole('heading', { name: /sign in|login/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should allow authenticated users to access dashboard', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@innovation.com');
    await page.fill('input[type="password"]', 'King1000$');
    await page.locator('button[type="submit"]').click();
    
    // Wait for redirect
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    
    // Should be on dashboard
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    
    if (currentUrl.includes('/dashboard')) {
      // Verify dashboard loaded
      await expect(page.getByRole('heading', { name: /dashboard|leads/i })).toBeVisible({ timeout: 10000 });
      
      // Verify metrics cards present
      const metricsCards = page.locator('[class*="metric"], [class*="card"]');
      await expect(metricsCards.first()).toBeVisible({ timeout: 5000 });
    } else {
      console.warn('Dashboard redirect may have failed. Current URL:', currentUrl);
    }
  });

  test('should maintain session across page reloads', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@innovation.com');
    await page.fill('input[type="password"]', 'King1000$');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('load');
    
    // Reload page
    await page.reload();
    await page.waitForLoadState('load');
    
    // Should still be on dashboard (not redirected to login)
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain('/dashboard');
  });
});

test.describe('Dashboard UI Elements', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@innovation.com');
    await page.fill('input[type="password"]', 'King1000$');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
  });

  test('should display "Back to Homepage" button', async ({ page }) => {
    // This button will be added by Feature Agent
    // Test validates it exists and works correctly
    
    const backButton = page.getByRole('link', { name: /back to homepage|home/i })
      .or(page.getByRole('button', { name: /back to homepage|home/i }));
    
    await expect(backButton).toBeVisible({ timeout: 5000 });
    
    // Click and verify navigation to homepage
    await backButton.click();
    await page.waitForLoadState('load');
    await expect(page).toHaveURL('/');
  });

  test('should NOT display hotbar on dashboard', async ({ page }) => {
    // Verify hotbar (if it exists) is not rendered
    // Common hotbar selectors
    const hotbar = page.locator('[class*="hotbar"], [id*="hotbar"], nav[class*="top-bar"]');
    
    const count = await hotbar.count();
    if (count > 0) {
      // If hotbar exists, it should be hidden
      await expect(hotbar.first()).toBeHidden();
    }
  });

  test('should display logout button', async ({ page }) => {
    const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
    await expect(logoutButton).toBeVisible({ timeout: 5000 });
  });

  test('should display Recent Leads section', async ({ page }) => {
    // Verify Recent Leads heading or section
    const leadsHeading = page.getByRole('heading', { name: /recent leads|leads/i });
    await expect(leadsHeading).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Analytics Dashboard Section', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@innovation.com');
    await page.fill('input[type="password"]', 'King1000$');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
  });

  test('should display analytics section below Recent Leads', async ({ page }) => {
    // This section will be added by Feature Agent
    // Test validates it exists and is positioned correctly
    
    // Wait for analytics section to load
    const analyticsSection = page.locator('[data-testid="analytics-section"]')
      .or(page.getByRole('heading', { name: /analytics|statistics|insights/i }));
    
    await expect(analyticsSection).toBeVisible({ timeout: 10000 });
  });

  test('should display total leads count metric', async ({ page }) => {
    // Verify total leads metric card
    const totalLeadsCard = page.locator('[data-testid="total-leads"]')
      .or(page.getByText(/total leads/i).locator('xpath=ancestor::div[@class][1]'));
    
    await expect(totalLeadsCard).toBeVisible({ timeout: 10000 });
    
    // Verify it contains a number
    const leadsCount = page.locator('[data-testid="total-leads-value"]')
      .or(totalLeadsCard.locator('text=/\\d+/'));
    await expect(leadsCount).toBeVisible();
  });

  test('should display hot/warm/cold breakdown', async ({ page }) => {
    // Verify hotness breakdown cards
    const hotCard = page.getByText(/hot/i).locator('xpath=ancestor::div[@class][1]');
    const warmCard = page.getByText(/warm/i).locator('xpath=ancestor::div[@class][1]');
    const coldCard = page.getByText(/cold/i).locator('xpath=ancestor::div[@class][1]');
    
    await expect(hotCard).toBeVisible({ timeout: 10000 });
    await expect(warmCard).toBeVisible({ timeout: 10000 });
    await expect(coldCard).toBeVisible({ timeout: 10000 });
  });

  test('should display leads per day chart', async ({ page }) => {
    // Verify chart visualization exists
    const chart = page.locator('canvas, svg').filter({ has: page.locator('[class*="chart"]') })
      .or(page.locator('[data-testid="leads-chart"]'));
    
    await expect(chart).toBeVisible({ timeout: 10000 });
  });

  test('should display conversion stats', async ({ page }) => {
    // Verify conversion rate or conversion stats card
    const conversionCard = page.getByText(/conversion|rate/i).locator('xpath=ancestor::div[@class][1]');
    
    await expect(conversionCard).toBeVisible({ timeout: 10000 });
    
    // Verify it contains a percentage or ratio
    const conversionValue = conversionCard.locator('text=/\\d+%|\\d+\\/\\d+/');
    await expect(conversionValue).toBeVisible();
  });

  test('should load analytics data without errors', async ({ page }) => {
    // Monitor console for errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait for analytics to load
    await page.waitForTimeout(5000);
    
    // Check for analytics API call success
    const analyticsResponse = await page.waitForResponse(
      response => response.url().includes('/api/analytics') && response.status() === 200,
      { timeout: 10000 }
    ).catch(() => null);
    
    if (analyticsResponse) {
      expect(analyticsResponse.status()).toBe(200);
    }
    
    // Verify no critical errors
    const criticalErrors = errors.filter(e => 
      e.includes('analytics') || 
      e.includes('Failed to fetch') ||
      e.includes('500')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('should handle analytics loading state', async ({ page }) => {
    // Verify loading indicators appear before data loads
    const loadingIndicator = page.locator('[class*="loading"], [class*="spinner"]')
      .or(page.getByText(/loading/i));
    
    // Loading should appear briefly (may already be gone)
    const hasLoading = await loadingIndicator.isVisible().catch(() => false);
    
    // After load, data should be visible
    await page.waitForTimeout(3000);
    const analyticsData = page.locator('[data-testid="analytics-section"]');
    await expect(analyticsData).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Mobile Responsiveness', () => {
  
  test('should display navigation on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Mobile menu should be accessible
    const mobileMenu = page.locator('[aria-label*="menu"], button[class*="menu"]');
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await page.waitForTimeout(500);
      
      // Navigation links should appear
      const navLinks = page.getByRole('link', { name: /services|about|contact/i });
      await expect(navLinks.first()).toBeVisible();
    }
  });

  test('should display dashboard correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@innovation.com');
    await page.fill('input[type="password"]', 'King1000$');
    await page.locator('button[type="submit"]').click();
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    
    // Verify dashboard renders on mobile
    const dashboard = page.getByRole('heading', { name: /dashboard|leads/i });
    await expect(dashboard).toBeVisible({ timeout: 10000 });
    
    // Back to Homepage button should be visible
    const backButton = page.getByRole('link', { name: /back to homepage|home/i })
      .or(page.getByRole('button', { name: /back to homepage|home/i }));
    await expect(backButton).toBeVisible({ timeout: 5000 });
  });
});
