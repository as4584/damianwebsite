/**
 * Leads Database Module
 * Handles creation and storage of leads from the chatbot
 */

import { Lead, LeadIntent, LeadHotness } from '@/app/dashboard/types';
import { db as mockDb } from './mock-db';

// Get default business ID - use the seeded business from mock-db
const DEFAULT_BUSINESS_ID = 'biz_innovation_001';

// In-memory store for leads (persists during server lifetime)
const leadsStore = new Map<string, Lead>();

export interface ChatLeadData {
  name?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  location?: string;
  hasPartners?: boolean;
  multiState?: boolean;
  intakeData?: Record<string, any>;
  sourcePage?: string;
  referrer?: string;
  conversationHistory?: Array<{ role: 'user' | 'bot'; content: string; timestamp: Date }>;
}

/**
 * Analyze conversation to determine intent
 */
function analyzeIntent(data: ChatLeadData): LeadIntent {
  const intakeData = data.intakeData || {};
  const hasContactInfo = !!(data.email || data.phone);
  const hasBusinessDetails = !!(data.businessType || data.location);
  
  // Check for booking intent
  if (intakeData.wantsConsultation || intakeData.consultationBooked) {
    return 'booking';
  }
  
  // Check for sales intent
  if (hasContactInfo && hasBusinessDetails) {
    return 'sales';
  }
  
  // Check for questions
  if (data.conversationHistory && data.conversationHistory.length > 2) {
    const userMessages = data.conversationHistory.filter(m => m.role === 'user');
    const hasQuestions = userMessages.some(m => 
      m.content.includes('?') || 
      m.content.toLowerCase().includes('how') ||
      m.content.toLowerCase().includes('what') ||
      m.content.toLowerCase().includes('when')
    );
    if (hasQuestions) {
      return 'question';
    }
  }
  
  return 'unknown';
}

/**
 * Calculate lead hotness score
 */
function calculateHotness(data: ChatLeadData, intent: LeadIntent): LeadHotness {
  let score = 0;
  
  // Contact information (30 points)
  if (data.email) score += 15;
  if (data.phone) score += 15;
  
  // Business details (30 points)
  if (data.businessType) score += 10;
  if (data.location) score += 10;
  if (data.hasPartners !== undefined) score += 5;
  if (data.multiState !== undefined) score += 5;
  
  // Intent (25 points)
  if (intent === 'booking') score += 25;
  else if (intent === 'sales') score += 20;
  else if (intent === 'question') score += 10;
  
  // Engagement (15 points)
  const messageCount = data.conversationHistory?.length || 0;
  if (messageCount > 10) score += 15;
  else if (messageCount > 5) score += 10;
  else if (messageCount > 2) score += 5;
  
  // Classification
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
}

/**
 * Extract key information from chat data
 */
function extractInfo(data: ChatLeadData): Record<string, string> {
  const info: any = {};
  
  if (data.businessType) info.businessType = data.businessType;
  if (data.location) info.location = data.location;
  if (data.hasPartners !== undefined) info.hasPartners = data.hasPartners;
  if (data.multiState !== undefined) info.multiState = data.multiState;
  
  // Add intake data
  if (data.intakeData) {
    Object.entries(data.intakeData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        info[key] = value;
      }
    });
  }
  
  return info;
}

/**
 * Create a new lead from chatbot conversation
 * This is called when a user completes the chat intake flow
 */
export async function createLeadFromChat(data: ChatLeadData): Promise<Lead> {
  const now = new Date();
  const leadId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Analyze the conversation
  const intent = analyzeIntent(data);
  const hotness = calculateHotness(data, intent);
  
  // Build conversation array
  const conversation = (data.conversationHistory || []).map(msg => ({
    role: msg.role,
    content: msg.content,
    timestamp: msg.timestamp
  }));
  
  // Create lead object
  const lead: Lead = {
    id: leadId,
    businessId: DEFAULT_BUSINESS_ID, // TODO: Get from session in production
    fullName: data.name || null,
    email: data.email || null,
    phone: data.phone || null,
    source: {
      page: data.sourcePage || '/chat',
      referrer: data.referrer
    },
    conversation,
    intent,
    hotness,
    hotnessFactors: [
      {
        type: 'contact_provided',
        name: 'Contact Information',
        description: 'User provided email or phone',
        present: !!(data.email || data.phone)
      },
      {
        name: 'Business Details',
        description: 'Discussed business type or location',
        present: !!(data.businessType || data.location)
      },
      {
        type: 'high_intent_page',
        name: 'Engagement Level',
        description: `${conversation.length} messages exchanged`,
        present: conversation.length > 5
      }
    ],
    extractedInfo: extractInfo(data),
    suggestedAction: {
      type: hotness === 'hot' ? 'call' : hotness === 'warm' ? 'email' : 'wait',
      label: hotness === 'hot' ? 'Call Now' : hotness === 'warm' ? 'Follow Up' : 'Monitor',
      reason: hotness === 'hot' 
        ? 'High intent detected - immediate action required'
        : hotness === 'warm'
        ? 'Interested prospect - follow up within 24 hours'
        : 'Low engagement - add to nurture campaign',
      priority: hotness === 'hot' ? 'high' : hotness === 'warm' ? 'medium' : 'low'
    },
    internalNotes: '',
    createdAt: now,
    updatedAt: now
  };
  
  // Save to store
  leadsStore.set(leadId, lead);
  
  console.log('✅ Lead created in database:', {
    id: leadId,
    name: lead.fullName,
    email: lead.email,
    hotness: lead.hotness,
    intent: lead.intent
  });
  
  return lead;
}

/**
 * Get all leads from store (for dashboard)
 */
export function getAllLeads(): Lead[] {
  return Array.from(leadsStore.values());
}

/**
 * Get lead by ID
 */
export function getLeadById(id: string): Lead | null {
  return leadsStore.get(id) || null;
}

/**
 * Initialize with sample lead for testing
 */
export function initializeSampleLead() {
  if (leadsStore.size > 0) return;
  
  const sampleLead: Lead = {
    id: 'lead-sample-001',
    businessId: DEFAULT_BUSINESS_ID,
    fullName: 'Sample User',
    email: 'sample@example.com',
    phone: '(555) 123-4567',
    source: { page: '/chat' },
    conversation: [
      { role: 'bot', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 300000) },
      { role: 'user', content: 'I want to start an LLC', timestamp: new Date(Date.now() - 280000) },
      { role: 'bot', content: 'Great! What type of business?', timestamp: new Date(Date.now() - 260000) },
      { role: 'user', content: 'Consulting business in California', timestamp: new Date(Date.now() - 240000) }
    ],
    intent: 'sales',
    hotness: 'warm',
    hotnessFactors: [
      {
        type: 'contact_provided',
        name: 'Contact Information',
        present: true
      },
      {
        name: 'Business Details',
        present: true
      }
    ],
    extractedInfo: {
      businessType: 'Consulting',
      location: 'California'
    },
    suggestedAction: {
      type: 'email',
      label: 'Follow Up',
      reason: 'Interested prospect',
      priority: 'medium'
    },
    internalNotes: '',
    createdAt: new Date(Date.now() - 300000),
    updatedAt: new Date(Date.now() - 240000)
  };
  
  leadsStore.set(sampleLead.id, sampleLead);
}

// Initialize sample lead on module load
initializeSampleLead();
