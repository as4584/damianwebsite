/**
 * Lead Scoring Service Tests
 * TDD: Tests written first, then implementation
 */

import { 
  calculateLeadScore, 
  determineHotness, 
  getHotnessFactors,
  getHotnessExplanation,
  getDetailedHotnessExplanation 
} from '../services/scoringService';
import { Lead, ConversationMessage, LeadSource } from '../types';

describe('Lead Scoring Service', () => {
  describe('calculateLeadScore', () => {
    it('should return 0 for a lead with no engagement signals', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'hi', timestamp: new Date() }
      ];
      const source: LeadSource = { page: '/about' };
      
      const score = calculateLeadScore(conversation, source, { hasEmail: false, hasPhone: false });
      expect(score).toBe(0);
    });

    it('should add points for pricing inquiry', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'What are your prices?', timestamp: new Date() }
      ];
      const source: LeadSource = { page: '/services' };
      
      const score = calculateLeadScore(conversation, source, { hasEmail: false, hasPhone: false });
      expect(score).toBeGreaterThan(0);
    });

    it('should add points for availability check', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'When are you available for a meeting?', timestamp: new Date() }
      ];
      const source: LeadSource = { page: '/services' };
      
      const score = calculateLeadScore(conversation, source, { hasEmail: false, hasPhone: false });
      expect(score).toBeGreaterThan(0);
    });

    it('should add points when contact info is provided', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'hello', timestamp: new Date() }
      ];
      const source: LeadSource = { page: '/about' };
      
      const scoreWithEmail = calculateLeadScore(conversation, source, { hasEmail: true, hasPhone: false });
      const scoreWithPhone = calculateLeadScore(conversation, source, { hasEmail: false, hasPhone: true });
      const scoreWithBoth = calculateLeadScore(conversation, source, { hasEmail: true, hasPhone: true });
      
      expect(scoreWithEmail).toBeGreaterThan(0);
      expect(scoreWithPhone).toBeGreaterThan(0);
      // Contact provided only counts once (email OR phone)
      expect(scoreWithBoth).toBe(scoreWithEmail);
    });

    it('should add points for high-intent pages', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'hello', timestamp: new Date() }
      ];
      
      const pricingScore = calculateLeadScore(conversation, { page: '/pricing' }, { hasEmail: false, hasPhone: false });
      const contactScore = calculateLeadScore(conversation, { page: '/contact' }, { hasEmail: false, hasPhone: false });
      const aboutScore = calculateLeadScore(conversation, { page: '/about' }, { hasEmail: false, hasPhone: false });
      
      expect(pricingScore).toBeGreaterThan(aboutScore);
      expect(contactScore).toBeGreaterThan(aboutScore);
    });
  });

  describe('determineHotness', () => {
    it('should return "cold" for score below 25', () => {
      expect(determineHotness(0)).toBe('cold');
      expect(determineHotness(10)).toBe('cold');
      expect(determineHotness(24)).toBe('cold');
    });

    it('should return "warm" for score between 25 and 54', () => {
      expect(determineHotness(25)).toBe('warm');
      expect(determineHotness(40)).toBe('warm');
      expect(determineHotness(54)).toBe('warm');
    });

    it('should return "hot" for score 55 and above', () => {
      expect(determineHotness(55)).toBe('hot');
      expect(determineHotness(80)).toBe('hot');
      expect(determineHotness(100)).toBe('hot');
    });
  });

  describe('getHotnessFactors', () => {
    it('should identify pricing inquiry factor', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'How much does LLC formation cost?', timestamp: new Date() }
      ];
      
      const factors = getHotnessFactors(conversation, { page: '/services' }, { hasEmail: false, hasPhone: false });
      const pricingFactor = factors.find(f => f.type === 'pricing_inquiry');
      
      expect(pricingFactor).toBeDefined();
      expect(pricingFactor?.present).toBe(true);
    });

    it('should identify contact provided factor', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'hi', timestamp: new Date() }
      ];
      
      const factors = getHotnessFactors(conversation, { page: '/services' }, { hasEmail: true, hasPhone: true });
      const contactFactor = factors.find(f => f.type === 'contact_provided');
      
      expect(contactFactor).toBeDefined();
      expect(contactFactor?.present).toBe(true);
    });

    it('should not mark absent factors as present', () => {
      const conversation: ConversationMessage[] = [
        { role: 'user', content: 'hi', timestamp: new Date() }
      ];
      
      const factors = getHotnessFactors(conversation, { page: '/about' }, { hasEmail: false, hasPhone: false });
      
      factors.forEach(factor => {
        expect(factor.present).toBe(false);
      });
    });
  });

  describe('getHotnessExplanation', () => {
    it('should provide string explanation for hot leads', () => {
      const factors = [
        { type: 'pricing_inquiry' as const, name: 'Pricing Inquiry', description: 'Asked about pricing', present: true },
        { type: 'contact_provided' as const, name: 'Contact Provided', description: 'Provided contact information', present: true }
      ];
      
      const explanation = getHotnessExplanation('hot', factors);
      
      // getHotnessExplanation returns a string
      expect(typeof explanation).toBe('string');
      expect(explanation).toContain('highly engaged');
    });

    it('should mention factors in explanation', () => {
      const factors = [
        { type: 'pricing_inquiry' as const, name: 'Pricing Inquiry', description: 'Asked about pricing', present: true },
        { type: 'availability_check' as const, name: 'Availability Check', description: 'Checked availability', present: true },
        { type: 'contact_provided' as const, name: 'Contact Provided', description: 'Provided contact', present: false }
      ];
      
      const explanation = getHotnessExplanation('warm', factors);
      
      expect(explanation).toContain('Pricing Inquiry');
      expect(explanation).toContain('Availability Check');
      expect(explanation).not.toContain('Contact Provided');
    });

    it('should never include numeric scores in explanation', () => {
      const factors = [
        { type: 'pricing_inquiry' as const, name: 'Pricing Inquiry', description: 'Asked about pricing', present: true }
      ];
      
      const explanation = getHotnessExplanation('hot', factors);
      
      expect(explanation).not.toMatch(/\d+\s*points?/i);
      expect(explanation).not.toMatch(/score/i);
    });
  });

  describe('getDetailedHotnessExplanation', () => {
    it('should provide detailed explanation object', () => {
      const factors = [
        { type: 'pricing_inquiry' as const, name: 'Pricing Inquiry', description: 'Asked about pricing', present: true }
      ];
      
      const explanation = getDetailedHotnessExplanation('hot', factors);
      
      expect(explanation.title).toContain('Hot');
      expect(explanation.meaning).toBeDefined();
      expect(explanation.reasons.length).toBeGreaterThan(0);
      expect(explanation.recommendations).toBeDefined();
    });
  });
});
