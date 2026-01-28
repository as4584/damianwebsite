/**
 * Chat Bubble Component
 * Floating chat button that opens the chat modal
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface ChatBubbleProps {
  onClick: () => void;
  isOpen: boolean;
  hasUnread?: boolean;
}

export default function ChatBubble({ onClick, isOpen, hasUnread = false }: ChatBubbleProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ ChatBubble rendered - should be visible at bottom-right');
    }
  }, []);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-5 right-5 z-[10000] w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 active:scale-95"
      aria-label={isOpen ? "Close chat" : "Open chat"}
      style={{ 
        pointerEvents: 'auto',
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10000
      }}
    >
          {/* Icon changes based on state */}
          {isOpen ? (
            // Close X icon when open
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Chat icon when closed
            <svg
              className="w-7 h-7"
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
