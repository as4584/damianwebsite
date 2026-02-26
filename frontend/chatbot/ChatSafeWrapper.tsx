/**
 * Chat Safe Wrapper
 * Isolates chat widget failures from main app render
 * Ensures app always loads even if chat fails
 */

'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ChatWidget from './components/ChatWidget';

export default function ChatSafeWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('🔵 ChatSafeWrapper mounted');
  }, []);

  // Only render on client
  if (!mounted) {
    console.log('⏳ Waiting for client mount...');
    return null;
  }

  console.log('🚀 Rendering chat to body');

  // Render directly to body using portal
  return createPortal(
    <ChatWidget />,
    document.body
  );
}
