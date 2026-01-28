/**
 * Lead Service
 * Data layer for lead management
 * Uses mock data now, designed for easy backend swap
 */

import { Lead, LeadCardPreview, LeadUpdatePayload, ApiResponse, DashboardMetrics, ChartDataPoint } from '../types';
import { scoreLead } from './scoringService';
import { extractIntent, extractKeyInfo, getMessageHighlights } from '../utils/intentExtraction';
import { suggestNextAction } from '../utils/actionSuggestion';

// Mock data store (in production, replace with database calls)
const mockLeadsStore: Map<string, Lead> = new Map();

// Initialize with sample data
function initializeMockData() {
  if (mockLeadsStore.size > 0) return;

  const sampleLeads: Omit<Lead, 'hotness' | 'hotnessFactors' | 'intent' | 'suggestedAction'>[] = [
    {
      id: 'lead-001',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '(555) 123-4567',
      source: { page: '/pricing', referrer: 'google' },
      conversation: [
        { role: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 3600000) },
        { role: 'user', content: 'I want to start an LLC for my consulting business. How much does it cost?', timestamp: new Date(Date.now() - 3500000) },
        { role: 'bot', content: 'Great! LLC formation costs vary by state. What state are you in?', timestamp: new Date(Date.now() - 3400000) },
        { role: 'user', content: 'I\'m in California. I need this done by next week if possible.', timestamp: new Date(Date.now() - 3300000) },
        { role: 'bot', content: 'We can definitely help with that. Would you like to schedule a consultation?', timestamp: new Date(Date.now() - 3200000) },
        { role: 'user', content: 'Yes! My email is sarah.johnson@example.com and phone is (555) 123-4567', timestamp: new Date(Date.now() - 3100000) }
      ],
      extractedInfo: { businessType: 'Consulting', location: 'California', timeline: 'Next Week' },
      internalNotes: '',
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3100000)
    },
    {
      id: 'lead-002',
      fullName: 'Michael Chen',
      email: 'mchen@techstartup.io',
      phone: null,
      source: { page: '/services' },
      conversation: [
        { role: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 7200000) },
        { role: 'user', content: 'What\'s the difference between LLC and S-Corp?', timestamp: new Date(Date.now() - 7100000) },
        { role: 'bot', content: 'Great question! An LLC offers flexibility while an S-Corp provides tax advantages for eligible businesses.', timestamp: new Date(Date.now() - 7000000) },
        { role: 'user', content: 'Interesting. I\'m starting a tech company and wondering which is better for getting investors.', timestamp: new Date(Date.now() - 6900000) }
      ],
      extractedInfo: { businessType: 'Technology' },
      internalNotes: 'Seems knowledgeable, may need more specific advice',
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 6900000)
    },
    {
      id: 'lead-003',
      fullName: null,
      email: null,
      phone: null,
      source: { page: '/about' },
      conversation: [
        { role: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 86400000) },
        { role: 'user', content: 'hi', timestamp: new Date(Date.now() - 86300000) },
        { role: 'bot', content: 'Hi there! What brings you here today?', timestamp: new Date(Date.now() - 86200000) },
        { role: 'user', content: 'just looking around', timestamp: new Date(Date.now() - 86100000) }
      ],
      extractedInfo: {},
      internalNotes: '',
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86100000)
    },
    {
      id: 'lead-004',
      fullName: 'Jennifer Martinez',
      email: 'jennifer.m@gmail.com',
      phone: '(555) 987-6543',
      source: { page: '/contact' },
      conversation: [
        { role: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 1800000) },
        { role: 'user', content: 'I need to schedule a consultation ASAP. I want to start a restaurant and need help with everything.', timestamp: new Date(Date.now() - 1700000) },
        { role: 'bot', content: 'Absolutely! I can help you schedule a consultation. When works best for you?', timestamp: new Date(Date.now() - 1600000) },
        { role: 'user', content: 'Tomorrow if possible. My name is Jennifer Martinez, email is jennifer.m@gmail.com, phone (555) 987-6543', timestamp: new Date(Date.now() - 1500000) }
      ],
      extractedInfo: { businessType: 'Food & Restaurant', timeline: 'Urgent (Today)' },
      internalNotes: '',
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1500000)
    },
    {
      id: 'lead-005',
      fullName: 'David Wilson',
      email: 'dwilson@realestate.com',
      phone: null,
      source: { page: '/industries' },
      conversation: [
        { role: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 172800000) },
        { role: 'user', content: 'Do you help with real estate business formation?', timestamp: new Date(Date.now() - 172700000) },
        { role: 'bot', content: 'Yes, we specialize in real estate business structures!', timestamp: new Date(Date.now() - 172600000) },
        { role: 'user', content: 'Cool. I\'ll think about it and get back to you.', timestamp: new Date(Date.now() - 172500000) }
      ],
      extractedInfo: { businessType: 'Real Estate' },
      internalNotes: '',
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172500000)
    }
  ];

  // Process and store each lead
  sampleLeads.forEach(leadData => {
    const { hotness, factors } = scoreLead(
      leadData.conversation,
      leadData.source,
      leadData.email,
      leadData.phone
    );
    
    const intent = extractIntent(leadData.conversation);
    
    const fullLead: Lead = {
      ...leadData,
      hotness,
      hotnessFactors: factors,
      intent,
      suggestedAction: { type: 'wait', label: '', reason: '', priority: 'low' }
    };
    
    fullLead.suggestedAction = suggestNextAction(fullLead);
    
    // Add highlights to messages
    fullLead.conversation = fullLead.conversation.map(msg => ({
      ...msg,
      highlights: msg.role === 'user' ? getMessageHighlights(msg.content) : undefined
    }));
    
    mockLeadsStore.set(fullLead.id, fullLead);
  });
}

