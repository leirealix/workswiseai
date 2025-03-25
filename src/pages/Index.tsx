
import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Sidebar from '@/components/Sidebar';
import WelcomeAnimation from '@/components/WelcomeAnimation';
import MessageList from '@/components/MessageList';
import ChatInput from '@/components/ChatInput';
import DocumentViewer from '@/components/DocumentViewer';
import AnalysisProgress from '@/components/AnalysisProgress';
import ThinkingProcess from '@/components/ThinkingProcess';
import AnalysisResult from '@/components/AnalysisResult';
import ResultsPanel from '@/components/ResultsPanel';
import FileUpload from '@/components/FileUpload';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';
import { toast } from '@/hooks/use-toast';

export default function Index() {
  const { 
    status, 
    file, 
    setFile, 
    thinkingSteps, 
    result, 
    analyzeDocument, 
    error 
  } = useDocumentAnalysis();

  const handleFileSelect = (file: File) => {
    setFile(file);
  };

  const handleAnalyze = () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file first",
        variant: "destructive",
      });
      return;
    }
    analyzeDocument();
  };

  // Save conversation to history
  const saveToHistory = () => {
    if (status === 'completed' && result) {
      const historyItem = {
        id: `hist-${Date.now()}`,
        query: file?.name || 'Document Analysis',
        result: JSON.stringify(result),
        timestamp: new Date().toISOString()
      };

      const savedHistory = localStorage.getItem('conversationHistory');
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      history.push(historyItem);
      localStorage.setItem('conversationHistory', JSON.stringify(history));
    }
  };

  // When analysis is completed, save to history
  useEffect(() => {
    if (status === 'completed' && result) {
      saveToHistory();
    }
  }, [status, result]);

  // Handle saving document to storage
  const saveToDocuments = () => {
    if (status === 'completed' && result) {
      const newDocument = {
        id: `doc-${Date.now()}`,
        title: file?.name || 'Untitled Document',
        createdAt: new Date().toISOString(),
        content: JSON.stringify(result)
      };

      const savedDocuments = localStorage.getItem('savedDocuments');
      const documents = savedDocuments ? JSON.parse(savedDocuments) : [];
      documents.push(newDocument);
      localStorage.setItem('savedDocuments', JSON.stringify(documents));

      toast({
        title: "Document saved",
        description: "Document saved to your collection",
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Main panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {status === 'idle' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-lg p-8">
                  <WelcomeAnimation />
                  <FileUpload onFileSelect={handleFileSelect} />
                  {file && (
                    <div className="flex justify-center">
                      <button 
                        onClick={handleAnalyze}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                      >
                        Analyze Document
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {status === 'analyzing' && (
              <div className="flex-1 overflow-auto">
                <AnalysisProgress />
                <ThinkingProcess steps={thinkingSteps} />
              </div>
            )}

            {status === 'completed' && (
              <div className="flex-1 overflow-auto p-6">
                <AnalysisResult result={result} onSave={saveToDocuments} />
              </div>
            )}

            {status === 'error' && (
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-destructive/10 text-destructive p-6 rounded-lg max-w-md">
                  <h3 className="text-lg font-medium mb-2">Analysis Error</h3>
                  <p>{error || 'There was an error analyzing your document. Please try again.'}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-background border border-input rounded-md"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results panel - only show when analysis is completed */}
          {status === 'completed' && result && (
            <ResultsPanel result={result} />
          )}
        </div>

        {/* Message input area - only show when not in idle state */}
        {status !== 'idle' && (
          <div className="border-t p-4">
            <ChatInput 
              onSend={(message) => {
                console.log('Message sent:', message);
                // Here you would handle sending messages to the AI
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
