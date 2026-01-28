'use client';

/**
 * Dashboard Main Page - Production Version
 * Displays metrics overview and lead list
 * 
 * SECURITY:
 * - Session validation at middleware level
 * - Logout redirects to main site
 * - No public navigation - dashboard only
 */

import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { MetricsGrid } from './components/MetricsCard';
import { LeadList } from './components/LeadCard';
import { DashboardMetrics, LeadCardPreview, LeadHotness } from './types';

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [leads, setLeads] = useState<LeadCardPreview[]>([]);
  const [counts, setCounts] = useState<{ hot: number; warm: number; cold: number; total: number } | null>(null);
  const [filter, setFilter] = useState<'all' | LeadHotness>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function loadDashboard() {
      try {
        // SECURITY: Call API routes (not direct service calls)
        // API validates session and businessId ownership
        const [metricsRes, leadsRes, countsRes] = await Promise.all([
          fetch('/dashboard/api/metrics').then(r => r.json()),
          fetch('/dashboard/api/leads?view=preview').then(r => r.json()),
          fetch('/dashboard/api/metrics?type=counts').then(r => r.json())
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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header - Glossy glass-morphism style */}
      <header className="backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg shadow-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Innovation Business Development Solutions
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Leads Dashboard
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-300/50 transition-all duration-300 hover:scale-105"
            >
              Logout
            </button>
          </div>

          {counts && (
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-red-500/10 to-red-600/10 backdrop-blur-sm rounded-2xl border border-red-300/20 shadow-lg shadow-red-100/50 hover:shadow-xl hover:shadow-red-200/50 transition-all duration-300">
                <span className="text-2xl drop-shadow-md">🔥</span>
                <span className="font-bold text-xl text-red-600">{counts.hot}</span>
                <span className="text-sm font-medium text-red-500">Hot</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-amber-500/10 to-yellow-600/10 backdrop-blur-sm rounded-2xl border border-amber-300/20 shadow-lg shadow-amber-100/50 hover:shadow-xl hover:shadow-amber-200/50 transition-all duration-300">
                <span className="text-2xl drop-shadow-md">🟡</span>
                <span className="font-bold text-xl text-amber-600">{counts.warm}</span>
                <span className="text-sm font-medium text-amber-500">Warm</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-br from-slate-500/10 to-gray-600/10 backdrop-blur-sm rounded-2xl border border-slate-300/20 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                <span className="text-2xl drop-shadow-md">⚪</span>
                <span className="font-bold text-xl text-slate-600">{counts.cold}</span>
                <span className="text-sm font-medium text-slate-500">Cold</span>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Overview
          </h2>
          <MetricsGrid metrics={metrics} isLoading={isLoading} />
        </section>
        
        {/* Leads Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
      <footer className="backdrop-blur-xl bg-white/70 border-t border-white/20 shadow-lg shadow-blue-100/50 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} Innovation Business Development Solutions. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
