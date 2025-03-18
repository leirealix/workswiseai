import { useState, useEffect } from 'react';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import FileUpload from '@/components/FileUpload';
import ThinkingProcess from '@/components/ThinkingProcess';
import DocumentViewer from '@/components/DocumentViewer';
import AnalysisResult from '@/components/AnalysisResult';
import AnalysisProgress from '@/components/AnalysisProgress';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';
import { Message } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Loader2Icon, RefreshCwIcon, UploadIcon, MaximizeIcon, MinimizeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { state, uploadFile, resetAnalysis } = useDocumentAnalysis();
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelExpanded, setRightPanelExpanded] = useState(false);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: state.status === 'complete'
          ? "I've analyzed your document. You can explore the results in the panel on the right. Would you like me to focus on any specific part?"
          : "To analyze a document, please upload it using the file upload button below or in the right panel.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleFileSelect = (file: File) => {
    uploadFile(file).catch(() => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "An error occurred while analyzing the document."
      });
    });

    const uploadMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Uploading document: ${file.name}`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, uploadMessage]);
  };

  const handleFollowUpQuestion = (question: string) => {
    handleSendMessage(question);
  };

  useEffect(() => {
    if (state.status === 'complete') {
      toast({
        title: "Analysis Complete",
        description: "Document analysis has been completed successfully!"
      });
      
      const completionMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I've completed analyzing your document. You can see the results in the right panel. Feel free to ask me any questions about it.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, completionMessage]);
    }
  }, [state.status]);

  const toggleLeftPanel = () => {
    setLeftPanelCollapsed(!leftPanelCollapsed);
    setRightPanelExpanded(false);
  };

  const toggleRightPanel = () => {
    setRightPanelExpanded(!rightPanelExpanded);
    setLeftPanelCollapsed(rightPanelExpanded ? false : true);
  };

  useEffect(() => {
    console.log("Index component mounted, current state:", state);
  }, []);

  return (
    <div className="h-full w-full overflow-hidden" style={{ height: '100vh' }}>
      <ResizablePanelGroup 
        direction="horizontal" 
        className="h-full"
      >
        <ResizablePanel 
          defaultSize={50} 
          minSize={20}
          maxSize={80} 
          className={cn(
            "transition-all duration-300",
            leftPanelCollapsed && "!w-[80px] min-w-[80px] !max-w-[80px]"
          )}
          collapsible={leftPanelCollapsed}
          collapsedSize={5}
        >
          <div className="h-full flex flex-col border-r">
            <div className="p-4 border-b bg-background/80 backdrop-blur-md flex justify-between items-center">
              <div className={leftPanelCollapsed ? "hidden" : "block"}>
                <h1 className="text-xl font-semibold">AI Lawyer</h1>
                <p className="text-sm text-muted-foreground">Chat with AI about your legal documents</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleLeftPanel}
                className="flex-shrink-0"
              >
                {leftPanelCollapsed ? <MaximizeIcon size={18} /> : <MinimizeIcon size={18} />}
              </Button>
            </div>
            
            {!leftPanelCollapsed && (
              <>
                {state.thinkingSteps.length > 0 && (
                  <div className="px-4 py-3">
                    <AnalysisProgress 
                      status={state.status} 
                      progress={0} 
                      steps={state.thinkingSteps}
                      onFollowUpSelected={handleFollowUpQuestion}
                    />
                  </div>
                )}
                
                <MessageList messages={messages} />
                
                <div className="px-4 py-2 border-t flex items-center gap-2 bg-muted/20">
                  {state.status === 'idle' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = '.pdf,.doc,.docx,.txt';
                        fileInput.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files && files.length > 0) {
                            handleFileSelect(files[0]);
                          }
                        };
                        fileInput.click();
                      }}
                    >
                      <UploadIcon size={14} />
                      <span>Upload Document</span>
                    </Button>
                  )}
                  
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
                
                <ChatInput 
                  onSendMessage={handleSendMessage} 
                  isDisabled={state.status === 'uploading' || state.status === 'thinking' || state.status === 'analyzing'} 
                />
              </>
            )}
          </div>
        </ResizablePanel>

        {!leftPanelCollapsed && !rightPanelExpanded && <ResizableHandle withHandle />}
        
        <ResizablePanel 
          defaultSize={50} 
          minSize={20}
          maxSize={80}
          className={cn(
            "transition-all duration-300",
            rightPanelExpanded && "!w-[calc(100%-80px)] !min-w-[calc(100%-80px)] !max-w-[calc(100%-80px)]"
          )}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-background/80 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-medium">
                  {state.status === 'idle' && 'Preview'}
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
              
              <div className="flex items-center gap-2">
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
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={toggleRightPanel}
                  className="flex-shrink-0 ml-2"
                >
                  {rightPanelExpanded ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {state.status === 'idle' && (
                <div className="h-full flex items-center justify-center">
                  <FileUpload onFileSelect={handleFileSelect} />
                </div>
              )}
              
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
                  
                  {state.thinkingSteps.length > 0 && (
                    <div className="absolute inset-x-0 bottom-0 p-6 glass rounded-t-2xl shadow-lg max-w-md mx-auto transition-all">
                      <h3 className="text-sm font-medium mb-3">Analysis Progress</h3>
                      <ThinkingProcess steps={state.thinkingSteps} />
                    </div>
                  )}
                </div>
              )}
              
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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;