/**
 * Get all leads (with pagination)
 */
export async function getLeads(options?: {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'hotness';
  filter?: 'all' | 'hot' | 'warm' | 'cold';
}): Promise<ApiResponse<Lead[]>> {
  initializeMockData();
  
  const { page = 1, limit = 20, sortBy = 'createdAt', filter = 'all' } = options || {};
  
  let leads = Array.from(mockLeadsStore.values());
  
  // Filter by hotness
  if (filter !== 'all') {
    leads = leads.filter(lead => lead.hotness === filter);
  }
  
  // Sort
  if (sortBy === 'createdAt') {
    leads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } else if (sortBy === 'hotness') {
    const hotnessOrder = { hot: 0, warm: 1, cold: 2 };
    leads.sort((a, b) => hotnessOrder[a.hotness] - hotnessOrder[b.hotness]);
  }
  
  // Paginate
  const start = (page - 1) * limit;
  const paginatedLeads = leads.slice(start, start + limit);
  
  return {
    success: true,
    data: paginatedLeads
  };
}

/**
 * Get lead card previews for list view
 */
export async function getLeadPreviews(): Promise<ApiResponse<LeadCardPreview[]>> {
  initializeMockData();
  
  const leads = Array.from(mockLeadsStore.values());
  
  const previews: LeadCardPreview[] = leads
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map(lead => ({
      id: lead.id,
      fullName: lead.fullName,
      intent: lead.intent,
      hotness: lead.hotness,
      sourcePage: lead.source.page,
      createdAt: lead.createdAt,
      hasUnreadActivity: lead.updatedAt.getTime() > Date.now() - 3600000
    }));
  
  return {
    success: true,
    data: previews
  };
}

/**
 * Get single lead by ID
 */
export async function getLeadById(id: string): Promise<ApiResponse<Lead>> {
  initializeMockData();
  
  const lead = mockLeadsStore.get(id);
  
  if (!lead) {
    return {
      success: false,
      error: 'Lead not found'
    };
  }
  
  return {
    success: true,
    data: lead
  };
}

/**
 * Update lead
 */
export async function updateLead(id: string, updates: LeadUpdatePayload): Promise<ApiResponse<Lead>> {
  initializeMockData();
  
  const lead = mockLeadsStore.get(id);
  
  if (!lead) {
    return {
      success: false,
      error: 'Lead not found'
    };
  }
  
  const updatedLead: Lead = {
    ...lead,
    ...updates,
    updatedAt: new Date()
  };
  
  mockLeadsStore.set(id, updatedLead);
  
  return {
    success: true,
    data: updatedLead
  };
}

/**
 * Get dashboard metrics
 */
export async function getDashboardMetrics(): Promise<ApiResponse<DashboardMetrics>> {
  initializeMockData();
  
  // Generate realistic chart data for last 7 days
  const generateChartData = (baseValue: number, variance: number): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(baseValue + (Math.random() - 0.5) * variance)
      });
    }
    
    return data;
  };
  
  const leads = Array.from(mockLeadsStore.values());
  const hotLeads = leads.filter(l => l.hotness === 'hot').length;
  
  return {
    success: true,
    data: {
      visits: {
        current: 1247,
        previous: 1089,
        trend: 'up',
        trendPercentage: 14.5,
        chartData: generateChartData(180, 50)
      },
      avgTimeSpent: {
        current: 245,
        previous: 212,
        trend: 'up',
        trendPercentage: 15.6,
        unit: 'seconds',
        chartData: generateChartData(240, 60)
      },
      bounceRate: {
        current: 34.2,
        previous: 41.8,
        trend: 'down',
        trendPercentage: 18.2,
        unit: '%',
        chartData: generateChartData(35, 10)
      },
      leadConversions: {
        current: leads.length,
        previous: Math.max(1, leads.length - 2),
        trend: 'up',
        trendPercentage: ((leads.length - (leads.length - 2)) / (leads.length - 2)) * 100,
        chartData: generateChartData(leads.length, 2)
      }
    }
  };
}

/**
 * Get lead counts by hotness
 */
export async function getLeadCounts(): Promise<ApiResponse<{ hot: number; warm: number; cold: number; total: number }>> {
  initializeMockData();
  
  const leads = Array.from(mockLeadsStore.values());
  
  return {
    success: true,
    data: {
      hot: leads.filter(l => l.hotness === 'hot').length,
      warm: leads.filter(l => l.hotness === 'warm').length,
      cold: leads.filter(l => l.hotness === 'cold').length,
      total: leads.length
    }
  };
}
