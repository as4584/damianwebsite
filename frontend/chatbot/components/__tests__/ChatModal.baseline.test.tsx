/**
 * STEP 1: Baseline Visual Test
 * 
 * This test verifies that the rendering pipeline works by asserting
 * that a message is visible when the modal opens.
 * 
 * Per contract: "If you can see this, rendering works."
 */

import { render, screen, waitFor } from '@testing-library/react';
import ChatModal from '../ChatModal';
import { act } from 'react-dom/test-utils';

describe('ChatModal - Baseline Rendering', () => {
  beforeEach(() => {
    // Mock fetch to return our baseline test message
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          message: 'If you can see this, rendering works.',
          nextState: 'INTENT_DETECTION',
          sessionData: { conversationHistory: [] }
        })
      } as Response)
    );
  });

  it('should render a message when modal is open', async () => {
    // Arrange & Act: Render the modal in open state
    render(<ChatModal isOpen={true} onClose={() => {}} />);
    
    // Assert: A message should be visible after initialization
    // This verifies the rendering pipeline works
    await waitFor(() => {
      const testMessage = screen.getByText(/if you can see this, rendering works/i);
      expect(testMessage).toBeInTheDocument();
      
      // Verify it's in a message bubble with proper styling
      const messageBubble = testMessage.closest('.rounded-2xl');
      expect(messageBubble).toBeInTheDocument();
      expect(messageBubble).toHaveClass('bg-white'); // Bot message styling
    }, { timeout: 2000 });
  });
  
  it('should not render anything when modal is closed', () => {
    // Arrange: Render the modal in closed state
    const { container } = render(<ChatModal isOpen={false} onClose={() => {}} />);
    
    // Assert: Nothing should be rendered
    expect(container.firstChild).toBeNull();
  });
});
