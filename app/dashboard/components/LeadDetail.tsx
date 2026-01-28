'use client';

/**
 * LeadDetail Component
 * Full view of a single lead with all information
 */

import React, { useState } from 'react';
import { Lead, ConversationMessage } from '../types';
import { HotnessIndicator } from './HotnessIndicator';
import { SuggestedActionCard, QuickActions } from './SuggestedAction';
import { summarizeConversation } from '../utils/intentExtraction';

interface LeadDetailProps {
  lead: Lead;
  onUpdateNotes?: (notes: string) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Conversation View
 */
function ConversationView({ messages }: { messages: ConversationMessage[] }) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`
              max-w-[80%] rounded-2xl px-4 py-3
              ${message.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-md' 
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }
            `}
          >
            <p className="text-sm">{message.content}</p>
            
            {message.highlights && message.highlights.length > 0 && (
              <div className="mt-2 pt-2 border-t border-blue-500/30">
                <div className="flex flex-wrap gap-1">
                  {message.highlights.map((highlight, i) => (
                    <span 
                      key={i}
                      className="text-xs bg-blue-500/20 px-2 py-0.5 rounded"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
              {formatTime(message.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Extracted Info Panel
 */
function ExtractedInfoPanel({ info }: { info: Lead['extractedInfo'] }) {
  const entries = Object.entries(info).filter(([_, value]) => value);
  
  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        No key information extracted yet
      </p>
    );
  }
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {entries.map(([key, value]) => (
        <div key={key} className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </p>
          <p className="text-sm font-medium text-gray-900">{value}</p>
        </div>
      ))}
    </div>
  );
}

/**
 * Internal Notes Section
 */
function InternalNotes({ 
  notes, 
  onUpdate 
}: { 
  notes: string; 
  onUpdate?: (notes: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(notes);
  
  const handleSave = () => {
    onUpdate?.(editValue);
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <div className="space-y-2">
        <textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="w-full h-32 p-3 text-sm border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            resize-none"
          placeholder="Add internal notes about this lead..."
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 transition-colors"
          >
            Save Notes
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      onClick={() => setIsEditing(true)}
      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg cursor-pointer
        hover:border-yellow-300 transition-colors min-h-[80px]"
    >
      {notes ? (
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes}</p>
      ) : (
        <p className="text-sm text-gray-400 italic">
          Click to add internal notes...
        </p>
      )}
    </div>
  );
}

/**
 * Main Lead Detail Component
 */
export function LeadDetail({ lead, onUpdateNotes }: LeadDetailProps) {
  const summary = summarizeConversation(lead.conversation);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {lead.fullName || 'Anonymous Visitor'}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {lead.email && (
                <span className="flex items-center gap-1">
                  ✉️ {lead.email}
                </span>
              )}
              {lead.phone && (
                <span className="flex items-center gap-1">
                  📞 {lead.phone}
                </span>
              )}
            </div>
          </div>
          <HotnessIndicator 
            hotness={lead.hotness} 
            factors={lead.hotnessFactors}
            size="lg"
          />
        </div>
        
        <QuickActions 
          leadId={lead.id}
          leadPhone={lead.phone}
          leadEmail={lead.email}
        />
      </div>
      
      {/* AI Suggested Action */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>🤖</span>
          <span>AI Suggested Next Step</span>
        </h2>
        <SuggestedActionCard action={lead.suggestedAction} />
      </div>
      
      {/* Summary */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Quick Summary</h2>
        <p className="text-gray-600 leading-relaxed">{summary}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Conversation */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center justify-between">
            <span>Conversation</span>
            <span className="text-xs text-gray-400 font-normal">
              {formatDate(lead.createdAt)}
            </span>
          </h2>
          <div className="max-h-[400px] overflow-y-auto pr-2">
            <ConversationView messages={lead.conversation} />
          </div>
        </div>
        
        {/* Right Side Info */}
        <div className="p-6 space-y-6">
          {/* Extracted Info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Key Information</h2>
            <ExtractedInfoPanel info={lead.extractedInfo} />
          </div>
          
          {/* Source */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Source</h2>
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Page</span>
                <span className="text-gray-900 font-medium">{lead.source.page}</span>
              </div>
              {lead.source.referrer && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Referrer</span>
                  <span className="text-gray-900">{lead.source.referrer}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Internal Notes */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              📝 Internal Notes
            </h2>
            <InternalNotes 
              notes={lead.internalNotes} 
              onUpdate={onUpdateNotes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetail;
