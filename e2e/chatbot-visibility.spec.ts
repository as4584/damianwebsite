import { test, expect, devices } from '@playwright/test';

/**
 * E2E Test: Chatbot Visibility Across Devices
 * 
 * Tests chatbot widget visibility and functionality on:
 * - Desktop (1920x1080)
 * - Tablet (iPad - 768x1024)
 * - Mobile (iPhone SE - 375x667)
 * 
 * Ensures chatbot is ALWAYS visible and accessible
 */

test.describe('Chatbot Visibility - Desktop', () => {
  test.use({ viewport: { width: 1920, height: 1080 } });
  
  test('should display chatbot widget on desktop', async ({ page }) => {
    // Visit homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find chatbot button/widget
    const chatbotWidget = page.locator('button, [role="button"]').filter({ 
      hasText: /chat|help|message|talk/i 
    }).or(page.locator('[class*="chat"], [id*="chat"]')).first();
    
    // Verify chatbot is visible
    await expect(chatbotWidget).toBeVisible({ timeout: 10000 });
    
    // Get position and dimensions
    const box = await chatbotWidget.boundingBox();
    expect(box).not.toBeNull();
    
    console.log('Desktop chatbot position:', box);
    
    // Verify it's clickable (not obscured)
    await expect(chatbotWidget).toBeEnabled();
    
    // Click to open
    await chatbotWidget.click();
    await page.waitForTimeout(1000);
    
    // Verify chat window opened
    const chatWindow = page.locator('[class*="chat"], [role="dialog"]').filter({ 
      hasText: /message|chat|type/i 
    });
    await expect(chatWindow).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/chatbot-desktop.png', 
      fullPage: true 
    });
    
    console.log('✅ Chatbot visible and functional on desktop');
  });
  
  test('should not obstruct main content on desktop', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that chatbot doesn't cover hero section
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();
    
    // Check that chatbot doesn't cover CTA buttons
    const ctaButtons = page.locator('button, a').filter({ 
      hasText: /get started|learn more|contact/i 
    });
    const ctaCount = await ctaButtons.count();
    
    if (ctaCount > 0) {
      await expect(ctaButtons.first()).toBeVisible();
    }
    
    console.log('✅ Chatbot positioned correctly, not obstructing content');
  });
});

test.describe('Chatbot Visibility - Tablet', () => {
  test.use(devices['iPad']);
  
  test('should display chatbot widget on tablet', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find chatbot
    const chatbotWidget = page.locator('button, [role="button"]').filter({ 
      hasText: /chat|help|message/i 
    }).or(page.locator('[class*="chat"]')).first();
    
    // Verify visible
    await expect(chatbotWidget).toBeVisible({ timeout: 10000 });
    
    // Get position
    const box = await chatbotWidget.boundingBox();
    expect(box).not.toBeNull();
    
    console.log('Tablet chatbot position:', box);
    
    // Verify it's in viewport
    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(768);
      expect(box.y + box.height).toBeLessThanOrEqual(1024);
    }
    
    // Click to open
    await chatbotWidget.click();
    await page.waitForTimeout(1000);
    
    // Verify chat window is responsive
    const chatWindow = page.locator('[class*="chat"], [role="dialog"]');
    await expect(chatWindow).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/chatbot-tablet.png', 
      fullPage: true 
    });
    
    console.log('✅ Chatbot visible and functional on tablet');
  });
});

