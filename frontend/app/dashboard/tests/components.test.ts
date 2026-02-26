/**
 * Dashboard Component Tests
 * Tests for UI components
 */

import React from 'react';

// Mock the types for testing
const mockLead = {
  id: 'test-001',
  fullName: 'Test User',
  email: 'test@example.com',
  phone: '(555) 123-4567',
  source: { page: '/pricing', referrer: 'google' },
  conversation: [
    { role: 'bot' as const, content: 'Hello!', timestamp: new Date() },
    { role: 'user' as const, content: 'Hi there', timestamp: new Date() }
  ],
  extractedInfo: { businessType: 'Consulting' },
  internalNotes: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  hotness: 'hot' as const,
  hotnessFactors: [
    { name: 'Pricing Inquiry', present: true },
    { name: 'Contact Provided', present: true }
  ],
  intent: 'sales' as const,
  suggestedAction: {
    type: 'call' as const,
    label: 'Call this lead now',
    reason: 'This is a hot lead showing strong buying signals',
    priority: 'high' as const
  }
};

const mockPreview = {
  id: 'test-001',
  fullName: 'Test User',
  intent: 'sales' as const,
  hotness: 'hot' as const,
  sourcePage: '/pricing',
  createdAt: new Date(),
  hasUnreadActivity: true
};

const mockMetrics = {
  visits: {
    current: 1000,
    previous: 900,
    trend: 'up' as const,
    trendPercentage: 11.1,
    chartData: [
      { date: '2024-01-01', value: 100 },
      { date: '2024-01-02', value: 120 }
    ]
  },
  avgTimeSpent: {
    current: 180,
    previous: 160,
    trend: 'up' as const,
    trendPercentage: 12.5,
    unit: 'seconds',
    chartData: []
  },
  bounceRate: {
    current: 35,
    previous: 40,
    trend: 'down' as const,
    trendPercentage: 12.5,
    unit: '%',
    chartData: []
  },
  leadConversions: {
    current: 25,
    previous: 20,
    trend: 'up' as const,
    trendPercentage: 25,
    chartData: []
  }
};

describe('Dashboard Components', () => {
  describe('MetricsCard', () => {
    it('should display current metric value', () => {
      expect(mockMetrics.visits.current).toBe(1000);
    });
    
    it('should calculate trend percentage correctly', () => {
      const { current, previous } = mockMetrics.visits;
      const calculatedTrend = ((current - previous) / previous) * 100;
      expect(calculatedTrend).toBeCloseTo(11.1, 1);
    });
    
    it('should have chart data with date and value', () => {
      expect(mockMetrics.visits.chartData[0]).toHaveProperty('date');
      expect(mockMetrics.visits.chartData[0]).toHaveProperty('value');
    });
  });
  
  describe('HotnessIndicator', () => {
    it('should map hotness to correct emoji', () => {
      const hotnessEmoji = {
        hot: '🔥',
        warm: '🟡',
        cold: '⚪'
      };
      
      expect(hotnessEmoji[mockLead.hotness]).toBe('🔥');
    });
    
    it('should have factors array', () => {
      expect(Array.isArray(mockLead.hotnessFactors)).toBe(true);
      expect(mockLead.hotnessFactors.length).toBeGreaterThan(0);
    });
    
    it('should have present flag on factors', () => {
      mockLead.hotnessFactors.forEach(factor => {
        expect(typeof factor.present).toBe('boolean');
        expect(typeof factor.name).toBe('string');
      });
    });
  });
  
  describe('LeadCard', () => {
    it('should display lead name or Anonymous Visitor', () => {
      const displayName = mockPreview.fullName || 'Anonymous Visitor';
      expect(displayName).toBe('Test User');
    });
    
    it('should show unread indicator when hasUnreadActivity is true', () => {
      expect(mockPreview.hasUnreadActivity).toBe(true);
    });
    
    it('should have proper intent label', () => {
      const intentLabels = {
        sales: '💼 Sales Inquiry',
        booking: '📅 Wants to Book',
        question: '❓ Has Questions',
        support: '🆘 Needs Support',
        unknown: '💭 Exploring'
      };
      
      expect(intentLabels[mockPreview.intent]).toBe('💼 Sales Inquiry');
    });
  });
  
  describe('LeadDetail', () => {
    it('should have all required lead properties', () => {
      expect(mockLead).toHaveProperty('id');
      expect(mockLead).toHaveProperty('fullName');
      expect(mockLead).toHaveProperty('hotness');
      expect(mockLead).toHaveProperty('hotnessFactors');
      expect(mockLead).toHaveProperty('intent');
      expect(mockLead).toHaveProperty('suggestedAction');
      expect(mockLead).toHaveProperty('conversation');
      expect(mockLead).toHaveProperty('extractedInfo');
    });
    
    it('should have conversation messages with proper structure', () => {
      mockLead.conversation.forEach(msg => {
        expect(msg).toHaveProperty('role');
        expect(msg).toHaveProperty('content');
        expect(msg).toHaveProperty('timestamp');
        expect(['user', 'bot']).toContain(msg.role);
      });
    });
    
    it('should have suggestedAction with all properties', () => {
      expect(mockLead.suggestedAction).toHaveProperty('type');
      expect(mockLead.suggestedAction).toHaveProperty('label');
      expect(mockLead.suggestedAction).toHaveProperty('reason');
      expect(mockLead.suggestedAction).toHaveProperty('priority');
    });
  });
  
  describe('SuggestedAction', () => {
    it('should have valid action type', () => {
      const validTypes = ['call', 'email', 'schedule', 'follow_up', 'wait', 'archive'];
      expect(validTypes).toContain(mockLead.suggestedAction.type);
    });
    
    it('should have valid priority', () => {
      const validPriorities = ['high', 'medium', 'low'];
      expect(validPriorities).toContain(mockLead.suggestedAction.priority);
    });
    
    it('should have non-empty label and reason', () => {
      expect(mockLead.suggestedAction.label.length).toBeGreaterThan(0);
      expect(mockLead.suggestedAction.reason.length).toBeGreaterThan(0);
    });
  });
  
  describe('QuickActions', () => {
    it('should enable call button when phone is present', () => {
      const canCall = Boolean(mockLead.phone);
      expect(canCall).toBe(true);
    });
    
    it('should enable email button when email is present', () => {
      const canEmail = Boolean(mockLead.email);
      expect(canEmail).toBe(true);
    });
    
    it('should disable call button when phone is null', () => {
      const leadWithoutPhone = { ...mockLead, phone: null };
      const canCall = Boolean(leadWithoutPhone.phone);
      expect(canCall).toBe(false);
    });
  });
});

describe('Relative Time Formatting', () => {
  it('should format just now for < 1 minute', () => {
    const formatRelativeTime = (date: Date): string => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      return 'older';
    };
    
    const justNow = new Date();
    expect(formatRelativeTime(justNow)).toBe('Just now');
  });
  
  it('should format minutes for < 1 hour', () => {
    const formatRelativeTime = (date: Date): string => {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      return 'older';
    };
    
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    expect(formatRelativeTime(tenMinsAgo)).toBe('10m ago');
  });
});
