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
import { LeadList } from './components/LeadCard';
import { AnalyticsSection } from './components/AnalyticsSection';
import { LeadCardPreview, LeadHotness } from './types';

export default function DashboardPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadCardPreview[]>([]);
  const [counts, setCounts] = useState<{ hot: number; warm: number; cold: number; total: number } | null>(null);
  const [filter, setFilter] = useState<'all' | LeadHotness>('all');
  const [isLoading, setIsLoading] = useState(true);

  const homeHref = process.env.NEXT_PUBLIC_SITE_URL || '/';
  
  useEffect(() => {
    async function loadDashboard() {
      try {
        // SECURITY: Call API routes (not direct service calls)
        // API validates session and businessId ownership
        const [leadsRes, countsRes] = await Promise.all([
          fetch('/dashboard/api/leads?view=preview').then(r => r.json()),
          fetch('/dashboard/api/metrics?type=counts').then(r => r.json())
        ]);
        
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

            <div className="flex items-center gap-3">
              <a
                href={homeHref}
                className="px-5 py-2.5 bg-white/80 text-gray-800 font-medium rounded-xl shadow-lg shadow-blue-100/40 hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 border border-white/20"
              >
                Back to Homepage
              </a>

              <button
                onClick={handleLogout}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-300/50 transition-all duration-300 hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Section */}
        <AnalyticsSection />
        
        {/* Leads Section */}
        <section className="mt-10">
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
