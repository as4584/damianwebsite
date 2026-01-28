/**
 * Action Suggestion Tests
 */

import { suggestNextAction, getActionPriority } from '../utils/actionSuggestion';
import { Lead, LeadHotness } from '../types';

describe('Action Suggestion', () => {
  describe('suggestNextAction', () => {
    const createMockLead = (overrides: Partial<Lead>): Lead => ({
      id: 'test-lead',
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      intent: 'sales',
      hotness: 'warm',
      hotnessFactors: [],
      source: { page: '/services' },
      conversation: [],
      extractedInfo: {},
      suggestedAction: { type: 'call', label: '', reason: '', priority: 'medium' },
      internalNotes: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides
    });

    it('should suggest calling for hot leads with phone', () => {
      const lead = createMockLead({
        hotness: 'hot',
        phone: '555-1234'
      });
      
      const action = suggestNextAction(lead);
      
      expect(action.type).toBe('call');
      expect(action.priority).toBe('high');
    });

    it('should suggest email for hot leads without phone', () => {
      const lead = createMockLead({
        hotness: 'hot',
        phone: null
      });
      
      const action = suggestNextAction(lead);
      
      expect(action.type).toBe('email');
    });

    it('should suggest follow-up for warm leads', () => {
      const lead = createMockLead({
        hotness: 'warm'
      });
      
      const action = suggestNextAction(lead);
      
      expect(['email', 'follow_up']).toContain(action.type);
      expect(action.priority).toBe('medium');
    });

    it('should suggest waiting for cold leads', () => {
      const lead = createMockLead({
        hotness: 'cold',
        intent: 'unknown'
      });
      
      const action = suggestNextAction(lead);
      
      expect(['wait', 'email']).toContain(action.type);
      expect(action.priority).toBe('low');
    });

    it('should suggest scheduling for booking intent', () => {
      const lead = createMockLead({
        intent: 'booking',
        hotness: 'warm'
      });
      
      const action = suggestNextAction(lead);
      
      expect(action.type).toBe('schedule');
    });

    it('should provide clear, business-friendly labels', () => {
      const lead = createMockLead({ hotness: 'hot' });
      const action = suggestNextAction(lead);
      
      expect(action.label.length).toBeGreaterThan(5);
      expect(action.reason.length).toBeGreaterThan(10);
    });
  });

  describe('getActionPriority', () => {
    it('should return high for hot leads', () => {
      expect(getActionPriority('hot')).toBe('high');
    });

    it('should return medium for warm leads', () => {
      expect(getActionPriority('warm')).toBe('medium');
    });

    it('should return low for cold leads', () => {
      expect(getActionPriority('cold')).toBe('low');
    });
  });
});
