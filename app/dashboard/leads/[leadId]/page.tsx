'use client';

/**
 * Lead Detail Page
 * Full view for a single lead
 * 
 * SECURITY:
 * - Uses API routes instead of direct service calls
 * - Session validation happens on server (middleware + API routes)
 * - businessId scoping enforced by backend
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { LeadDetail } from '../../components/LeadDetail';
import { Lead } from '../../types';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.leadId as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadLead() {
      try {
        // SECURITY: Call API route (not direct service call)
        // API validates session and businessId ownership
        const response = await fetch(`/dashboard/api/leads/${leadId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setLead(result.data);
        } else {
          setError(result.error || 'Lead not found');
        }
      } catch (err) {
        setError('Failed to load lead');
      } finally {
        setIsLoading(false);
      }
    }
    
    if (leadId) {
      loadLead();
    }
  }, [leadId]);
  
  const handleUpdateNotes = async (notes: string) => {
    if (!lead) return;
    
    // SECURITY: Call API route (not direct service call)
    const response = await fetch(`/dashboard/api/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ internalNotes: notes })
    });
    
    const result = await response.json();
    if (result.success && result.data) {
      setLead(result.data);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error || !lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">😕</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Lead Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error || 'This lead does not exist'}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white
              rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900
                transition-colors"
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">Lead Details</span>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LeadDetail 
          lead={lead}
          onUpdateNotes={handleUpdateNotes}
        />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-500 text-center">
            Innovation Development Solutions — Leads Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
