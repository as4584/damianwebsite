/**
 * DEBUG TEST - Figure out why chatbot isn't visible
 */

import { test, expect } from '@playwright/test';

test('DEBUG: What is actually on the page?', async ({ page }) => {
  // Enable console logging
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:3001');
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
    console.log(`Button ${i}: text="${text}" aria-label="${ariaLabel}" class="${classes?.substring(0, 50)}..."`);
  }
  
  // Look for fixed positioned elements (chat bubble should be fixed)
  const fixedElements = await page.locator('[class*="fixed"]').all();
  console.log(`\nFound ${fixedElements.length} fixed position elements`);
  
  for (let i = 0; i < Math.min(fixedElements.length, 10); i++) {
    const tagName = await fixedElements[i].evaluate(el => el.tagName);
    const text = await fixedElements[i].textContent();
    const ariaLabel = await fixedElements[i].getAttribute('aria-label');
    console.log(`Fixed ${i}: <${tagName}> text="${text?.substring(0, 30)}" aria-label="${ariaLabel}"`);
  }
  
  // Check for z-index 10000 (chatbot has z-[10000])
  const highZIndex = await page.locator('[style*="z-index"]').all();
  console.log(`\nFound ${highZIndex.length} elements with z-index`);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/debug-page-full.png', fullPage: true });
  console.log('\n✅ Screenshot saved to test-results/debug-page-full.png');
  
  // Check bottom-right corner specifically (where chat should be)
  const bottomRight = await page.locator('button').filter({
    has: page.locator('svg')
  }).all();
  console.log(`\nFound ${bottomRight.length} buttons with SVG icons`);
  
  // List all elements at bottom-right
  const bottomRightEls = await page.evaluate(() => {
    const els = document.elementsFromPoint(window.innerWidth - 50, window.innerHeight - 50);
    return els.map(el => ({
      tag: el.tagName,
      class: el.className,
      text: el.textContent?.substring(0, 30)
    }));
  });
  console.log('\nElements at bottom-right corner:', JSON.stringify(bottomRightEls, null, 2));
});
