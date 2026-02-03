/**
 * VISUAL VALIDATION TEST
 * Ensures chatbot is actually visible and correctly positioned for real users
 */

import { test, expect } from '@playwright/test';

const TEST_URLS = [
  { name: 'Development', url: 'http://localhost:3001' },
  { name: 'Production', url: 'https://innovationdevelopmentsolutions.com' }
];

for (const { name, url } of TEST_URLS) {
  test.describe(`Chatbot Visual Validation - ${name}`, () => {
    
    test('should render with correct size and position', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(url);
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000); // Wait for full hydration
      
      // Find the chat button
      const chatButton = page.locator('button[aria-label="Open chat"]');
      await expect(chatButton).toBeVisible({ timeout: 10000 });
      
      // Get actual rendered dimensions and position
      const box = await chatButton.boundingBox();
      expect(box).not.toBeNull();
      
      if (box) {
        console.log(`\n=== ${name} Chat Button Dimensions ===`);
        console.log(`Position: x=${box.x}, y=${box.y}`);
        console.log(`Size: ${box.width}x${box.height}px`);
        console.log(`Expected: 56-64px square at bottom-right`);
        
        // Button should be at least 50px wide/tall (accounting for mobile/desktop difference)
        expect(box.width).toBeGreaterThanOrEqual(50);
        expect(box.height).toBeGreaterThanOrEqual(50);
        
        // Button should be in right portion of screen (x > 50% of viewport)
        expect(box.x).toBeGreaterThan(1920 / 2);
        
        // Button should be in bottom portion of screen (y > 70% of viewport)
        expect(box.y).toBeGreaterThan(1080 * 0.7);
        
        // Button should be near bottom-right corner
        const distanceFromRight = 1920 - (box.x + box.width);
        const distanceFromBottom = 1080 - (box.y + box.height);
        
        console.log(`Distance from right edge: ${distanceFromRight}px`);
        console.log(`Distance from bottom edge: ${distanceFromBottom}px`);
        
        // Should be within 50px of corner (16px + button size)
        expect(distanceFromRight).toBeLessThan(50);
        expect(distanceFromBottom).toBeLessThan(50);
      }
      
      // Check computed styles
      const styles = await chatButton.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          position: computed.position,
          bottom: computed.bottom,
          right: computed.right,
          width: computed.width,
          height: computed.height,
          zIndex: computed.zIndex,
          backgroundColor: computed.backgroundColor,
          borderRadius: computed.borderRadius,
          opacity: computed.opacity,
        };
      });
      
      console.log('\n=== Computed Styles ===');
      console.log(JSON.stringify(styles, null, 2));
      
      // Validate styles
      expect(styles.position).toBe('fixed');
      expect(styles.display).not.toBe('none');
      expect(styles.opacity).not.toBe('0');
      expect(parseInt(styles.zIndex)).toBeGreaterThanOrEqual(10000);
      
      // Take screenshot for manual verification
      await page.screenshot({ 
        path: `test-results/chatbot-visual-${name.toLowerCase()}.png`,
        fullPage: false // Just viewport
      });
      
      console.log(`\n✅ Screenshot saved: chatbot-visual-${name.toLowerCase()}.png`);
    });
    
    test('should not be covered by other elements', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(url);
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000);
      
      const chatButton = page.locator('button[aria-label="Open chat"]');
      await expect(chatButton).toBeVisible();
      
      // Get button position
      const box = await chatButton.boundingBox();
      expect(box).not.toBeNull();
      
      if (box) {
        // Check what element is at the center of the button
        const centerX = box.x + box.width / 2;
        const centerY = box.y + box.height / 2;
        
        const elementAtPoint = await page.evaluate(([x, y]) => {
          const el = document.elementFromPoint(x, y);
          const button = el?.closest('button');
          return {
            tagName: el?.tagName,
            buttonTagName: button?.tagName,
            className: el?.className,
            ariaLabel: el?.getAttribute('aria-label') || button?.getAttribute('aria-label'),
            zIndex: window.getComputedStyle(el!).zIndex
          };
        }, [centerX, centerY]);
        
        console.log('\n=== Element at button center ===');
        console.log(JSON.stringify(elementAtPoint, null, 2));
        
        // The element at the center should be the button itself (or one of its children like SVG path)
        expect(elementAtPoint.buttonTagName || elementAtPoint.tagName).toBe('BUTTON');
        expect(elementAtPoint.ariaLabel).toContain('chat');
      }
    });
    
    test('should be clickable by real users', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(url);
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000);
      
      const chatButton = page.locator('button[aria-label="Open chat"]');
      await expect(chatButton).toBeVisible();
      
      // Try to click using normal user interaction (not force)
      // This will fail if the button is not actually clickable
      await chatButton.click({ timeout: 5000 });
      
      // Verify modal opened
      await page.waitForTimeout(1000);
      const modalHeader = page.getByText('Chat with us');
      await expect(modalHeader).toBeVisible({ timeout: 5000 });
      
      console.log('✅ Button is clickable with normal user interaction');
    });
    
    test('should have proper CSS loaded', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(url);
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000);
      
      // Check if Tailwind classes are working
      const chatButton = page.locator('button[aria-label="Open chat"]');
      await expect(chatButton).toBeVisible();
      
      const hasGradient = await chatButton.evaluate((el) => {
        const bg = window.getComputedStyle(el).backgroundImage;
        return bg.includes('gradient');
      });
      
      console.log(`\n=== CSS Validation ===`);
      console.log(`Has gradient background: ${hasGradient}`);
      
      expect(hasGradient).toBe(true);
      
      // Check shadow
      const hasShadow = await chatButton.evaluate((el) => {
        const shadow = window.getComputedStyle(el).boxShadow;
        return shadow !== 'none';
      });
      
      console.log(`Has box shadow: ${hasShadow}`);
      expect(hasShadow).toBe(true);
    });
    
    test('should be visible on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(url);
      await page.waitForLoadState('load');
      await page.waitForTimeout(5000);
      
      const chatButton = page.locator('button[aria-label="Open chat"]');
      await expect(chatButton).toBeVisible();
      
      const box = await chatButton.boundingBox();
      expect(box).not.toBeNull();
      
      if (box) {
        console.log(`\n=== Mobile (375x667) ===`);
        console.log(`Size: ${box.width}x${box.height}px`);
        console.log(`Position: x=${box.x}, y=${box.y}`);
        
        // Should still be at least 50px
        expect(box.width).toBeGreaterThanOrEqual(50);
        expect(box.height).toBeGreaterThanOrEqual(50);
        
        // Should be in right portion (x > 50%)
        expect(box.x).toBeGreaterThan(375 / 2);
        
        // Should be in bottom portion (y > 70%)
        expect(box.y).toBeGreaterThan(667 * 0.7);
      }
      
      await page.screenshot({ 
        path: `test-results/chatbot-mobile-${name.toLowerCase()}.png`
      });
    });
    
  });
}
