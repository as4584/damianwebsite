/**
 * Chat Widget Portal
 * Ensures chat widget renders directly to document.body to avoid layout issues
 */

'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ChatWidget from './ChatWidget';

export default function ChatWidgetPortal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ ChatWidgetPortal mounted');
    }
  }, []);

  if (!mounted) {
    if (process.env.NODE_ENV === 'development') {
      console.log('⏳ ChatWidgetPortal waiting for client mount...');
    }
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Creating portal to document.body');
  }

  return createPortal(
    <ChatWidget />,
    document.body
  );
}
