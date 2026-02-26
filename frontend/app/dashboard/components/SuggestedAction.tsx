'use client';

/**
 * SuggestedAction Component
 * AI-recommended next action for a lead
 */

import React from 'react';
import { SuggestedAction as SuggestedActionType } from '../types';
import { getActionIcon, getPriorityColor } from '../utils/actionSuggestion';

interface SuggestedActionProps {
  action: SuggestedActionType;
  onAction?: () => void;
  compact?: boolean;
}

const priorityStyles = {
  high: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    button: 'bg-red-600 hover:bg-red-700 text-white'
  },
  medium: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700',
    button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
  },
  low: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    badge: 'bg-gray-100 text-gray-700',
    button: 'bg-gray-600 hover:bg-gray-700 text-white'
  }
};

export function SuggestedActionCard({ action, onAction, compact = false }: SuggestedActionProps) {
  const styles = priorityStyles[action.priority];
  const icon = getActionIcon(action.type);
  
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${styles.bg} border ${styles.border}`}>
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-gray-700">{action.label}</span>
      </div>
    );
  }
  
  return (
    <div className={`rounded-xl ${styles.bg} border ${styles.border} p-4`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{icon}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge}`}>
              {action.priority.toUpperCase()} PRIORITY
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {action.label}
          </h3>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {action.reason}
          </p>
        </div>
        
        {onAction && (
          <button
            onClick={onAction}
            className={`
              flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm
              transition-colors ${styles.button}
            `}
          >
            Take Action
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Quick Actions Panel
 * Common actions for lead management
 */

interface QuickActionsProps {
  leadId: string;
  leadPhone?: string | null;
  leadEmail?: string | null;
}

export function QuickActions({ leadId, leadPhone, leadEmail }: QuickActionsProps) {
  const handleCall = () => {
    if (leadPhone) {
      window.location.href = `tel:${leadPhone}`;
    }
  };
  
  const handleEmail = () => {
    if (leadEmail) {
      window.location.href = `mailto:${leadEmail}`;
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleCall}
        disabled={!leadPhone}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-colors
          ${leadPhone 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
        title={leadPhone ? `Call ${leadPhone}` : 'No phone number available'}
      >
        📞 Call
      </button>
      
      <button
        onClick={handleEmail}
        disabled={!leadEmail}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          transition-colors
          ${leadEmail 
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }
        `}
        title={leadEmail ? `Email ${leadEmail}` : 'No email available'}
      >
        ✉️ Email
      </button>
      
      <button
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
      >
        📅 Schedule
      </button>
      
      <button
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
      >
        📝 Add Note
      </button>
    </div>
  );
}

export default SuggestedActionCard;
