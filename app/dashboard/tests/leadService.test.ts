/**
 * Lead Service Tests
 * Tests for lead data layer operations
 */

import { 
  getLeads, 
  getLeadPreviews, 
  getLeadById, 
  updateLead, 
  getDashboardMetrics,
  getLeadCounts 
} from '../services/leadService';

const TEST_BUSINESS_ID = 'biz_innovation_001';

describe('Lead Service', () => {
  describe('getLeads', () => {
    it('should return all leads', async () => {
      const result = await getLeads(TEST_BUSINESS_ID);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data!.length).toBeGreaterThan(0);
    });
    
    it('should filter by hotness', async () => {
      const hotResult = await getLeads(TEST_BUSINESS_ID, { filter: 'hot' });
      const warmResult = await getLeads(TEST_BUSINESS_ID, { filter: 'warm' });
      const coldResult = await getLeads(TEST_BUSINESS_ID, { filter: 'cold' });
      
      expect(hotResult.success).toBe(true);
      hotResult.data!.forEach(lead => {
        expect(lead.hotness).toBe('hot');
      });
      
      warmResult.data!.forEach(lead => {
        expect(lead.hotness).toBe('warm');
      });
      
      coldResult.data!.forEach(lead => {
        expect(lead.hotness).toBe('cold');
      });
    });
    
    it('should sort by createdAt descending by default', async () => {
      const result = await getLeads(TEST_BUSINESS_ID, { sortBy: 'createdAt' });
      
      expect(result.success).toBe(true);
      const dates = result.data!.map(l => l.createdAt.getTime());
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
      }
    });
    
    it('should sort by hotness', async () => {
      const result = await getLeads(TEST_BUSINESS_ID, { sortBy: 'hotness' });
      
      expect(result.success).toBe(true);
      const hotnessOrder = { hot: 0, warm: 1, cold: 2 };
      const hotnesses = result.data!.map(l => hotnessOrder[l.hotness]);
      for (let i = 1; i < hotnesses.length; i++) {
        expect(hotnesses[i]).toBeGreaterThanOrEqual(hotnesses[i - 1]);
      }
    });
  });
  
  describe('getLeadPreviews', () => {
    it('should return preview cards', async () => {
      const result = await getLeadPreviews(TEST_BUSINESS_ID);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      result.data!.forEach(preview => {
        expect(preview).toHaveProperty('id');
        expect(preview).toHaveProperty('hotness');
        expect(preview).toHaveProperty('sourcePage');
        expect(preview).toHaveProperty('createdAt');
      });
    });
    
    it('should include unread activity flag', async () => {
      const result = await getLeadPreviews(TEST_BUSINESS_ID);
      
      expect(result.success).toBe(true);
      result.data!.forEach(preview => {
        expect(typeof preview.hasUnreadActivity).toBe('boolean');
      });
    });
  });
  
  describe('getLeadById', () => {
    it('should return a specific lead', async () => {
      const allLeads = await getLeads(TEST_BUSINESS_ID);
      const firstLead = allLeads.data![0];
      
      const result = await getLeadById(firstLead.id, TEST_BUSINESS_ID);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.id).toBe(firstLead.id);
    });
    
    it('should have all required lead properties', async () => {
      const allLeads = await getLeads(TEST_BUSINESS_ID);
      const result = await getLeadById(allLeads.data![0].id, TEST_BUSINESS_ID);
      
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('hotness');
      expect(result.data).toHaveProperty('hotnessFactors');
      expect(result.data).toHaveProperty('intent');
      expect(result.data).toHaveProperty('suggestedAction');
      expect(result.data).toHaveProperty('conversation');
      expect(result.data).toHaveProperty('source');
    });
    
    it('should return error for non-existent lead', async () => {
      const result = await getLeadById('non-existent-id', TEST_BUSINESS_ID);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Lead not found');
    });
  });
  
  describe('updateLead', () => {
    it('should update internal notes', async () => {
      const allLeads = await getLeads(TEST_BUSINESS_ID);
      const leadId = allLeads.data![0].id;
      
      const result = await updateLead(leadId, TEST_BUSINESS_ID, { 
        internalNotes: 'Test note for follow-up' 
      });
      
      expect(result.success).toBe(true);
      expect(result.data!.internalNotes).toBe('Test note for follow-up');
    });
    
    it('should update timestamp on change', async () => {
      const allLeads = await getLeads(TEST_BUSINESS_ID);
      const leadId = allLeads.data![0].id;
      const originalUpdatedAt = allLeads.data![0].updatedAt;
      
      // Small delay to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const result = await updateLead(leadId, TEST_BUSINESS_ID, { internalNotes: 'Updated' });
      
      expect(result.data!.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
    
    it('should return error for non-existent lead', async () => {
      const result = await updateLead('fake-id', TEST_BUSINESS_ID, { internalNotes: 'Test' });
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Lead not found');
    });
  });
  
  describe('getDashboardMetrics', () => {
    it('should return all metrics', async () => {
      const result = await getDashboardMetrics(TEST_BUSINESS_ID);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('visits');
      expect(result.data).toHaveProperty('avgTimeSpent');
      expect(result.data).toHaveProperty('bounceRate');
      expect(result.data).toHaveProperty('leadConversions');
    });
    
    it('should include trend data', async () => {
      const result = await getDashboardMetrics(TEST_BUSINESS_ID);
      
      expect(result.data!.visits.trend).toMatch(/^(up|down|stable)$/);
      expect(typeof result.data!.visits.trendPercentage).toBe('number');
    });
    
    it('should include chart data points', async () => {
      const result = await getDashboardMetrics(TEST_BUSINESS_ID);
      
      expect(result.data!.visits.chartData).toBeDefined();
      expect(Array.isArray(result.data!.visits.chartData)).toBe(true);
      expect(result.data!.visits.chartData.length).toBe(7); // 7 days
      
      result.data!.visits.chartData.forEach(point => {
        expect(point).toHaveProperty('date');
        expect(point).toHaveProperty('value');
      });
    });
  });
  
  describe('getLeadCounts', () => {
    it('should return counts by hotness', async () => {
      const result = await getLeadCounts(TEST_BUSINESS_ID);
      
      expect(result.success).toBe(true);
      expect(typeof result.data!.hot).toBe('number');
      expect(typeof result.data!.warm).toBe('number');
      expect(typeof result.data!.cold).toBe('number');
      expect(typeof result.data!.total).toBe('number');
    });
    
    it('should have total equal sum of all categories', async () => {
      const result = await getLeadCounts(TEST_BUSINESS_ID);
      
      const sum = result.data!.hot + result.data!.warm + result.data!.cold;
      expect(result.data!.total).toBe(sum);
    });
  });
});
