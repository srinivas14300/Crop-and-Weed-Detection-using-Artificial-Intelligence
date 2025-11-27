
export enum AppView {
  DETECTOR = 'DETECTOR',
  DOCUMENTATION = 'DOCUMENTATION',
  HISTORY = 'HISTORY',
  REPORTS = 'REPORTS',
}

export type Theme = 'light' | 'dark';

export interface AnalysisResult {
  classification: 'Crop' | 'Weed' | 'Unknown';
  confidence: number;
  explanation: string;
  // New fields
  typeName?: string;
  aiReasoning?: string;
  summary?: string;
  growthInfo?: string;
  solutions?: string[];
  droneActions?: string[];
}

export interface HistoryItem extends AnalysisResult {
  id: string;
  timestamp: number;
  imageData?: string; // Optional for lightweight storage
}

export interface ReportItem {
  id: string;
  timestamp: number;
  image?: string; // Optional for lightweight storage
  classification: string;
  confidence: number;
  status: 'Processing' | 'Ready';
  summary?: string;
  explanation?: string;
  recommendations?: string[]; // Legacy field, kept for compatibility
  
  // New Agronomy Analysis Fields
  typeName?: string;
  aiReasoning?: string;
  growthInfo?: string;
  solutions?: string[];
  droneActions?: string[];
}

export interface GemniResponseSchema {
  classification: string;
  confidence: number;
  explanation: string;
}
