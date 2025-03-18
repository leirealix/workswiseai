
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ThinkingStep {
  id: string;
  description: string;
  status: 'pending' | 'in-progress' | 'complete' | 'error';
}

export interface DocumentClause {
  id: string;
  title: string;
  content: string;
  page: number;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AnalysisResult {
  parties: string[];
  keyDates: Array<{
    description: string;
    date: string;
  }>;
  clauses: DocumentClause[];
  signatures: Array<{
    name: string;
    role: string;
    page: number;
  }>;
  summary: string;
}

export interface AnalysisState {
  status: 'idle' | 'uploading' | 'thinking' | 'analyzing' | 'complete' | 'error';
  file: File | null;
  thinkingSteps: ThinkingStep[];
  result: AnalysisResult | null;
  error: string | null;
}
