
import { useState, useCallback } from 'react';
import { AnalysisState, ThinkingStep, AnalysisResult } from '@/types';
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Initialize Supabase client with fallback to mock mode if credentials are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if we have valid Supabase credentials
const hasValidSupabaseConfig = supabaseUrl && supabaseAnonKey;

// Only create the client if we have valid credentials
const supabase = hasValidSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function useDocumentAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    file: null,
    thinkingSteps: [],
    result: null,
    error: null,
  });

  // Track whether we're using mockup mode
  const [usingMockMode, setUsingMockMode] = useState(!hasValidSupabaseConfig);

  const addThinkingStep = useCallback((description: string) => {
    setState(prev => ({
      ...prev,
      thinkingSteps: [
        ...prev.thinkingSteps,
        {
          id: crypto.randomUUID(),
          description,
          status: 'pending',
        },
      ],
    }));
  }, []);

  const updateStepStatus = useCallback((id: string, status: ThinkingStep['status']) => {
    setState(prev => ({
      ...prev,
      thinkingSteps: prev.thinkingSteps.map(step => 
        step.id === id ? { ...step, status } : step
      ),
    }));
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    setState({
      status: 'uploading',
      file,
      thinkingSteps: [],
      result: null,
      error: null,
    });

    try {
      // Check if we can use Supabase or need to fall back to mock mode
      if (!hasValidSupabaseConfig) {
        console.warn("Supabase credentials not found. Using mock mode.");
        setUsingMockMode(true);
        toast({
          title: "Using Demo Mode",
          description: "Supabase credentials not configured. Running in demo mode with simulated backend.",
        });
      }

      // Step 1: Upload file to storage (or simulate it)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      addThinkingStep('Uploading document to secure storage...');
      
      if (supabase) {
        // Use real Supabase
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);

        if (uploadError) {
          // If Supabase upload fails, switch to mock mode
          console.warn("Supabase upload failed:", uploadError.message);
          setUsingMockMode(true);
          toast({
            variant: "destructive",
            title: "Storage Error",
            description: "Document upload failed. Switching to demo mode.",
          });
        }
      } else {
        // Simulate upload delay in mock mode
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      updateStepStatus(state.thinkingSteps[state.thinkingSteps.length - 1].id, 'complete');
      
      // Step 2: Create analysis record
      addThinkingStep('Initializing document analysis...');
      setState(prev => ({ ...prev, status: 'thinking' }));
      
      let analysisRecord = null;
      
      if (supabase && !usingMockMode) {
        // Use real Supabase
        const { data: recordData, error: recordError } = await supabase
          .from('document_analyses')
          .insert({
            file_name: file.name,
            file_path: filePath,
            status: 'processing',
            created_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (recordError) {
          console.warn("Supabase record creation failed:", recordError.message);
          setUsingMockMode(true);
          toast({
            variant: "destructive",
            title: "Database Error",
            description: "Could not create analysis record. Switching to demo mode.",
          });
        } else {
          analysisRecord = recordData;
        }
      } else {
        // Simulate record creation delay in mock mode
        await new Promise(resolve => setTimeout(resolve, 800));
        analysisRecord = { id: crypto.randomUUID() };
      }
      
      updateStepStatus(state.thinkingSteps[state.thinkingSteps.length - 1].id, 'complete');
      
      // Step 3: Simulate analysis process (would be an Edge Function in production)
      addThinkingStep('Examining document structure...');
      await new Promise(resolve => setTimeout(resolve, 1200));
      updateStepStatus(state.thinkingSteps[state.thinkingSteps.length - 1].id, 'complete');
      
      addThinkingStep('Identifying parties and signatories...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateStepStatus(state.thinkingSteps[state.thinkingSteps.length - 1].id, 'complete');
      
      addThinkingStep('Extracting dates and key clauses...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus(state.thinkingSteps[state.thinkingSteps.length - 1].id, 'complete');
      
      setState(prev => ({ ...prev, status: 'analyzing' }));
      addThinkingStep('Generating summary and analysis...');
      
      // Step 4: Generate results (or get from Supabase if possible)
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      let resultData = null;
      
      if (supabase && !usingMockMode && analysisRecord) {
        // Try to get real results from Supabase
        const { data, error: resultError } = await supabase
          .from('document_analyses')
          .select('*')
          .eq('id', analysisRecord.id)
          .single();
          
        if (resultError) {
          console.warn("Supabase result fetch failed:", resultError.message);
          setUsingMockMode(true);
        } else {
          resultData = data;
        }
      }
      
      // Use mock data if needed
      const mockResult: AnalysisResult = {
        parties: ['Acme Corporation', 'XYZ Enterprises Ltd.'],
        keyDates: [
          { description: 'Effective Date', date: '2023-06-15' },
          { description: 'Termination Date', date: '2025-06-14' },
          { description: 'First Review', date: '2023-12-15' },
        ],
        clauses: [
          {
            id: crypto.randomUUID(),
            title: 'Confidentiality Clause',
            content: 'Both parties agree to maintain the confidentiality of all proprietary information...',
            page: 2,
            position: { x: 120, y: 350, width: 400, height: 80 },
          },
          {
            id: crypto.randomUUID(),
            title: 'Non-Compete Clause',
            content: 'For a period of 24 months following termination, neither party shall...',
            page: 3,
            position: { x: 120, y: 220, width: 400, height: 100 },
          },
          {
            id: crypto.randomUUID(),
            title: 'Termination Clause',
            content: 'This agreement may be terminated by either party with 60 days written notice...',
            page: 4,
            position: { x: 120, y: 400, width: 400, height: 90 },
          },
        ],
        signatures: [
          { name: 'John Doe', role: 'CEO, Acme Corporation', page: 5 },
          { name: 'Jane Smith', role: 'Director, XYZ Enterprises Ltd.', page: 5 },
        ],
        summary: 'This is a non-exclusive licensing agreement between Acme Corporation and XYZ Enterprises Ltd. for software services, effective for 2 years with automatic renewal provisions. It includes standard confidentiality, non-compete, and termination clauses, with a governing law provision designating New York state law.',
      };
      
      // Update the last step and set the final state
      updateStepStatus(state.thinkingSteps[state.thinkingSteps.length - 1].id, 'complete');
      setState(prev => ({
        ...prev,
        status: 'complete',
        result: resultData?.result || mockResult,
      }));
      
      // Update Supabase record if not in mock mode
      if (supabase && !usingMockMode && analysisRecord) {
        await supabase
          .from('document_analyses')
          .update({
            status: 'completed',
            result: mockResult, // In production, this would be real analysis results
            updated_at: new Date().toISOString(),
          })
          .eq('id', analysisRecord.id);
      }
        
    } catch (error) {
      console.error('Analysis error:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  }, [state.thinkingSteps, addThinkingStep, updateStepStatus, usingMockMode]);

  const resetAnalysis = useCallback(() => {
    setState({
      status: 'idle',
      file: null,
      thinkingSteps: [],
      result: null,
      error: null,
    });
  }, []);

  return {
    state,
    uploadFile,
    addThinkingStep,
    updateStepStatus,
    resetAnalysis,
    usingMockMode,
  };
}
