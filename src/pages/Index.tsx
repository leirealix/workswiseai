
import { useState, useEffect } from 'react';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import FileUpload from '@/components/FileUpload';
import ThinkingProcess from '@/components/ThinkingProcess';
import DocumentViewer from '@/components/DocumentViewer';
import AnalysisResult from '@/components/AnalysisResult';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';
import { Message } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Loader2Icon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { state, uploadFile, resetAnalysis } = useDocumentAnalysis();

  const handleSendMessage = (content: string) => {
    // Add user message
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: state.status === 'complete'
          ? "I've analyzed your document. You can explore the results in the panel on the right. Would you like me to focus on any specific part?"
          : "To analyze a document, please upload it using the file uploader on the right panel.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleFileSelect = (file: File) => {
    uploadFile(file).catch(() => {
      toast.error('An error occurred while analyzing the document.');
    });
  };

  useEffect(() => {
    if (state.status === 'complete') {
      toast.success('Document analysis complete!');
    }
  }, [state.status]);

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* Left panel - Chat interface */}
      <div className="w-1/2 h-full flex flex-col border-r">
        <div className="p-4 border-b bg-background/80 backdrop-blur-md">
          <h1 className="text-xl font-semibold">Document Analyzer</h1>
          <p className="text-sm text-muted-foreground">Chat with AI about your legal documents</p>
        </div>
        
        <MessageList messages={messages} />
        
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isDisabled={state.status === 'uploading' || state.status === 'thinking' || state.status === 'analyzing'} 
        />
      </div>
      
      {/* Right panel - Document and analysis */}
      <div className="w-1/2 h-full flex flex-col">
        {/* Status bar */}
        <div className="p-4 border-b flex items-center justify-between bg-background/80 backdrop-blur-md">
          <div>
            <h2 className="text-lg font-medium">
              {state.status === 'idle' && 'Document Analysis'}
              {state.status === 'uploading' && 'Uploading Document...'}
              {state.status === 'thinking' && 'Processing Document...'}
              {state.status === 'analyzing' && 'Analyzing Document...'}
              {state.status === 'complete' && 'Analysis Results'}
              {state.status === 'error' && 'Analysis Error'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {state.status === 'idle' && 'Upload a document to begin analysis'}
              {state.status === 'uploading' && 'Please wait while we upload your document'}
              {state.status === 'thinking' && 'AI is processing your document'}
              {state.status === 'analyzing' && 'Extracting insights from your document'}
              {state.status === 'complete' && 'Review the extracted information'}
              {state.status === 'error' && 'Something went wrong during analysis'}
            </p>
          </div>
          
          {state.status === 'complete' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetAnalysis}
              className="flex items-center gap-1"
            >
              <RefreshCwIcon size={14} />
              <span>New Analysis</span>
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          {/* Idle state - File uploader */}
          {state.status === 'idle' && (
            <div className="h-full flex items-center justify-center">
              <FileUpload onFileSelect={handleFileSelect} />
            </div>
          )}
          
          {/* Loading states */}
          {(state.status === 'uploading' || state.status === 'thinking' || state.status === 'analyzing') && (
            <div className="h-full flex flex-col">
              <div className={cn(
                "flex-1 flex flex-col items-center justify-center p-6 transition-opacity duration-500",
                state.thinkingSteps.length > 0 ? "opacity-20" : "opacity-100"
              )}>
                <Loader2Icon size={40} className="text-primary animate-spin mb-4" />
                <h3 className="text-lg font-medium mb-1">
                  {state.status === 'uploading' && 'Uploading Document...'}
                  {state.status === 'thinking' && 'Processing Document...'}
                  {state.status === 'analyzing' && 'Analyzing Content...'}
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  {state.status === 'uploading' && 'Preparing your document for analysis'}
                  {state.status === 'thinking' && 'The AI is examining your document structure'}
                  {state.status === 'analyzing' && 'Extracting key information and insights'}
                </p>
              </div>
              
              {/* Thinking process overlay */}
              {state.thinkingSteps.length > 0 && (
                <div className="absolute inset-x-0 bottom-0 p-6 glass rounded-t-2xl shadow-lg max-w-md mx-auto transition-all">
                  <h3 className="text-sm font-medium mb-3">Analysis Progress</h3>
                  <ThinkingProcess steps={state.thinkingSteps} />
                </div>
              )}
            </div>
          )}
          
          {/* Results */}
          {state.status === 'complete' && state.file && state.result && (
            <div className="h-full grid grid-cols-2">
              <div className="h-full border-r">
                <DocumentViewer 
                  fileName={state.file.name}
                  result={state.result}
                />
              </div>
              <div className="h-full">
                <AnalysisResult result={state.result} />
              </div>
            </div>
          )}
          
          {/* Error state */}
          {state.status === 'error' && (
            <div className="h-full flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                <RefreshCwIcon size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">Analysis Failed</h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs mb-6">
                {state.error || "Something went wrong during the analysis. Please try again."}
              </p>
              <Button onClick={resetAnalysis}>Try Again</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
