/**
 * Dashboard Types
 * Core type definitions for the Leads Dashboard system
 */

// Lead Hotness levels (internal use only - numbers never exposed to UI)
export type LeadHotness = 'hot' | 'warm' | 'cold';

// Lead intent categories
export type LeadIntent = 'sales' | 'booking' | 'question' | 'support' | 'unknown';

// Lead source information
export interface LeadSource {
  page: string;
  referrer?: string;
  campaign?: string;
}

// Core Lead interface
export interface Lead {
  id: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  intent: LeadIntent;
  hotness: LeadHotness;
  hotnessFactors: HotnessFactor[];
  source: LeadSource;
  conversation: ConversationMessage[];
  extractedInfo: ExtractedInfo;
  suggestedAction: SuggestedAction;
  internalNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Hotness scoring factors (internal - never show numbers to users)
export interface HotnessFactor {
  type?: 'pricing_inquiry' | 'availability_check' | 'contact_provided' | 'high_intent_page' | 'urgency_signal' | 'repeat_visitor';
  name: string;
  description?: string;
  present: boolean;
}

// Conversation message
export interface ConversationMessage {
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  highlights?: string[]; // Extracted key information
}

// Extracted information from conversation
export interface ExtractedInfo {
  businessType?: string;
  businessGoal?: string;
  timeline?: string;
  budget?: string;
  location?: string;
  specialRequirements?: string[];
}

// AI-suggested next action
export interface SuggestedAction {
  type: 'call' | 'email' | 'schedule' | 'follow_up' | 'wait' | 'archive';
  label: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

// Dashboard metrics
export interface DashboardMetrics {
  visits: MetricValue;
  avgTimeSpent: MetricValue;
  bounceRate: MetricValue;
  leadConversions: MetricValue;
}

export interface MetricValue {
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  unit?: string;
  chartData: ChartDataPoint[];
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

// Access control
export interface AccessContext {
  isAuthorized: boolean;
  tenantId: string | null;
  accessLevel: 'owner' | 'admin' | 'viewer' | 'none';
  dataScope: 'all' | 'assigned' | 'none';
  reason?: string;
}

// Lead card preview (subset for list view)
export interface LeadCardPreview {
  id: string;
  fullName: string | null;
  intent: LeadIntent;
  hotness: LeadHotness;
  sourcePage: string;
  createdAt: Date;
  hasUnreadActivity: boolean;
}

// Lead update payload
export interface LeadUpdatePayload {
  internalNotes?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
}

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Metric data alias for components
export type MetricData = MetricValue;
