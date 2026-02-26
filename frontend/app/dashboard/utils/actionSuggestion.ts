/**
 * Action Suggestion Utility
 * AI-assisted next action recommendations for leads
 */

import { Lead, LeadHotness, LeadIntent, SuggestedAction } from '../types';

/**
 * Get action priority based on lead hotness
 */
export function getActionPriority(hotness: LeadHotness): 'high' | 'medium' | 'low' {
  switch (hotness) {
    case 'hot':
      return 'high';
    case 'warm':
      return 'medium';
    case 'cold':
      return 'low';
  }
}

/**
 * Suggest the best next action for a lead
 */
export function suggestNextAction(lead: Lead): SuggestedAction {
  const priority = getActionPriority(lead.hotness);
  
  // Hot leads - prioritize immediate contact
  if (lead.hotness === 'hot') {
    if (lead.phone) {
      return {
        type: 'call',
        label: 'Call this lead now',
        reason: 'This is a hot lead showing strong buying signals. They have provided a phone number and are likely ready to move forward. A quick call can help close the deal.',
        priority: 'high'
      };
    }
    
    if (lead.email) {
      return {
        type: 'email',
        label: 'Send a personal email',
        reason: 'This hot lead hasn\'t provided a phone number, but they\'re highly engaged. Send a personal email with clear next steps to keep their momentum.',
        priority: 'high'
      };
    }
  }

  // Booking intent - suggest scheduling
  if (lead.intent === 'booking') {
    return {
      type: 'schedule',
      label: 'Confirm their appointment',
      reason: 'This person specifically asked about scheduling. Reach out to confirm the best time for a consultation.',
      priority
    };
  }

  // Warm leads - nurture with follow-up
  if (lead.hotness === 'warm') {
    if (lead.intent === 'question') {
      return {
        type: 'email',
        label: 'Answer their questions',
        reason: 'This person has questions that weren\'t fully answered in the chat. Send a detailed response to build trust and move them closer to a decision.',
        priority: 'medium'
      };
    }
    
    return {
      type: 'follow_up',
      label: 'Send a follow-up',
      reason: 'This warm lead is interested but needs more nurturing. Send a friendly follow-up with helpful information to keep them engaged.',
      priority: 'medium'
    };
  }

  // Support intent - needs attention
  if (lead.intent === 'support') {
    return {
      type: 'call',
      label: 'Resolve their issue',
      reason: 'This person has an issue that needs attention. Contact them to understand and resolve their concern quickly.',
      priority: lead.hotness === 'hot' ? 'high' : 'medium'
    };
  }

  // Cold leads with contact info
  if (lead.hotness === 'cold' && (lead.email || lead.phone)) {
    return {
      type: 'email',
      label: 'Add to nurture sequence',
      reason: 'This lead isn\'t ready to buy yet, but they left contact info. Add them to your email list and check back in a few weeks.',
      priority: 'low'
    };
  }

  // Unknown intent or cold lead without contact
  if (lead.hotness === 'cold' && !lead.email && !lead.phone) {
    return {
      type: 'archive',
      label: 'Archive for now',
      reason: 'This visitor didn\'t engage deeply or leave contact information. Archive and focus on more promising leads.',
      priority: 'low'
    };
  }

  // Default fallback
  return {
    type: 'wait',
    label: 'Monitor for activity',
    reason: 'Not enough information to suggest a specific action. Wait for more engagement before reaching out.',
    priority: 'low'
  };
}

/**
 * Get action icon based on type
 */
export function getActionIcon(type: SuggestedAction['type']): string {
  switch (type) {
    case 'call':
      return '📞';
    case 'email':
      return '✉️';
    case 'schedule':
      return '📅';
    case 'follow_up':
      return '💬';
    case 'wait':
      return '⏳';
    case 'archive':
      return '📁';
  }
}

/**
 * Get priority badge color
 */
export function getPriorityColor(priority: SuggestedAction['priority']): string {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'low':
      return 'text-slate-600 bg-slate-50 border-slate-200';
  }
}
