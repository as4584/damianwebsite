'use client';

/**
 * Dashboard Main Page
 * Displays metrics overview and lead list
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MetricsGrid } from './components/MetricsCard';
import { LeadList } from './components/LeadCard';
import { getDashboardMetrics, getLeadPreviews, getLeadCounts } from './services/leadService';
import { DashboardMetrics, LeadCardPreview, LeadHotness } from './types';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [leads, setLeads] = useState<LeadCardPreview[]>([]);
  const [counts, setCounts] = useState<{ hot: number; warm: number; cold: number; total: number } | null>(null);
  const [filter, setFilter] = useState<'all' | LeadHotness>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadDashboard() {
      try {
        const [metricsRes, leadsRes, countsRes] = await Promise.all([
          getDashboardMetrics(),
          getLeadPreviews(),
          getLeadCounts()
        ]);
        
        if (metricsRes.success) setMetrics(metricsRes.data!);
        if (leadsRes.success) setLeads(leadsRes.data!);
        if (countsRes.success) setCounts(countsRes.data!);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboard();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Leads Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track and manage your incoming leads
              </p>
            </div>
            
            {counts && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
                  <span className="text-lg">🔥</span>
                  <span className="font-bold text-red-700">{counts.hot}</span>
                  <span className="text-sm text-red-600">Hot</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-lg">
                  <span className="text-lg">🟡</span>
                  <span className="font-bold text-yellow-700">{counts.warm}</span>
                  <span className="text-sm text-yellow-600">Warm</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-lg">⚪</span>
                  <span className="font-bold text-gray-700">{counts.cold}</span>
                  <span className="text-sm text-gray-600">Cold</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
          <MetricsGrid metrics={metrics} isLoading={isLoading} />
        </section>
        
        {/* Leads Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Leads
              {counts && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({counts.total} total)
                </span>
              )}
            </h2>
          </div>
          
          <LeadList 
            leads={leads}
            filter={filter}
            onFilterChange={setFilter}
            isLoading={isLoading}
          />
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-gray-500 text-center">
            Innovation Development Solutions — Leads Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}
