/**
 * Chatbot System - Main Export
 * Production-ready HubSpot-style chatbot
 */

export { default as ChatSafeWrapper } from './ChatSafeWrapper';
export { default as ChatWidget } from './components/ChatWidget';
export { default as ChatWidgetPortal } from './components/ChatWidgetPortal';
export { default as ChatBubble } from './components/ChatBubble';
export { default as ChatModal } from './components/ChatModal';

export { publicKB } from './kb/public';
export { internalKB } from './kb/internal';

export { messages } from './copy/messages';

export { detectIntent, extractBusinessType, extractLocation } from './logic/intents';
export { evaluateEscalation, getEscalationMessage, validateResponse } from './logic/gatekeeper';
export { routeConversation } from './logic/router';

export type { ConversationState, SessionData } from './logic/state';
export type { Intent } from './logic/intents';
export type { EscalationType } from './logic/gatekeeper';
