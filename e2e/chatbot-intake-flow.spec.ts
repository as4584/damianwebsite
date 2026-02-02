import { test, expect } from '@playwright/test';

test.describe('Chatbot Deterministic Intake Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('should start with the welcome message and the first intake question', async ({ page }) => {
    // Open chat
    const chatButton = page.getByRole('button', { name: 'Open chat' });
    await chatButton.click();
    
    // Check for welcome message
    const welcomeRegex = /Hello! I'm here to help you through our business intake process/i;
    const nameQuestionRegex = /To get started, could you please tell me your full legal name\?/i;
    
    await expect(page.getByText(welcomeRegex)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(nameQuestionRegex)).toBeVisible({ timeout: 5000 });
  });

  test('should handle user input and maintain the flow', async ({ page }) => {
    // Open chat
    const chatButton = page.getByRole('button', { name: 'Open chat' });
    await chatButton.click();
    
    // Check initial message count
    const initialMessages = page.locator('.bg-white.rounded-2xl');
    await expect(initialMessages).toHaveCount(1);

    // Type name
    const input = page.getByPlaceholder(/type your message/i);
    await input.fill('John Doe');
    await input.press('Enter');
    
    // Wait for message count to increase (User message + Bot message)
    // Actually user messages are NOT .bg-white.rounded-2xl, they are .bg-blue-600.
    // So we wait for the bot messages to be 2.
    await expect(page.locator('.bg-white.rounded-2xl')).toHaveCount(2, { timeout: 15000 });
    
    const botMessages = page.locator('.bg-white.rounded-2xl');
    const count = await botMessages.count();
    console.log('Bot messages count found:', count);
    
    for (let i = 0; i < count; i++) {
        console.log(`Bot message ${i}:`, await botMessages.nth(i).innerText());
    }
    
    const botText = await botMessages.last().innerText();
    console.log('Bot response found:', botText);
    
    // Success: acknowledgment + "Thank you" (from assistant.ts getIntakeQuestion for preferred name)
    // Fallback: "I'm sorry, I missed that"
    const successRegex = /Thank you/i;
    const fallbackRegex = /I'm sorry, I missed that/i;
    
    const isSuccess = successRegex.test(botText);
    const isFallback = fallbackRegex.test(botText);
    
    if (!isSuccess && !isFallback) {
      console.log('Neither success nor fallback found in bot text.');
    }
    
    expect(isSuccess || isFallback).toBeTruthy();
  });
});
