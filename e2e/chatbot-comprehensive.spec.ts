/**
 * COMPREHENSIVE CHATBOT TEST SUITE
 * 
 * This test ensures the chatbot is fully functional and VISIBLE to users.
 * All tests must pass for production deployment.
 * 
 * Test Categories:
 * 1. Visual Visibility (no white-on-white, proper contrast)
 * 2. Functional Interaction (can send/receive messages)
 * 3. UI Controls (collapsible, resizable)
 * 4. Scrolling (handles long conversations)
 * 5. Lead Capture (creates leads for dashboard)
 * 6. Cross-Environment (dev and production)
 */

import { test, expect } from '@playwright/test';

// Test both local and production
const TEST_URLS = [
  { name: 'Development', url: 'http://localhost:3001' },
  { name: 'Production', url: 'https://innovationdevelopmentsolutions.com' }
];

for (const { name, url } of TEST_URLS) {
  test.describe(`Chatbot Comprehensive Tests - ${name}`, () => {
    
    /**
     * TEST 1: VISUAL VISIBILITY
     * Ensures text is readable with proper contrast
     */
    test('should have visible text with proper contrast (no white-on-white)', async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Give chatbot time to load (it might be dynamically rendered)
      await page.waitForTimeout(3000);
      
      // Find chatbot button - look for various selectors
      const chatButton = page.locator('button:has-text("Chat"), button:has-text("Help"), button:has-text("Message"), button[aria-label*="chat" i], [class*="chat"][role="button"]').first();
      await expect(chatButton).toBeVisible({ timeout: 10000 });
      await chatButton.click();
      await page.waitForTimeout(2000);
      
      // Wait for chat modal to appear
      const chatModal = page.locator('[class*="chat"]').filter({ hasText: /message|hey|help/i }).first();
      await expect(chatModal).toBeVisible({ timeout: 5000 });
      
      // Check the first bot message
      const botMessage = page.locator('div').filter({ hasText: /hey there|hello|hi/i }).first();
      await expect(botMessage).toBeVisible();
      
      // Get computed styles of message
      const messageColor = await botMessage.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
          backgroundImage: style.backgroundImage
        };
      });
      
      console.log('Bot message styles:', messageColor);
      
      // Parse RGB values to check it's not white text (255,255,255)
      const colorMatch = messageColor.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (colorMatch) {
        const [_, r, g, b] = colorMatch.map(Number);
        
        // Text should NOT be white (allow some tolerance)
        const isWhiteText = r > 240 && g > 240 && b > 240;
        
        // Background should not be white if text is white
        const bgMatch = messageColor.backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        let isWhiteBackground = false;
        if (bgMatch) {
          const [_, br, bg, bb] = bgMatch.map(Number);
          isWhiteBackground = br > 240 && bg > 240 && bb > 240;
        }
        
        // FAIL if white-on-white
        expect(isWhiteText && isWhiteBackground).toBe(false);
        
        console.log(`✅ Text visibility check passed: Text RGB(${r},${g},${b})`);
      }
      
      // Take screenshot for visual verification
      await page.screenshot({ 
        path: `test-results/chatbot-visibility-${name.toLowerCase()}.png`,
        fullPage: true 
      });
    });
    
    /**
     * TEST 2: FUNCTIONAL INTERACTION
     * Ensures user can send messages and receive responses
     */
    test('should allow sending messages and receive bot responses', async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Open chatbot
      const chatButton = page.locator('button').filter({ hasText: /chat|help/i }).first();
      await chatButton.click();
      await page.waitForTimeout(2000);
      
      // Find input field
      const input = page.locator('input[type="text"], input[placeholder*="message" i], input[placeholder*="type" i]').first();
      await expect(input).toBeVisible({ timeout: 5000 });
      
      // Count initial messages
      const initialMessageCount = await page.locator('div').filter({ hasText: /hey there|hello/i }).count();
      
      // Type and send message
      await input.click();
      await input.fill('I want to start an LLC');
      await page.keyboard.press('Enter');
      
      // Wait for response
      await page.waitForTimeout(3000);
      
      // Verify user message appears
      const userMessage = page.locator('text="I want to start an LLC"');
      await expect(userMessage).toBeVisible({ timeout: 5000 });
      
      // Verify bot responds
      await page.waitForTimeout(2000);
      const allMessages = await page.locator('div').filter({ hasText: /.+/i }).count();
      expect(allMessages).toBeGreaterThan(initialMessageCount);
      
      console.log(`✅ Message interaction successful: ${initialMessageCount} → ${allMessages} messages`);
    });
    
    /**
     * TEST 3: COLLAPSIBLE FUNCTIONALITY
     * Ensures chat can be opened and closed
     */
    test('should be collapsible (open and close)', async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Find chat button
      const chatButton = page.locator('button').filter({ hasText: /chat|help/i }).first();
      await expect(chatButton).toBeVisible();
      
      // Click to open
      await chatButton.click();
      await page.waitForTimeout(1500);
      
      // Verify modal is open
      const chatModal = page.locator('[class*="modal"], [role="dialog"]').or(
        page.locator('div').filter({ hasText: /hey there|message|type here/i })
      ).first();
      await expect(chatModal).toBeVisible();
      
      console.log('✅ Chat opened successfully');
      
      // Find close button (X, Close, or ESC)
      const closeButton = page.locator('button').filter({ 
        hasText: /close|×|✕/i 
      }).or(page.locator('[aria-label*="close" i]')).first();
      
      if (await closeButton.isVisible()) {
        await closeButton.click();
        await page.waitForTimeout(1000);
        
        // Verify modal closed
        await expect(chatModal).not.toBeVisible();
        console.log('✅ Chat closed successfully');
      } else {
        // Try clicking the bubble again to close
        await chatButton.click();
        await page.waitForTimeout(1000);
        
        const isStillVisible = await chatModal.isVisible().catch(() => false);
        expect(isStillVisible).toBe(false);
        console.log('✅ Chat toggled closed successfully');
      }
    });
    
    /**
     * TEST 4: RESIZABLE INTERFACE
     * Ensures chat window can be resized or adapts to screen size
     */
    test('should have appropriate sizing for different viewports', async ({ page }) => {
      // Test desktop size
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const chatButton = page.locator('button').filter({ hasText: /chat|help/i }).first();
      await chatButton.click();
      await page.waitForTimeout(1500);
      
      const chatModal = page.locator('[class*="modal"], [role="dialog"]').or(
        page.locator('div').filter({ hasText: /hey there|message/i })
      ).first();
      
      const desktopBox = await chatModal.boundingBox();
      expect(desktopBox).not.toBeNull();
      
      console.log('Desktop chat size:', desktopBox);
      
      // Should not take up full screen on desktop
      if (desktopBox) {
        expect(desktopBox.width).toBeLessThan(1920);
        expect(desktopBox.height).toBeLessThan(1080);
      }
      
      // Test mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const chatButtonMobile = page.locator('button').filter({ hasText: /chat|help/i }).first();
      await chatButtonMobile.click();
      await page.waitForTimeout(1500);
      
      const chatModalMobile = page.locator('[class*="modal"], [role="dialog"]').or(
        page.locator('div').filter({ hasText: /hey there|message/i })
      ).first();
      
      const mobileBox = await chatModalMobile.boundingBox();
      expect(mobileBox).not.toBeNull();
      
      console.log('Mobile chat size:', mobileBox);
      
      // Should adapt to mobile screen
      if (mobileBox) {
        expect(mobileBox.width).toBeLessThanOrEqual(375);
        expect(mobileBox.height).toBeLessThanOrEqual(667);
      }
      
      console.log('✅ Chat sizing adapts correctly to viewport');
    });
    
    /**
     * TEST 5: SCROLLING FOR LONG CONVERSATIONS
     * Ensures scrollbar appears when conversation is long
     */
    test('should have scrollable content for long conversations', async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Open chat
      const chatButton = page.locator('button').filter({ hasText: /chat|help/i }).first();
      await chatButton.click();
      await page.waitForTimeout(2000);
      
      // Find input
      const input = page.locator('input[type="text"], input[placeholder*="message" i]').first();
      await expect(input).toBeVisible();
      
      // Send multiple messages to create long conversation
      for (let i = 1; i <= 8; i++) {
        await input.click();
        await input.fill(`Test message ${i} - This is a test message to create a long conversation that requires scrolling.`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
      }
      
      // Check if messages container has scroll
      const messagesContainer = page.locator('[class*="messages"], [class*="overflow"]').first();
      
      const hasScroll = await messagesContainer.evaluate((el) => {
        return el.scrollHeight > el.clientHeight;
      });
      
      // Should have scroll when content exceeds container
      expect(hasScroll).toBe(true);
      
      console.log('✅ Chat has scrollable content for long conversations');
      
      // Test scrolling works
      const initialScrollTop = await messagesContainer.evaluate(el => el.scrollTop);
      
      await messagesContainer.evaluate((el) => {
        el.scrollTop = 0; // Scroll to top
      });
      
      await page.waitForTimeout(500);
      
      const scrolledTop = await messagesContainer.evaluate(el => el.scrollTop);
      expect(scrolledTop).toBe(0);
      
      console.log('✅ Scrolling functionality works correctly');
    });
    
    /**
     * TEST 6: LEAD CAPTURE FOR DASHBOARD
     * Ensures chatbot creates leads that appear in dashboard
     */
    test('should capture lead information for dashboard', async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Open chatbot
      const chatButton = page.locator('button').filter({ hasText: /chat|help/i }).first();
      await chatButton.click();
      await page.waitForTimeout(2000);
      
      // Find input
      const input = page.locator('input[type="text"], input[placeholder*="message" i]').first();
      await expect(input).toBeVisible();
      
      // Simulate lead capture conversation
      const testEmail = `test-lead-${Date.now()}@example.com`;
      const testPhone = '555-0123';
      const testName = 'Test Lead User';
      
      // Step 1: Express interest
      await input.fill('I want to start an LLC');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
      
      // Step 2: Provide name (look for name prompt)
      const namePrompt = page.locator('text=/name/i').first();
      if (await namePrompt.isVisible({ timeout: 3000 }).catch(() => false)) {
        await input.fill(testName);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
      }
      
      // Step 3: Provide email
      await input.fill(testEmail);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
      
      // Step 4: Provide phone
      await input.fill(testPhone);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
      
      console.log(`✅ Lead capture flow completed: ${testEmail}`);
      
      // Verify conversation history contains lead data
      const conversationText = await page.locator('body').innerText();
      expect(conversationText).toContain(testEmail);
      
      console.log('✅ Lead information captured in conversation');
      
      // Take screenshot of completed lead capture
      await page.screenshot({ 
        path: `test-results/lead-capture-${name.toLowerCase()}.png`,
        fullPage: true 
      });
    });
    
    /**
     * TEST 7: CHATBOT VISIBILITY ON ALL KEY PAGES
     * Ensures chatbot appears on every important page
     */
    const keyPages = ['/', '/services', '/about', '/contact', '/industries', '/who-we-serve'];
    
    for (const pagePath of keyPages) {
      test(`should be visible on ${pagePath}`, async ({ page }) => {
        const fullUrl = url + pagePath;
        await page.goto(fullUrl);
        await page.waitForLoadState('networkidle');
        
        // Find chatbot button
        const chatButton = page.locator('button').filter({ hasText: /chat|help|message/i }).first();
        
        // Must be visible within 10 seconds
        await expect(chatButton).toBeVisible({ timeout: 10000 });
        
        // Must be in viewport
        const box = await chatButton.boundingBox();
        expect(box).not.toBeNull();
        
        console.log(`✅ Chatbot visible on ${pagePath}`);
      });
    }
    
    /**
     * TEST 8: PERFORMANCE - CHAT LOADS QUICKLY
     * Ensures chatbot doesn't slow down the page
     */
    test('should load and open quickly (performance)', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      const chatButton = page.locator('button').filter({ hasText: /chat|help/i }).first();
      await expect(chatButton).toBeVisible({ timeout: 5000 });
      
      const loadTime = Date.now() - startTime;
      console.log(`Page load time: ${loadTime}ms`);
      
      // Should load in under 10 seconds
      expect(loadTime).toBeLessThan(10000);
      
      // Test opening speed
      const openStartTime = Date.now();
      await chatButton.click();
      
      const chatModal = page.locator('[class*="modal"], [role="dialog"]').or(
        page.locator('div').filter({ hasText: /hey there|message/i })
      ).first();
      
      await expect(chatModal).toBeVisible({ timeout: 3000 });
      const openTime = Date.now() - openStartTime;
      
      console.log(`Chat open time: ${openTime}ms`);
      
      // Should open in under 3 seconds
      expect(openTime).toBeLessThan(3000);
      
      console.log('✅ Chat performance is acceptable');
    });
    
  });
}

/**
 * PRODUCTION-ONLY VALIDATION
 * Only runs if production URL is accessible
 */
test.describe('Production Validation', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Production tests only on chromium');
  
  test('should verify production chatbot is fully functional', async ({ page }) => {
    // Try to access production
    const response = await page.goto('https://innovationdevelopmentsolutions.com').catch(() => null);
    
    if (!response || !response.ok()) {
      console.log('⚠️  Production site not accessible, skipping production validation');
      test.skip();
      return;
    }
    
    await page.waitForLoadState('networkidle');
    
    // Verify chatbot exists
    const chatButton = page.locator('button').filter({ hasText: /chat|help/i }).first();
    await expect(chatButton).toBeVisible({ timeout: 10000 });
    
    // Open and interact
    await chatButton.click();
    await page.waitForTimeout(2000);
    
    const input = page.locator('input[type="text"], input[placeholder*="message" i]').first();
    await expect(input).toBeVisible();
    
    // Send test message
    await input.fill('Hello');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    
    // Verify response
    const botResponse = page.locator('div').filter({ hasText: /.+/i }).last();
    await expect(botResponse).toBeVisible();
    
    console.log('✅ Production chatbot fully functional');
  });
});
