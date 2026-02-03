/**
 * Dashboard Integration Tests
 * End-to-end tests for dashboard functionality
 */

import { 
  getLeads, 
  getLeadPreviews, 
  getLeadById, 
  updateLead,
  getDashboardMetrics,
  getLeadCounts 
} from '../services/leadService';
import { scoreLead, getHotnessExplanation } from '../services/scoringService';
import { extractIntent, extractKeyInfo, summarizeConversation } from '../utils/intentExtraction';
import { suggestNextAction, getActionPriority } from '../utils/actionSuggestion';

const TEST_BUSINESS_ID = 'biz_innovation_001';

describe('Dashboard Integration', () => {
  describe('Lead Pipeline', () => {
    it('should load leads with full scoring applied', async () => {
      const result = await getLeads(TEST_BUSINESS_ID);
      
      expect(result.success).toBe(true);
      expect(result.data!.length).toBeGreaterThan(0);
      
      result.data!.forEach(lead => {
        // Every lead should have hotness calculated
        expect(['hot', 'warm', 'cold']).toContain(lead.hotness);
        
        // Every lead should have factors
        expect(Array.isArray(lead.hotnessFactors)).toBe(true);
        
        // Every lead should have intent
        expect(['sales', 'booking', 'question', 'support', 'unknown']).toContain(lead.intent);
        
        // Every lead should have suggested action
        expect(lead.suggestedAction).toBeDefined();
        expect(lead.suggestedAction.type).toBeDefined();
        expect(lead.suggestedAction.label).toBeDefined();
      });
    });
    
    it('should maintain consistency between list and detail view', async () => {
      const listResult = await getLeads(TEST_BUSINESS_ID);
      const firstLead = listResult.data![0];
      
      const detailResult = await getLeadById(firstLead.id, TEST_BUSINESS_ID);
      
      expect(detailResult.success).toBe(true);
      expect(detailResult.data!.id).toBe(firstLead.id);
      expect(detailResult.data!.hotness).toBe(firstLead.hotness);
      expect(detailResult.data!.intent).toBe(firstLead.intent);
    });
    
    it('should persist note updates', async () => {
      const listResult = await getLeads(TEST_BUSINESS_ID);
      const leadId = listResult.data![0].id;
      
      const testNote = `Integration test note - ${Date.now()}`;
      
      const updateResult = await updateLead(leadId, TEST_BUSINESS_ID, { internalNotes: testNote });
      expect(updateResult.success).toBe(true);
      expect(updateResult.data!.internalNotes).toBe(testNote);
      
      // Verify persistence
      const verifyResult = await getLeadById(leadId, TEST_BUSINESS_ID);
      expect(verifyResult.data!.internalNotes).toBe(testNote);
    });
  });
  
  describe('Scoring Pipeline', () => {
    it('should never expose numeric scores in explanation', async () => {
      const result = await getLeads(TEST_BUSINESS_ID);
      
      result.data!.forEach(lead => {
        const explanation = getHotnessExplanation(lead.hotness, lead.hotnessFactors);
        
        // Should not contain numbers that look like scores
        expect(explanation).not.toMatch(/\d+ points?/i);
        expect(explanation).not.toMatch(/score of \d+/i);
        expect(explanation).not.toMatch(/scored \d+/i);
        
        // Should be human readable
        expect(explanation.length).toBeGreaterThan(20);
      });
    });
    
    it('should calculate hotness based on engagement signals', () => {
      const hotConversation = [
        { role: 'user' as const, content: 'How much does this cost?', timestamp: new Date() },
        { role: 'user' as const, content: 'Do you have availability tomorrow?', timestamp: new Date() }
      ];
      
      const coldConversation = [
        { role: 'user' as const, content: 'just browsing', timestamp: new Date() }
      ];
      
      const hotResult = scoreLead(
        hotConversation,
        { page: '/pricing' },
        'test@email.com',
        '555-1234'
      );
      
      const coldResult = scoreLead(
        coldConversation,
        { page: '/about' },
        null,
        null
      );
      
      expect(hotResult.hotness).toBe('hot');
      expect(coldResult.hotness).toBe('cold');
    });
  });
  
  describe('Intent Extraction Pipeline', () => {
    it('should extract intent from conversation context', () => {
      const salesConvo = [
        { role: 'user' as const, content: 'I want to buy your services', timestamp: new Date() }
      ];
      
      const bookingConvo = [
        { role: 'user' as const, content: 'Can I schedule an appointment?', timestamp: new Date() }
      ];
      
      expect(extractIntent(salesConvo)).toBe('sales');
      expect(extractIntent(bookingConvo)).toBe('booking');
    });
    
    it('should extract key business info', () => {
      const messages = [
        { role: 'user' as const, content: 'I need help with my restaurant in California ASAP', timestamp: new Date() }
      ];
      
      const keyInfo = extractKeyInfo(messages);
      
      expect(keyInfo.businessType).toBe('Food & Restaurant');
      expect(keyInfo.location).toBe('California');
      expect(keyInfo.timeline).toBe('Urgent (Today)');
    });
    
    it('should create business-friendly summaries', () => {
      const messages = [
        { role: 'bot' as const, content: 'Hello!', timestamp: new Date() },
        { role: 'user' as const, content: 'I want to start an LLC', timestamp: new Date() }
      ];
      
      const summary = summarizeConversation(messages);
      
      // Should not contain technical jargon
      expect(summary).not.toMatch(/session/i);
      expect(summary).not.toMatch(/transcript/i);
      expect(summary).not.toMatch(/log/i);
      
      // Should be readable
      expect(summary.length).toBeGreaterThan(10);
    });
  });
  
  describe('Action Suggestion Pipeline', () => {
    it('should suggest call for hot leads with phone', async () => {
      const result = await getLeads(TEST_BUSINESS_ID, { filter: 'hot' });
      
      result.data!.forEach(lead => {
        if (lead.phone) {
          expect(lead.suggestedAction.type).toBe('call');
          expect(lead.suggestedAction.priority).toBe('high');
        }
      });
    });
    
    it('should match priority to hotness', () => {
      expect(getActionPriority('hot')).toBe('high');
      expect(getActionPriority('warm')).toBe('medium');
      expect(getActionPriority('cold')).toBe('low');
    });
  });
  
  describe('Metrics Pipeline', () => {
    it('should return all required metrics', async () => {
      const result = await getDashboardMetrics(TEST_BUSINESS_ID);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('visits');
      expect(result.data).toHaveProperty('avgTimeSpent');
      expect(result.data).toHaveProperty('bounceRate');
      expect(result.data).toHaveProperty('leadConversions');
    });
    
    it('should have counts matching filtered leads', async () => {
      const countsResult = await getLeadCounts(TEST_BUSINESS_ID);
      const allLeadsResult = await getLeads(TEST_BUSINESS_ID, { filter: 'all' });
      
      const manualHot = allLeadsResult.data!.filter(l => l.hotness === 'hot').length;
      const manualWarm = allLeadsResult.data!.filter(l => l.hotness === 'warm').length;
      const manualCold = allLeadsResult.data!.filter(l => l.hotness === 'cold').length;
      
      expect(countsResult.data!.hot).toBe(manualHot);
      expect(countsResult.data!.warm).toBe(manualWarm);
      expect(countsResult.data!.cold).toBe(manualCold);
      expect(countsResult.data!.total).toBe(allLeadsResult.data!.length);
    });
  });
  
  describe('Data Consistency', () => {
    it('should have matching preview and full lead data', async () => {
      const previewsResult = await getLeadPreviews(TEST_BUSINESS_ID);
      const leadsResult = await getLeads(TEST_BUSINESS_ID);
      
      const previewIds = previewsResult.data!.map(p => p.id);
      const leadIds = leadsResult.data!.map(l => l.id);
      
      // All previews should have corresponding full leads
      previewIds.forEach(id => {
        expect(leadIds).toContain(id);
      });
    });
    
    it('should sync hotness between preview and lead', async () => {
      const previewsResult = await getLeadPreviews(TEST_BUSINESS_ID);
      
      for (const preview of previewsResult.data!) {
        const leadResult = await getLeadById(preview.id, TEST_BUSINESS_ID);
        expect(leadResult.data!.hotness).toBe(preview.hotness);
      }
    });
  });
});
