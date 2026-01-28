/**
 * Chat Widget - Main wrapper component
 * Manages state and coordinates bubble + modal
 */

'use client';

import { useState, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ChatModal from './ChatModal';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ ChatWidget rendered');
    }
  }, []);
  
  const handleToggle = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setHasUnread(false);
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  return (
    <>
      <ChatBubble
        onClick={handleToggle}
        hasUnread={hasUnread}
        isOpen={isOpen}
      />
      
      <ChatModal
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
}
