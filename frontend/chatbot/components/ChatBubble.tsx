/**
 * Chat Bubble Component
 * Floating chat button that opens the chat modal
 */

'use client';

import { useEffect } from 'react';

interface ChatBubbleProps {
  onClick: () => void;
  isOpen: boolean;
  hasUnread?: boolean;
}

export default function ChatBubble({ onClick, isOpen, hasUnread = false }: ChatBubbleProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ ChatBubble rendered - should be visible at bottom-right');
    }
  }, []);
  
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 w-14 h-14 sm:w-16 sm:h-16 bg-primary-900 text-white rounded-full shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-900 focus:ring-offset-2 transition-colors duration-200 touch-manipulation"
      aria-label={isOpen ? "Close chat" : "Open chat"}
      style={{ 
        pointerEvents: 'auto',
        WebkitTapHighlightColor: 'transparent',
        zIndex: 10000,
        width: '56px',
        height: '56px'
      }}
    >
          {/* Icon changes based on state */}
          {isOpen ? (
            // Close X icon when open
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Chat icon when closed
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          )}
          
          {/* Unread indicator */}
          {hasUnread && (
            <span
              className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
            />
          )}
    </button>
  );
}
