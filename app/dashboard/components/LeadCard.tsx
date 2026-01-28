'use client';

/**
 * LeadCard Component
 * Inbox-style preview card for leads list
 */

import React from 'react';
import Link from 'next/link';
import { LeadCardPreview, LeadHotness, LeadIntent } from '../types';
import { HotnessBadge } from './HotnessIndicator';

interface LeadCardProps {
  lead: LeadCardPreview;
  isSelected?: boolean;
  onClick?: () => void;
}

const intentLabels: Record<LeadIntent, string> = {
  sales: '💼 Sales Inquiry',
  booking: '📅 Wants to Book',
  question: '❓ Has Questions',
  support: '🆘 Needs Support',
  unknown: '💭 Exploring'
};

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function LeadCard({ lead, isSelected, onClick }: LeadCardProps) {
  const displayName = lead.fullName || 'Anonymous Visitor';
  const intentLabel = intentLabels[lead.intent];
  
  return (
    <Link
      href={`/dashboard/leads/${lead.id}`}
      className={`
        block p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors
        ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}
        ${lead.hasUnreadActivity ? 'bg-blue-50/30' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {lead.hasUnreadActivity && (
              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" title="New activity" />
            )}
            <span className="font-medium text-gray-900 truncate">
              {displayName}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>{intentLabel}</span>
            <span className="text-gray-300">•</span>
            <span>from {lead.sourcePage}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <HotnessBadge hotness={lead.hotness} />
          <span className="text-xs text-gray-400">
            {formatRelativeTime(lead.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * LeadList Component
 * Container for lead cards with filtering
 */

interface LeadListProps {
  leads: LeadCardPreview[];
  selectedLeadId?: string;
  filter?: 'all' | LeadHotness;
  onFilterChange?: (filter: 'all' | LeadHotness) => void;
  isLoading?: boolean;
}

export function LeadList({ 
  leads, 
  selectedLeadId, 
  filter = 'all', 
  onFilterChange,
  isLoading 
}: LeadListProps) {
  const filterOptions: { value: 'all' | LeadHotness; label: string; emoji: string }[] = [
    { value: 'all', label: 'All', emoji: '📋' },
    { value: 'hot', label: 'Hot', emoji: '🔥' },
    { value: 'warm', label: 'Warm', emoji: '🟡' },
    { value: 'cold', label: 'Cold', emoji: '⚪' }
  ];
  
  const filteredLeads = filter === 'all' 
    ? leads 
    : leads.filter(l => l.hotness === filter);
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
        </div>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="p-4 border-b border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50">
        {filterOptions.map(option => (
          <button
            key={option.value}
            onClick={() => onFilterChange?.(option.value)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${filter === option.value 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }
            `}
          >
            <span>{option.emoji}</span>
            <span>{option.label}</span>
            {option.value !== 'all' && (
              <span className="text-xs text-gray-400 ml-1">
                ({leads.filter(l => l.hotness === option.value).length})
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Lead List */}
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <span className="text-4xl mb-2 block">📭</span>
            <p>No leads found</p>
          </div>
        ) : (
          filteredLeads.map(lead => (
            <LeadCard 
              key={lead.id} 
              lead={lead}
              isSelected={lead.id === selectedLeadId}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default LeadCard;
