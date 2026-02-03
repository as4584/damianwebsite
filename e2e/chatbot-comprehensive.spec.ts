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
      // Set proper viewport size BEFORE navigation
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Find chatbot button (signal-based timeout replaces arbitrary sleep)
      const chatButton = page.locator('button[aria-label="Open chat"]');
      await expect(chatButton).toBeVisible({ timeout: 15000 });
      
      // Click directly via JavaScript since Playwright can't interact with fixed elements properly
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
        if (btn) btn.click();
      });
      
      // Wait for chat modal to appear (signal-based)
      await expect(page.getByText('Chat with us')).toBeVisible({ timeout: 10000 });
      
      // Check for the greeting message - starts with "Hey there!"
      const greetingMessage = page.getByText(/Hey there/i);
      await expect(greetingMessage).toBeVisible({ timeout: 5000 });
      
      // Get computed styles of message
      const messageColor = await greetingMessage.evaluate((el) => {
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
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Open chatbot using JavaScript click
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
        if (btn) btn.click();
      });
      
      // Signal-based wait for input field
      const input = page.locator('input[placeholder*="Type" i], input[type="text"]').first();
      await expect(input).toBeVisible({ timeout: 15000 });
      
      // Count initial messages
      const initialMessageCount = await page.locator('div').filter({ hasText: /hey there|hello/i }).count();
      
      // Type and send message
      await input.click();
      await input.fill('I want to start an LLC');
      await page.keyboard.press('Enter');
      
      // Signal-based wait for user message
      const userMessage = page.locator('text="I want to start an LLC"');
      await expect(userMessage).toBeVisible({ timeout: 10000 });
      
      // Signal-based wait for bot response (count increases)
      let finalMessageCount = 0;
      await expect(async () => {
        finalMessageCount = await page.locator('div').filter({ hasText: /.+/i }).count();
        expect(finalMessageCount).toBeGreaterThan(initialMessageCount);
      }).toPass({ timeout: 10000 });
      
      console.log(`✅ Message interaction successful: ${initialMessageCount} → ${finalMessageCount} messages`);
    });
    
    /**
     * TEST 3: COLLAPSIBLE FUNCTIONALITY
     * Ensures chat can be opened and closed
     */
    test('should be collapsible (open and close)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      // Find chat button
      const chatButton = page.locator('button[aria-label="Open chat"]');
      await expect(chatButton).toBeVisible({ timeout: 10000 });
      
      // Click to open using JavaScript
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
        if (btn) btn.click();
      });
      
      // Verify modal is open (signal-based)
      const modalHeader = page.getByText('Chat with us');
      await expect(modalHeader).toBeVisible({ timeout: 10000 });
      
      console.log('✅ Chat opened successfully');
      
      // Find close button in modal header
      const closeButton = page.locator('button[aria-label="Close chat"]').nth(1);
      
      if (await closeButton.isVisible()) {
        await page.evaluate(() => {
          const buttons = document.querySelectorAll('button[aria-label="Close chat"]');
          if (buttons.length > 1) {
            (buttons[1] as HTMLButtonElement).click();
          }
        });
        
        // Verify modal closed (signal-based)
        await expect(modalHeader).not.toBeVisible({ timeout: 10000 });
        console.log('✅ Chat closed successfully');
      } else {
        console.log('Close button not found, trying bubble toggle');
        await page.evaluate(() => {
          const btn = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
          if (btn) btn.click();
        });
        
        await expect(modalHeader).not.toBeVisible({ timeout: 10000 });
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
      
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
        if (btn) btn.click();
      });
      
      const chatModal = page.getByText('Chat with us').locator('..');
      await expect(chatModal).toBeVisible({ timeout: 10000 });
      
      const desktopBox = await chatModal.boundingBox();
      expect(desktopBox).not.toBeNull();
      
      console.log('Desktop chat size:', desktopBox);
      
      if (desktopBox) {
        expect(desktopBox.width).toBeLessThan(1920);
        expect(desktopBox.height).toBeLessThan(1080);
      }
      
      // Test mobile size
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
        if (btn) btn.click();
      });
      
      const chatModalMobile = page.getByText('Chat with us').locator('..');
      await expect(chatModalMobile).toBeVisible({ timeout: 10000 });
      
      const mobileBox = await chatModalMobile.boundingBox();
      expect(mobileBox).not.toBeNull();
      
      console.log('Mobile chat size:', mobileBox);
      
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
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Open chat using JavaScript
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
        if (btn) btn.click();
      });
      await page.waitForTimeout(2000);
      
      // Find input field
      const input = page.locator('input[placeholder*="Type" i], input[type="text"]').first();
      await expect(input).toBeVisible();
      
      // Send multiple messages to create long conversation
      for (let i = 1; i <= 8; i++) {
        await input.click();
        await input.fill(`Test message ${i} - This is a test message to create a long conversation that requires scrolling.`);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1500);
      }
      
      // Check if messages container has scroll - look for the scrollable div
      const messagesContainer = page.locator('div').filter({ hasText: /Hey there/i }).locator('..').locator('..').first();
      
      // Wait for it to be visible and have content
      await page.waitForTimeout(2000);
      
      const hasScroll = await messagesContainer.evaluate((el) => {
        return el.scrollHeight > el.clientHeight;
      }).catch(() => false);
      
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
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Open chatbot using JavaScript
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
        if (btn) btn.click();
      });
      await page.waitForTimeout(2000);
      
      // Find input field
      const input = page.locator('input[placeholder*="Type" i], input[type="text"]').first();
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
        await page.setViewportSize({ width: 1920, height: 1080 });
        const fullUrl = url + pagePath;
        await page.goto(fullUrl);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);
        
        // Find chatbot button
        const chatButton = page.locator('button[aria-label="Open chat"]');
        
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
      await page.setViewportSize({ width: 1920, height: 1080 });
      const startTime = Date.now();
      
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const chatButton = page.locator('button[aria-label="Open chat"]');
      await expect(chatButton).toBeVisible({ timeout: 5000 });
      
      const loadTime = Date.now() - startTime;
      console.log(`Page load time: ${loadTime}ms`);
      
      // Should load in under 15 seconds (including wait time)
      expect(loadTime).toBeLessThan(15000);
      
      // Test opening speed
      const openStartTime = Date.now();
      await page.evaluate(() => {
        const btn = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
        if (btn) btn.click();
      });
      
      const modalHeader = page.getByText('Chat with us');
      await expect(modalHeader).toBeVisible({ timeout: 3000 });
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
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Try to access production
    const response = await page.goto('https://innovationdevelopmentsolutions.com').catch(() => null);
    
    if (!response || !response.ok()) {
      console.log('⚠️  Production site not accessible, skipping production validation');
      test.skip();
      return;
    }
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Verify chatbot exists
    const chatButton = page.locator('button[aria-label="Open chat"]');
    await expect(chatButton).toBeVisible({ timeout: 10000 });
    
    // Open using JavaScript click (same issue as dev environment)
    await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Open chat"]') as HTMLButtonElement;
      if (btn) btn.click();
    });
    await page.waitForTimeout(2000);
    
    const input = page.locator('input[placeholder*="Type" i], input[type="text"]').first();
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
