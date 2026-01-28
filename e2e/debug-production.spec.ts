/**
 * DEBUG TEST - Check production site for chatbot
 */

import { test, expect } from '@playwright/test';

test('DEBUG: Production chatbot check', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  console.log('=== Checking Production Site ===');
  await page.goto('https://innovationdevelopmentsolutions.com/');
  await page.waitForLoadState('networkidle');
  
  console.log('=== PAGE LOADED ===');
  
  // Wait for client-side hydration
  await page.waitForTimeout(5000);
  
  console.log('=== AFTER 5 SECOND WAIT ===');
  
  // Check for ANY buttons
  const allButtons = await page.locator('button').all();
  console.log(`Found ${allButtons.length} buttons on page`);
  
  for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
    const text = await allButtons[i].textContent();
    const ariaLabel = await allButtons[i].getAttribute('aria-label');
    const classes = await allButtons[i].getAttribute('class');
    console.log(`Button ${i}: text="${text}" aria-label="${ariaLabel}" class="${classes?.substring(0, 80)}"`);
  }
  
  // Look for "Open chat" specifically
  const chatButton = page.locator('button[aria-label="Open chat"]');
  const exists = await chatButton.count();
  console.log(`\nChat button with aria-label="Open chat": ${exists} found`);
  
  if (exists > 0) {
    const isVisible = await chatButton.isVisible();
    console.log(`Chat button is visible: ${isVisible}`);
    
    const box = await chatButton.boundingBox();
    console.log(`Chat button position:`, box);
  } else {
    console.log('❌ NO CHAT BUTTON FOUND ON PRODUCTION!');
  }
  
  // Check for ChatSafeWrapper or chatbot related divs
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  const hasChatSafeWrapper = bodyHTML.includes('ChatSafeWrapper') || bodyHTML.includes('chat-widget');
  console.log(`\nBody contains chatbot code: ${hasChatSafeWrapper}`);
  
  // Look for fixed positioned elements (chat bubble should be fixed)
  const fixedElements = await page.locator('[class*="fixed"]').all();
  console.log(`\nFound ${fixedElements.length} fixed position elements`);
  
  for (let i = 0; i < Math.min(fixedElements.length, 5); i++) {
    const tagName = await fixedElements[i].evaluate(el => el.tagName);
    const ariaLabel = await fixedElements[i].getAttribute('aria-label');
    console.log(`Fixed ${i}: <${tagName}> aria-label="${ariaLabel}"`);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/debug-production.png', fullPage: true });
  console.log('\n✅ Screenshot saved to test-results/debug-production.png');
  
  // Check build info
  const scripts = await page.locator('script[src]').all();
  console.log(`\nFound ${scripts.length} script tags`);
  for (let i = 0; i < Math.min(scripts.length, 3); i++) {
    const src = await scripts[i].getAttribute('src');
    if (src?.includes('static/chunks/app')) {
      console.log(`Script ${i}: ${src}`);
    }
  }
});
