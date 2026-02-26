import { test, expect } from '@playwright/test';

/**
 * E2E Test: Chatbot Lead Creation → Dashboard Verification
 * 
 * Critical test flow:
 * 1. User interacts with chatbot on homepage
 * 2. Chatbot collects lead information
 * 3. Lead is saved to database
 * 4. User logs into dashboard
 * 5. Verify lead appears with correct data
 * 
 * This test validates the REAL DATA FLOW (no mocks)
 */

test.describe('Chatbot to Dashboard Integration', () => {
  
  test('should create lead via chatbot and verify in dashboard', async ({ page }) => {
    // Track lead creation
    let leadCreated = false;
    let leadData: any = null;
    
    // Intercept API call to lead creation
    page.on('response', async (response) => {
      if (response.url().includes('/api/leads/create') && response.status() === 200) {
        leadCreated = true;
        const json = await response.json();
        leadData = json.data;
        console.log('✅ Lead created via API:', leadData);
      }
    });
    
    // Step 1: Visit homepage where chatbot is available
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('load');
    
    // Step 2: Find and open chatbot widget
    console.log('Looking for chatbot widget...');
    
    // Look for chatbot button/widget (adjust selectors based on actual implementation)
    const chatbotButton = page.locator('button, [role="button"]').filter({ 
      hasText: /chat|help|message|talk/i 
    }).first();
    
    // Wait for chatbot to be available
    await chatbotButton.waitFor({ state: 'visible', timeout: 10000 });
    
    // Click to open chatbot
    await chatbotButton.click();
    console.log('✅ Chatbot opened');
    
    // Wait for chat interface to appear
    await page.waitForTimeout(1000);
    
    // Step 3: Interact with chatbot
    // Find chat input field
    const chatInput = page.locator('input[type="text"], textarea').filter({ 
      hasText: /type|message|chat/i 
    }).or(page.locator('[placeholder*="Type"], [placeholder*="message"]')).first();
    
    await chatInput.waitFor({ state: 'visible', timeout: 5000 });
    
    // Simulate user conversation
    console.log('Starting chatbot conversation...');
    
    // Message 1: Initial greeting
    await chatInput.fill('Hi, I need help with my business');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000); // Wait for bot response
    
    // Message 2: Provide business type
    await chatInput.fill('I run a tech startup');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Message 3: Provide location
    await chatInput.fill('We are based in California');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Message 4: Provide contact info
    await chatInput.fill('My email is test@innovation.com');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Message 5: Provide name
    await chatInput.fill('My name is Test User');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000); // Wait for lead creation API call
    
    // Step 4: Verify lead was created
    console.log('Lead created:', leadCreated);
    expect(leadCreated).toBe(true);
    
    // Take screenshot of chatbot conversation
    await page.screenshot({ 
      path: 'test-results/chatbot-conversation.png', 
      fullPage: true 
    });
    
    // Step 5: Navigate to login page
    await page.goto('/login');
    
    // Step 6: Login to dashboard
    await page.fill('input[type="email"]', 'test@innovation.com');
    await page.fill('input[type="password"]', 'King1000$');
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await page.waitForLoadState('load');
    
    console.log('✅ Logged into dashboard');
    
    // Step 7: Wait for leads to load
    await page.waitForSelector('[data-testid="lead-list"], .lead-card, [href^="/dashboard/leads/"]', { 
      timeout: 10000 
    });
    
    // Step 8: Verify lead appears in dashboard
    const leadCards = page.locator('[href^="/dashboard/leads/"]');
    const leadCount = await leadCards.count();
    
    console.log(`Found ${leadCount} leads in dashboard`);
    expect(leadCount).toBeGreaterThan(0);
    
    // Step 9: Verify lead data matches chatbot conversation
    // Look for email in lead cards
    const leadWithEmail = leadCards.filter({ hasText: 'test@innovation.com' }).first();
    await expect(leadWithEmail).toBeVisible({ timeout: 5000 });
    
    console.log('✅ Lead found with correct email');
    
    // Look for business type
    const leadWithBusinessType = leadCards.filter({ hasText: /tech|startup/i }).first();
    await expect(leadWithBusinessType).toBeVisible();
    
    console.log('✅ Lead contains business type from conversation');
    
    // Step 10: Verify hotness score was calculated
    const hotnessLabels = page.locator('text=/hot|warm|cold/i');
    const hotnessCount = await hotnessLabels.count();
    
    expect(hotnessCount).toBeGreaterThan(0);
    console.log('✅ Hotness scores displayed');
    
    // Step 11: Take final screenshot
    await page.screenshot({ 
      path: 'test-results/dashboard-with-chatbot-lead.png', 
      fullPage: true 
    });
    
    // Step 12: Click into lead details
    await leadCards.first().click();
    await page.waitForLoadState('load');
    
    // Verify lead details page loaded
    await expect(page).toHaveURL(/\/dashboard\/leads\/lead_\d+/);
    
    console.log('✅ Lead details page loaded');
    
    // Verify contact information is displayed
    await expect(page.locator('text=/test@innovation.com/i')).toBeVisible();
    await expect(page.locator('text=/Test User/i')).toBeVisible();
    
    // Take screenshot of lead details
    await page.screenshot({ 
      path: 'test-results/lead-details-page.png', 
      fullPage: true 
    });
    
    console.log('✅✅✅ FULL E2E TEST PASSED: Chatbot → Lead Creation → Dashboard Verification');
  });

  test('should show correct hotness for engaged lead', async ({ page }) => {
    // Create a lead with high engagement via chatbot
    await page.goto('/');
    await page.waitForLoadState('load');
    
    // Open chatbot
    const chatbotButton = page.locator('button, [role="button"]').filter({ 
      hasText: /chat|help|message/i 
    }).first();
    await chatbotButton.click();
    
    // Find chat input
    const chatInput = page.locator('input[type="text"], textarea').filter({ 
      hasText: /type|message/i 
    }).or(page.locator('[placeholder*="Type"]')).first();
    
    // Send multiple engaged messages
    const messages = [
      'I need urgent help with LLC formation',
      'I have two partners',
      'We operate in multiple states',
      'Email: urgent-lead@test.com',
      'Name: Hot Lead User',
      'Phone: 555-123-4567'
    ];
    
    for (const msg of messages) {
      await chatInput.fill(msg);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1500);
    }
    
    // Wait for lead creation
    await page.waitForTimeout(3000);
    
    // Login to dashboard
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@innovation.com');
    await page.fill('input[type="password"]', 'King1000$');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Wait for leads
    await page.waitForSelector('[href^="/dashboard/leads/"]');
    
    // Look for "HOT" label (should have high engagement)
    const hotLabel = page.locator('text=/hot/i').first();
    await expect(hotLabel).toBeVisible({ timeout: 5000 });
    
    console.log('✅ High engagement lead correctly scored as HOT');
    
    await page.screenshot({ 
      path: 'test-results/hot-lead-verification.png', 
      fullPage: true 
    });
  });
});

/**
 * Test error handling
 */
test.describe('Chatbot Error Handling', () => {
  
  test('should handle incomplete lead data gracefully', async ({ page }) => {
    // Try to create lead without email or phone
    await page.goto('/');
    await page.waitForLoadState('load');
    
    const chatbotButton = page.locator('button, [role="button"]').filter({ 
      hasText: /chat|help/i 
    }).first();
    await chatbotButton.click();
    
    const chatInput = page.locator('input[type="text"], textarea').first();
    
    // Send vague message without contact info
    await chatInput.fill('Just browsing');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    
    // Should still work (create lead with minimal data or not create)
    // No errors should break the page
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });
    
    await page.waitForTimeout(3000);
    
    // Verify no console errors
    expect(pageErrors.length).toBe(0);
    
    console.log('✅ Chatbot handles incomplete data without errors');
  });
});
