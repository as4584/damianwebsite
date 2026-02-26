'use client';

/**
 * Hotness Indicator Component
 * Visual representation of lead hotness with hover explanation
 */

import React, { useState, useRef, useEffect } from 'react';
import { LeadHotness, HotnessFactor } from '../types';
import { getHotnessExplanation } from '../services/scoringService';

interface HotnessIndicatorProps {
  hotness: LeadHotness;
  factors: HotnessFactor[];
  size?: 'sm' | 'md' | 'lg';
}

const hotnessConfig = {
  hot: {
    emoji: '🔥',
    label: 'Hot Lead',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700'
  },
  warm: {
    emoji: '🟡',
    label: 'Warm Lead',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700'
  },
  cold: {
    emoji: '⚪',
    label: 'Cold Lead',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-600'
  }
};

const sizeConfig = {
  sm: 'text-sm px-2 py-0.5',
  md: 'text-base px-3 py-1',
  lg: 'text-lg px-4 py-2'
};

export function HotnessIndicator({ hotness, factors, size = 'md' }: HotnessIndicatorProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const config = hotnessConfig[hotness];
  
  // Determine tooltip position based on available space
  useEffect(() => {
    if (showExplanation && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow < 200 ? 'top' : 'bottom');
    }
  }, [showExplanation]);
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setShowExplanation(false);
      }
    };
    
    if (showExplanation) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showExplanation]);
  
  const explanation = getHotnessExplanation(hotness, factors);
  
  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setShowExplanation(!showExplanation)}
        onMouseEnter={() => setShowExplanation(true)}
        onMouseLeave={() => setShowExplanation(false)}
        className={`
          inline-flex items-center gap-1.5 rounded-full border
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          ${sizeConfig[size]}
          cursor-help transition-all hover:shadow-sm
        `}
        aria-label={`${config.label}: Click for details`}
      >
        <span role="img" aria-hidden="true">{config.emoji}</span>
        <span className="font-medium">{config.label}</span>
      </button>
      
      {showExplanation && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 w-72 p-4 bg-white rounded-lg shadow-lg border border-gray-200
            ${position === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'}
            left-0
          `}
          role="tooltip"
        >
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
            <span className="text-xl">{config.emoji}</span>
            <span className={`font-semibold ${config.textColor}`}>{config.label}</span>
          </div>
          
          <p className="text-sm text-gray-700 leading-relaxed">
            {explanation}
          </p>
          
          {factors.filter(f => f.present).length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">What we noticed:</p>
              <ul className="space-y-1">
                {factors.filter(f => f.present).map((factor, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-center gap-1.5">
                    <span className="text-green-500">✓</span>
                    {factor.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div 
            className={`
              absolute w-3 h-3 bg-white border-gray-200 transform rotate-45
              ${position === 'bottom' 
                ? '-top-1.5 left-6 border-l border-t' 
                : '-bottom-1.5 left-6 border-r border-b'
              }
            `}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Compact hotness badge for list views
 */
interface HotnessBadgeProps {
  hotness: LeadHotness;
}

export function HotnessBadge({ hotness }: HotnessBadgeProps) {
  const config = hotnessConfig[hotness];
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5
        ${config.bgColor} ${config.borderColor} ${config.textColor} border
      `}
      title={config.label}
    >
      <span role="img" aria-hidden="true">{config.emoji}</span>
    </span>
  );
}

export default HotnessIndicator;
