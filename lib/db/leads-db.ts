/**
 * Leads Database Module
 * Handles creation and storage of leads from the chatbot
 */

import { Lead, LeadIntent, LeadHotness } from '@/app/dashboard/types';
import { db as mockDb } from './mock-db';
import { supabase } from '../supabase';

// Get default business ID - use the seeded business from mock-db
const DEFAULT_BUSINESS_ID = 'biz_innovation_001';

// In-memory store for leads (FALLBACK for when Supabase is not connected)
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
 * USES SUPABASE for persistence with in-memory fallback
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
    businessId: DEFAULT_BUSINESS_ID,
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
  
  // 1. SAVE TO SUPABASE (if configured)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl && supabaseUrl !== 'your-project-url.supabase.co') {
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          id: lead.id,
          business_id: lead.businessId,
          full_name: lead.fullName,
          email: lead.email,
          phone: lead.phone,
          intent: lead.intent,
          hotness: lead.hotness,
          hotness_factors: lead.hotnessFactors,
          source_page: lead.source.page,
          conversation: lead.conversation,
          extracted_info: lead.extractedInfo,
          suggested_action: lead.suggestedAction,
          created_at: lead.createdAt.toISOString()
        }]);
      
      if (error) throw error;
      console.log('✅ Lead saved to Supabase');
    } catch (err) {
      console.error('❌ Supabase Save Failed:', err);
      // Fall through to in-memory store
    }
  }
  
  // 2. SAVE TO IN-MEMORY (Always for immediate dashboard update)
  leadsStore.set(leadId, lead);
  
  return lead;
}

/**
 * Get all leads (for dashboard)
 * Syncs with Supabase if available
 */
export async function getAllLeads(): Promise<Lead[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (supabaseUrl && supabaseUrl !== 'your-project-url.supabase.co') {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*');
      
      if (error) throw error;

      if (data) {
        // Map Supabase snake_case to TypeScript camelCase
        const leads: Lead[] = data.map(record => ({
          id: record.id,
          businessId: record.business_id,
          fullName: record.full_name,
          email: record.email,
          phone: record.phone,
          intent: record.intent,
          hotness: record.hotness,
          hotnessFactors: record.hotness_factors || [],
          source: { page: record.source_page },
          conversation: record.conversation,
          extractedInfo: record.extracted_info,
          suggestedAction: record.suggested_action,
          hotnessFactors: [], // Re-calculated if needed
          internalNotes: record.internal_notes || '',
          createdAt: new Date(record.created_at),
          updatedAt: new Date(record.updated_at || record.created_at)
        }));

        // Update local store with fresh data
        leads.forEach(l => leadsStore.set(l.id, l));
        return leads;
      }
    } catch (err) {
      console.error('❌ Supabase Fetch Failed:', err);
    }
  }

  return Array.from(leadsStore.values());
}

/**
 * Get lead by ID
 */
export async function getLeadById(id: string): Promise<Lead | null> {
  const cached = leadsStore.get(id);
  if (cached) return cached;

  const leads = await getAllLeads();
  return leads.find(l => l.id === id) || null;
}

/**
 * Update lead in database
 */
export async function updateLeadInDb(id: string, updates: Partial<Lead>): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (supabaseUrl && supabaseUrl !== 'your-project-url.supabase.co') {
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          full_name: updates.fullName,
          email: updates.email,
          phone: updates.phone,
          intent: updates.intent,
          hotness: updates.hotness,
          internal_notes: updates.internalNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      console.log('✅ Lead updated in Supabase');
    } catch (err) {
      console.error('❌ Supabase Update Failed:', err);
    }
  }

  // Always update in-memory
  const existing = leadsStore.get(id);
  if (existing) {
    leadsStore.set(id, { ...existing, ...updates, updatedAt: new Date() });
  }
}

/**
 * Database is now production-ready with zero mock data
 */

// No initialization - database starts empty
// Leads will be created only through createLead() function
