'use client';

/**
 * MetricsCard Component
 * Displays a single metric with trend and mini chart
 */

import React from 'react';
import { MetricData } from '../types';

interface MetricsCardProps {
  title: string;
  metric: MetricData;
  icon: React.ReactNode;
  formatValue?: (value: number) => string;
}

export function MetricsCard({ title, metric, icon, formatValue }: MetricsCardProps) {
  const formattedValue = formatValue 
    ? formatValue(metric.current) 
    : metric.current.toLocaleString();
  
  const trendColor = metric.trend === 'up' 
    ? 'text-green-600' 
    : metric.trend === 'down' 
      ? title.toLowerCase().includes('bounce') ? 'text-green-600' : 'text-red-600'
      : 'text-gray-500';
  
  const trendIcon = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→';
  
  // Calculate chart dimensions
  const chartWidth = 80;
  const chartHeight = 24;
  const chartData = metric.chartData || [];
  
  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const minValue = Math.min(...chartData.map(d => d.value), 0);
  const range = maxValue - minValue || 1;
  
  const points = chartData.map((d, i) => {
    const x = (i / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - ((d.value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <span className="text-lg">{icon}</span>
            <span>{title}</span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formattedValue}
              {metric.unit && <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>}
            </span>
          </div>
          
          <div className={`flex items-center gap-1 mt-2 text-sm ${trendColor}`}>
            <span>{trendIcon}</span>
            <span>{metric.trendPercentage.toFixed(1)}%</span>
            <span className="text-gray-400 text-xs">vs last week</span>
          </div>
        </div>
        
        {chartData.length > 1 && (
          <div className="flex-shrink-0 ml-4">
            <svg width={chartWidth} height={chartHeight} className="overflow-visible">
              <polyline
                points={points}
                fill="none"
                stroke={metric.trend === 'up' ? '#22c55e' : metric.trend === 'down' ? '#ef4444' : '#6b7280'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * MetricsGrid Component
 * Displays all dashboard metrics in a grid
 */

interface MetricsGridProps {
  metrics: {
    visits: MetricData;
    avgTimeSpent: MetricData;
    bounceRate: MetricData;
    leadConversions: MetricData;
  } | null;
  isLoading?: boolean;
}

export function MetricsGrid({ metrics, isLoading }: MetricsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }
  
  if (!metrics) return null;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="Total Visits"
        metric={metrics.visits}
        icon="👥"
      />
      <MetricsCard
        title="Avg. Time Spent"
        metric={metrics.avgTimeSpent}
        icon="⏱️"
        formatValue={formatTime}
      />
      <MetricsCard
        title="Bounce Rate"
        metric={metrics.bounceRate}
        icon="↩️"
      />
      <MetricsCard
        title="Lead Conversions"
        metric={metrics.leadConversions}
        icon="🎯"
      />
    </div>
  );
}

export default MetricsCard;