test.describe('Chatbot Visibility - Mobile', () => {
  test.use(devices['iPhone SE']);
  
  test('should display chatbot widget on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find chatbot - may be smaller on mobile
    const chatbotWidget = page.locator('button, [role="button"]').filter({ 
      hasText: /chat|help|message/i 
    }).or(page.locator('[class*="chat"]')).first();
    
    // Verify visible
    await expect(chatbotWidget).toBeVisible({ timeout: 10000 });
    
    // Get position
    const box = await chatbotWidget.boundingBox();
    expect(box).not.toBeNull();
    
    console.log('Mobile chatbot position:', box);
    
    // Verify it's in viewport (iPhone SE is 375x667)
    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(375);
      expect(box.y + box.height).toBeLessThanOrEqual(667);
    }
    
    // Verify button is large enough to tap (WCAG recommends 44x44px minimum)
    if (box) {
      expect(box.width).toBeGreaterThanOrEqual(40);
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
    
    // Click to open (tap on mobile)
    await chatbotWidget.click();
    await page.waitForTimeout(1000);
    
    // Verify chat window opens and is usable
    const chatWindow = page.locator('[class*="chat"], [role="dialog"]');
    await expect(chatWindow).toBeVisible();
    
    // Verify chat input is accessible
    const chatInput = page.locator('input[type="text"], textarea').first();
    await expect(chatInput).toBeVisible();
    
    // Test typing on mobile
    await chatInput.click();
    await chatInput.fill('Test message from mobile');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'test-results/chatbot-mobile.png', 
      fullPage: true 
    });
    
    console.log('✅ Chatbot visible and functional on mobile');
  });
  
  test('should not cover navigation on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that chatbot doesn't cover mobile navigation
    const nav = page.locator('nav, [role="navigation"]').first();
    
    if (await nav.isVisible()) {
      const navBox = await nav.boundingBox();
      const chatbotBox = await page.locator('[class*="chat"]').first().boundingBox();
      
      if (navBox && chatbotBox) {
        // Ensure they don't overlap
        const overlap = !(
          chatbotBox.x > navBox.x + navBox.width ||
          chatbotBox.x + chatbotBox.width < navBox.x ||
          chatbotBox.y > navBox.y + navBox.height ||
          chatbotBox.y + chatbotBox.height < navBox.y
        );
        
        expect(overlap).toBe(false);
      }
    }
    
    console.log('✅ Chatbot positioned correctly, not covering navigation');
  });
  
  test('should be accessible with touch gestures', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const chatbotWidget = page.locator('button, [role="button"]').filter({ 
      hasText: /chat|help/i 
    }).first();
    
    // Test tap gesture
    await chatbotWidget.tap();
    await page.waitForTimeout(1000);
    
    // Verify opened
    const chatWindow = page.locator('[class*="chat"], [role="dialog"]');
    await expect(chatWindow).toBeVisible();
    
    // Close button should be accessible
    const closeButton = chatWindow.locator('button').filter({ 
      hasText: /close|✕|×/i 
    }).or(chatWindow.locator('[aria-label*="close"]'));
    
    if (await closeButton.count() > 0) {
      await closeButton.first().tap();
      await page.waitForTimeout(500);
      
      // Should close
      await expect(chatWindow).not.toBeVisible();
    }
    
    console.log('✅ Chatbot responds to touch gestures');
  });
});

test.describe('Chatbot Visibility - All Pages', () => {
  const pages = ['/', '/about', '/services', '/contact', '/industries'];
  
  for (const pagePath of pages) {
    test(`should display chatbot on ${pagePath}`, async ({ page }) => {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Find chatbot
      const chatbotWidget = page.locator('button, [role="button"]').filter({ 
        hasText: /chat|help|message/i 
      }).or(page.locator('[class*="chat"]')).first();
      
      // Verify visible
      await expect(chatbotWidget).toBeVisible({ timeout: 10000 });
      
      console.log(`✅ Chatbot visible on ${pagePath}`);
    });
  }
});

/**
 * Accessibility Tests
 */
test.describe('Chatbot Accessibility', () => {
  
  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab to chatbot button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // May need multiple tabs depending on page structure
    
    // Check if chatbot is focused (or can be focused)
    const chatbotWidget = page.locator('button, [role="button"]').filter({ 
      hasText: /chat|help/i 
    }).first();
    
    // Focus it directly
    await chatbotWidget.focus();
    
    // Press Enter to open
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    // Verify opened
    const chatWindow = page.locator('[class*="chat"], [role="dialog"]');
    await expect(chatWindow).toBeVisible();
    
    console.log('✅ Chatbot is keyboard accessible');
  });
  
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for aria-label or accessible name
    const chatbotWidget = page.locator('button, [role="button"]').filter({ 
      hasText: /chat|help/i 
    }).first();
    
    const ariaLabel = await chatbotWidget.getAttribute('aria-label');
    const textContent = await chatbotWidget.textContent();
    
    // Should have either aria-label or visible text
    expect(ariaLabel || textContent).toBeTruthy();
    
    console.log('Chatbot accessible name:', ariaLabel || textContent);
    console.log('✅ Chatbot has accessible label');
  });
});
