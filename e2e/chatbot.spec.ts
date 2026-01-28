/**
 * E2E Visual Tests for Chatbot
 * 
 * Per CHATBOT_ENGINEERING_CONTRACT.md Version 1.3 (HARDENED)
 * 
 * HUMAN-VISIBLE UI DEFINITION:
 * - Widget is on-screen within viewport
 * - Widget is visually unobstructed (not behind layers, overlays, z-index issues)
 * - Widget is interactable by REAL pointer (no page.evaluate() allowed)
 * - Modal opens on click and is visually on top
 * - Input accepts keyboard focus and typing
 * 
 * CRITICAL: These tests must use REAL user interactions (click, type, focus)
 * NOT JavaScript execution (page.evaluate()) or DOM manipulation.
 */

import { test, expect } from '@playwright/test';

test.describe('Chatbot Human Usability Tests (Contract v1.3)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('HUMAN USABILITY TEST 1: Chat widget is visibly rendered and clickable by a human', async ({ page }) => {
    // REQUIREMENT 1: Widget is visible without scrolling, DOM inspection, or devtools
    const chatButton = page.getByRole('button', { name: 'Open chat' });
    await expect(chatButton).toBeVisible();
    
    // REQUIREMENT 2: Widget is on-screen in viewport (check bounding box)
    const boundingBox = await chatButton.boundingBox();
    expect(boundingBox).not.toBeNull();
    if (boundingBox) {
      expect(boundingBox.x).toBeGreaterThanOrEqual(0);
      expect(boundingBox.y).toBeGreaterThanOrEqual(0);
    }
    
    // REQUIREMENT 3: Widget is clickable with REAL pointer interaction (no page.evaluate)
    // This must work like a human would use it
    await chatButton.click();
    
    // REQUIREMENT 4: Modal opens and is visually on top
    const closeButton = page.getByRole('button', { name: 'Close chat' });
    await expect(closeButton).toBeVisible({ timeout: 2000 });
    
    // REQUIREMENT 5: Input accepts focus and keyboard typing
    const input = page.getByPlaceholder(/type your message/i);
    await expect(input).toBeVisible();
    await input.focus();
    await input.fill('Human test message');
    
    // Verify text was entered
    await expect(input).toHaveValue('Human test message');
  });

  test('HUMAN USABILITY TEST 2: User message appears as visible chat bubble after sending', async ({ page }) => {
    // Open chat with REAL click (no page.evaluate)
    const chatButton = page.getByRole('button', { name: 'Open chat' });
    await chatButton.click();
    
    // Wait for modal to open
    await expect(page.getByRole('button', { name: 'Close chat' })).toBeVisible({ timeout: 2000 });
    
    // Type and send message with REAL keyboard interaction
    const userMessage = 'I need help with business formation';
    const input = page.getByPlaceholder(/type your message/i);
    await input.fill(userMessage);
    await input.press('Enter');
    
    // REQUIREMENT: User message must be VISIBLY rendered
    await expect(page.getByText(userMessage)).toBeVisible({ timeout: 3000 });
    
    // Verify styling (user bubble should have blue background)
    const userBubble = page.locator('.bg-blue-500').filter({ hasText: userMessage });
    await expect(userBubble).toBeVisible();
  });

  test('HUMAN USABILITY TEST 3: Assistant response appears as visible chat bubble', async ({ page }) => {
    // Open chat with REAL click
    const chatButton = page.getByRole('button', { name: 'Open chat' });
    await chatButton.click();
    
    await expect(page.getByRole('button', { name: 'Close chat' })).toBeVisible({ timeout: 2000 });
    
    // Send message with REAL keyboard interaction
    const input = page.getByPlaceholder(/type your message/i);
    await input.fill('Hello');
    await input.press('Enter');
    
    // REQUIREMENT: Assistant response must be VISIBLY rendered
    // Wait for at least 2 bot messages (welcome + response)
    const botMessages = page.locator('.bg-white.rounded-2xl');
    await expect(botMessages.first()).toBeVisible();
    await page.waitForTimeout(1500); // Allow time for response
    const count = await botMessages.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('HUMAN USABILITY TEST 4: Chat works after page refresh (cold reload test)', async ({ page }) => {
    // Interact with chat using REAL interactions
    const chatButton = page.getByRole('button', { name: 'Open chat' });
    await chatButton.click();
    
    await expect(page.getByRole('button', { name: 'Close chat' })).toBeVisible({ timeout: 2000 });
    
    const input = page.getByPlaceholder(/type your message/i);
    await input.fill('Before refresh');
    await input.press('Enter');
    await page.waitForTimeout(1500);
    
    // Cold reload
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // REQUIREMENT: Chat must work after cold reload
    const chatButtonAfterRefresh = page.getByRole('button', { name: 'Open chat' });
    await expect(chatButtonAfterRefresh).toBeVisible();
    
    // Must be clickable with REAL interaction
    await chatButtonAfterRefresh.click();
    
    await expect(page.getByRole('button', { name: 'Close chat' })).toBeVisible({ timeout: 2000 });
    
    // Must accept input with REAL keyboard interaction
    const inputAfterRefresh = page.getByPlaceholder(/type your message/i);
    await inputAfterRefresh.fill('After refresh');
    await inputAfterRefresh.press('Enter');
    
    await expect(page.getByText('After refresh')).toBeVisible({ timeout: 3000 });
  });

  test('HUMAN USABILITY TEST 5: Chat works on different pages', async ({ page }) => {
    // Navigate to services page
    await page.goto('/services');
    await page.waitForLoadState('networkidle');
    
    // Chat button must be visible
    const chatButton = page.getByRole('button', { name: 'Open chat' });
    await expect(chatButton).toBeVisible();
    
    // Must be clickable with REAL interaction
    await chatButton.click();
    
    await expect(page.getByRole('button', { name: 'Close chat' })).toBeVisible({ timeout: 2000 });
    
    const input = page.getByPlaceholder(/type your message/i);
    await input.fill('Services page test');
    await input.press('Enter');
    
    await expect(page.getByText('Services page test')).toBeVisible({ timeout: 3000 });
  });

  test('COMPREHENSIVE HUMAN USABILITY TEST: Full conversation flow with visible messages', async ({ page }) => {
    // REQUIREMENT: Verify complete human usability from start to finish
    
    // 1. Widget must be visible on initial page load
    const chatButton = page.getByRole('button', { name: 'Open chat' });
    await expect(chatButton).toBeVisible();
    
    // Verify button is in viewport
    const box = await chatButton.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.y).toBeGreaterThanOrEqual(0);
      expect(box.y).toBeLessThan(page.viewportSize()!.height);
    }
    
    // 2. Click opens modal (REAL pointer interaction)
    await chatButton.click();
    await expect(page.getByRole('button', { name: 'Close chat' })).toBeVisible({ timeout: 2000 });
    
    // 3. Welcome message must be VISIBLY rendered
    await expect(page.getByText(/what brings you here today/i)).toBeVisible({ timeout: 5000 });
    
    // 4. Input must accept focus and typing
    const input = page.getByPlaceholder(/type your message/i);
    await expect(input).toBeVisible();
    await expect(input).toBeEditable();
    
    // 5. User message must appear as VISIBLE bubble after send
    await input.fill('I want to start a business');
    await input.press('Enter');
    await expect(page.getByText('I want to start a business')).toBeVisible({ timeout: 3000 });
    
    // 6. Assistant response must appear as VISIBLE bubble
    await page.waitForTimeout(2000); // Allow time for response
    const botMessages = page.locator('.bg-white.rounded-2xl');
    const messageCount = await botMessages.count();
    expect(messageCount).toBeGreaterThanOrEqual(2); // Welcome + at least one response
    
    // 7. Verify all messages are within viewport when scrolled into view
    const lastMessage = botMessages.last();
    await expect(lastMessage).toBeVisible();
    
    // HUMAN USABILITY VERIFICATION: Take screenshot to verify visual layout
    await page.screenshot({ path: 'test-results/human-usability-verification.png' });
  });
});
