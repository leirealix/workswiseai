
import { useState, useCallback } from 'react';
import { AnalysisState, ThinkingStep, AnalysisResult } from '@/types';

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

    // Simulate file upload process
    await new Promise(resolve => setTimeout(resolve, 1500));

    setState(prev => ({
      ...prev,
      status: 'thinking',
    }));

    // Simulate thinking process
    const step1Id = crypto.randomUUID();
    const step2Id = crypto.randomUUID();
    const step3Id = crypto.randomUUID();
    const step4Id = crypto.randomUUID();

    setState(prev => ({
      ...prev,
      thinkingSteps: [
        {
          id: step1Id,
          description: 'Examining document structure...',
          status: 'in-progress',
        },
      ],
    }));

    await new Promise(resolve => setTimeout(resolve, 1200));

    setState(prev => ({
      ...prev,
      thinkingSteps: [
        {
          id: step1Id,
          description: 'Examining document structure...',
          status: 'complete',
        },
        {
          id: step2Id,
          description: 'Identifying parties and signatories...',
          status: 'in-progress',
        },
      ],
    }));

    await new Promise(resolve => setTimeout(resolve, 1500));

    setState(prev => ({
      ...prev,
      thinkingSteps: [
        {
          id: step1Id,
          description: 'Examining document structure...',
          status: 'complete',
        },
        {
          id: step2Id,
          description: 'Identifying parties and signatories...',
          status: 'complete',
        },
        {
          id: step3Id,
          description: 'Extracting dates and key clauses...',
          status: 'in-progress',
        },
      ],
    }));

    await new Promise(resolve => setTimeout(resolve, 2000));

    setState(prev => ({
      ...prev,
      thinkingSteps: [
        {
          id: step1Id,
          description: 'Examining document structure...',
          status: 'complete',
        },
        {
          id: step2Id,
          description: 'Identifying parties and signatories...',
          status: 'complete',
        },
        {
          id: step3Id,
          description: 'Extracting dates and key clauses...',
          status: 'complete',
        },
        {
          id: step4Id,
          description: 'Generating summary and analysis...',
          status: 'in-progress',
        },
      ],
      status: 'analyzing',
    }));

    await new Promise(resolve => setTimeout(resolve, 1800));

    // Simulate results
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

    setState(prev => ({
      ...prev,
      status: 'complete',
      thinkingSteps: prev.thinkingSteps.map(step => 
        step.id === step4Id ? { ...step, status: 'complete' } : step
      ),
      result: mockResult,
    }));
  }, []);

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
