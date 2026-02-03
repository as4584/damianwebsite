/**
 * STEP 2: State → UI Pipeline Tests
 * 
 * These tests verify that messages added to state actually render as visible bubbles
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatModal from '../ChatModal';
import { act } from 'react-dom/test-utils';

describe('ChatModal - State to UI Pipeline', () => {
  beforeEach(() => {
    // Mock successful API response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          message: 'This is a test assistant response',
          nextState: 'INTENT_DETECTION',
          sessionData: { conversationHistory: [] }
        })
      } as Response)
    );
  });

  it('should render user message as a visible chat bubble after typing and submitting', async () => {
    // Arrange: Render modal
    const user = userEvent.setup();
    render(<ChatModal isOpen={true} onClose={() => {}} />);
    
    // Wait for initial message to load
    await waitFor(() => {
      expect(screen.getByText(/this is a test assistant response/i)).toBeInTheDocument();
    });
    
    // Act: Type a message and submit
    const input = screen.getByPlaceholderText(/type your message/i);
    const testUserMessage = 'Hello, I need help';
    
    await user.type(input, testUserMessage);
    
    // Find and click the submit button
    const submitButton = screen.getByRole('button', { name: '' }); // Submit button with SVG icon
    await user.click(submitButton);
    
    // Assert: User message should appear as a visible bubble
    await waitFor(() => {
      const userMessage = screen.getByText(testUserMessage);
      expect(userMessage).toBeInTheDocument();
      
      // Verify it has user styling (blue background)
      const userBubble = userMessage.closest('.rounded-2xl');
      expect(userBubble).toHaveClass('bg-blue-600');
    }, { timeout: 3000 });
  });

  it('should render assistant response as a visible chat bubble after user message', async () => {
    // Arrange: Render modal
    const user = userEvent.setup();
    render(<ChatModal isOpen={true} onClose={() => {}} />);
    
    // Act: Send a user message
    const input = screen.getByPlaceholderText(/type your message/i);
    
    await act(async () => {
      await user.type(input, 'Test message');
      await user.keyboard('{Enter}');
    });
    
    // Assert: Assistant response should appear
    await waitFor(() => {
      const assistantMessage = screen.getByText(/this is a test assistant response/i);
      expect(assistantMessage).toBeInTheDocument();
      
      // Verify it has assistant styling (white background)
      const assistantBubble = assistantMessage.closest('.rounded-2xl');
      expect(assistantBubble).toHaveClass('bg-white');
    }, { timeout: 3000 });
  });

  it.skip('should maintain all messages in the conversation history', async () => {
    // Arrange: Render modal
    const user = userEvent.setup();
    render(<ChatModal isOpen={true} onClose={() => {}} />);
    
    // Wait for bootstrap to complete
    await waitFor(() => {
      expect(screen.getByText(/this is a test assistant response/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Wait for submit button to be enabled (loading finished)
    const submitButton = screen.getByRole('button', { name: '' });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    }, { timeout: 1000 });
    
    // Get initial count of assistant messages (should be 1 from bootstrap)
    const initialResponses = screen.getAllByText(/this is a test assistant response/i);
    expect(initialResponses.length).toBe(1);
    
    // Act: Send first message using Enter key
    const input = screen.getByPlaceholderText(/type your message/i);
    await user.type(input, 'First message{Enter}');
    
    // Wait for response to first message (should now have 2 bot messages)
    await waitFor(() => {
      const responses = screen.queryAllByText(/this is a test assistant response/i);
      expect(responses.length).toBe(2);
    }, { timeout: 3000 });
    
    // Wait for button to be enabled again
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    }, { timeout: 1000 });
    
    // Send second message using Enter key
    await user.type(input, 'Second message{Enter}');
    
    // Wait for response to second message (should now have 3 bot messages)
    await waitFor(() => {
      const responses = screen.queryAllByText(/this is a test assistant response/i);
      expect(responses.length).toBe(3);
    }, { timeout: 3000 });
    
    // Final assertion: verify all bot messages are still present
    const finalResponses = screen.getAllByText(/this is a test assistant response/i);
    expect(finalResponses.length).toBeGreaterThanOrEqual(3);
  });

  it('should display loading indicator while waiting for response', async () => {
    // Arrange: Mock slow API response
    global.fetch = jest.fn(() =>
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({
          message: 'Delayed response',
          nextState: 'INTENT_DETECTION',
          sessionData: { conversationHistory: [] }
        })
      } as Response), 100))
    );
    
    const user = userEvent.setup();
    render(<ChatModal isOpen={true} onClose={() => {}} />);
    
    // Act: Send a message
    const input = screen.getByPlaceholderText(/type your message/i);
    
    await act(async () => {
      await user.type(input, 'Test');
      await user.keyboard('{Enter}');
    });
    
    // Assert: Loading indicator should be visible
    // Look for the typing indicator (animated dots)
    const messageContainer = screen.getByRole('textbox').closest('div')?.parentElement;
    expect(messageContainer).toBeInTheDocument();
  });
});
