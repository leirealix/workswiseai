
import { useState, useCallback } from 'react';
import { AnalysisState, ThinkingStep, AnalysisResult } from '@/types';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useDocumentAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    file: null,
    thinkingSteps: [],
    result: null,
    error: null,
  });

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
      // Step 1: Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `documents/${fileName}`;
      
      addThinkingStep('Uploading document to secure storage...');
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Error uploading file: ${uploadError.message}`);
      }
      
      updateStepStatus(state.thinkingSteps[state.thinkingSteps.length - 1].id, 'complete');
      
      // Step 2: Create analysis record
      addThinkingStep('Initializing document analysis...');
      setState(prev => ({ ...prev, status: 'thinking' }));
      
      const { data: analysisRecord, error: recordError } = await supabase
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
        throw new Error(`Error creating analysis record: ${recordError.message}`);
      }
      
      updateStepStatus(state.thinkingSteps[state.thinkingSteps.length - 1].id, 'complete');
      
      // Step 3: Call analysis function (would be an Edge Function in production)
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
      
      // Step 4: Poll for result or simulate for demo
      // In a real implementation, we would poll an endpoint to check when analysis is complete
      await new Promise(resolve => setTimeout(resolve, 1800));
      
      // Simulate getting analysis results from Supabase
      const { data: resultData, error: resultError } = await supabase
        .from('document_analyses')
        .select('*')
        .eq('id', analysisRecord.id)
        .single();
        
      if (resultError) {
        throw new Error(`Error fetching analysis results: ${resultError.message}`);
      }
      
      // For demo purposes, we're still using mock data
      // In production, this would come from the database
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
        result: mockResult,
      }));
      
      // In a real implementation, we would update the analysis record
      await supabase
        .from('document_analyses')
        .update({
          status: 'completed',
          result: mockResult,
          updated_at: new Date().toISOString(),
        })
        .eq('id', analysisRecord.id);
        
    } catch (error) {
      console.error('Analysis error:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }));
    }
  }, [state.thinkingSteps, addThinkingStep, updateStepStatus]);

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
  };
}
