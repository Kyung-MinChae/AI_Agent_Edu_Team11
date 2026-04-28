export type GradeInterval = 'excellent' | 'good' | 'average' | 'warning';
export type Relevance = 'High' | 'Medium' | 'Low';
export type RiskLevel = 'High' | 'Medium' | 'Low';
export type AnalysisStatus = 'Complete' | 'Analyzing' | 'Waiting';
export type AppPhase = 'setup' | 'analysis' | 'planner' | 'resources';

export interface UserProfile {
  major: string;
  name: string;
  analysisDate: string;
  targetJob: string;
  targetCompany: string;
  prepPeriod: number; // D-day
  gpa: number;
  maxGpa: number;
  coreSubjects: string[];
}

export interface CollectedData {
  category: string;
  content: string;
  relevance: Relevance;
}

export interface GapAnalysisItem {
  capability: string;
  requiredLevel: number; // 1-5
  currentLevel: number; // 1-5
  gap: number;
  indicator: 'red' | 'yellow' | 'none';
}

export interface RiskItem {
  item: string;
  grade: RiskLevel;
  deadline: string;
  action: string;
}

export interface PlannerConfig {
  years: number; // 1-4
  gapYears: number; // 0, 1, 2
}

export interface ToDoItem {
  id: string;
  task: string;
  completed: boolean;
  category: 'academic' | 'spec' | 'career';
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'resume' | 'portfolio' | 'interview' | 'coding';
  description: string;
  content?: string;
}

export interface TranscriptRecord {
  courseName: string;
  credits: number;
  grade: string;
}
