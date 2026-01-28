/**
 * Intent Extraction Utility Tests
 */

import { 
  extractIntent, 
  extractKeyInfo,
  summarizeConversation 
} from '../utils/intentExtraction';
import { ConversationMessage } from '../types';

describe('Intent Extraction', () => {
  describe('extractIntent', () => {
    it('should identify sales intent from buying signals', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'I want to start an LLC for my business', timestamp: new Date() }
      ];
      
      expect(extractIntent(conversation)).toBe('sales');
    });

    it('should identify booking intent from scheduling requests', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'Can I schedule a consultation?', timestamp: new Date() }
      ];
      
      expect(extractIntent(conversation)).toBe('booking');
    });

    it('should identify question intent from inquiry patterns', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'What is the difference between LLC and Corporation?', timestamp: new Date() }
      ];
      
      expect(extractIntent(conversation)).toBe('question');
    });

    it('should identify support intent from help requests', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'I have a problem with my existing filing', timestamp: new Date() }
      ];
      
      expect(extractIntent(conversation)).toBe('support');
    });

    it('should return unknown for ambiguous messages', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'hello', timestamp: new Date() }
      ];
      
      expect(extractIntent(conversation)).toBe('unknown');
    });
  });

  describe('extractKeyInfo', () => {
    it('should extract business type from conversation', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'I want to start a consulting business', timestamp: new Date() }
      ];
      
      const info = extractKeyInfo(conversation);
      expect(info.businessType).toBeDefined();
    });

    it('should extract timeline from conversation', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'I need this done by next week', timestamp: new Date() }
      ];
      
      const info = extractKeyInfo(conversation);
      expect(info.timeline).toBeDefined();
    });

    it('should extract location from conversation', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'I am based in California', timestamp: new Date() }
      ];
      
      const info = extractKeyInfo(conversation);
      expect(info.location).toBe('California');
    });
  });

  describe('summarizeConversation', () => {
    it('should create business-friendly summary', () => {
      const conversation: ConversationMessage[] = [
        { role: 'bot', content: 'Hello! How can I help you?', timestamp: new Date() },
        { role: 'user', content: 'I want to start an LLC in Texas', timestamp: new Date() },
        { role: 'bot', content: 'Great! I can help with that.', timestamp: new Date() }
      ];
      
      const summary = summarizeConversation(conversation);
      
      expect(summary).not.toContain('session');
      expect(summary).not.toContain('transcript');
      expect(summary.toLowerCase()).toContain('llc');
    });

    it('should not include technical jargon', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'Help me please', timestamp: new Date() }
      ];
      
      const summary = summarizeConversation(conversation);
      
      expect(summary).not.toContain('logs');
      expect(summary).not.toContain('sessions');
    });
  });
});
