import { useState, useEffect, useRef } from 'react';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import FileUpload from '@/components/FileUpload';
import ThinkingProcess from '@/components/ThinkingProcess';
import DocumentViewer from '@/components/DocumentViewer';
import AnalysisResult from '@/components/AnalysisResult';
import AnalysisProgress from '@/components/AnalysisProgress';
import WelcomeAnimation from '@/components/WelcomeAnimation';
import ResultsPanel from '@/components/ResultsPanel';
import Sidebar from '@/components/Sidebar';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';
import { Message } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Loader2Icon, RefreshCwIcon, MaximizeIcon, MinimizeIcon, CodeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendMessageToAIAgent } from '@/services/aiAgentService';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { state, uploadFile, resetAnalysis } = useDocumentAnalysis();
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [leftPanelExpanded, setLeftPanelExpanded] = useState(false);
  const [isWaitingForAI, setIsWaitingForAI] = useState(false);
  const conversationIdRef = useRef<string | undefined>(undefined);
  const [showComparison, setShowComparison] = useState<boolean>(false);
  const [showOnlyChatPanel, setShowOnlyChatPanel] = useState<boolean>(true);
  const [showFullPreview, setShowFullPreview] = useState<boolean>(false);
  
  const handleSendMessage = async (content: string) => {
    const userMessageId = crypto.randomUUID();
    const newMessage: Message = {
      id: userMessageId,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsWaitingForAI(true);
    
    if (showOnlyChatPanel) {
      setShowOnlyChatPanel(false);
    }
    
    try {
      const response = await sendMessageToAIAgent(content, conversationIdRef.current);
      
      conversationIdRef.current = response.conversationId;
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        variant: "destructive",
        title: "Communication Error",
        description: "Failed to connect to the AI agent system."
      });
    } finally {
      setIsWaitingForAI(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (showOnlyChatPanel) {
      setShowOnlyChatPanel(false);
    }
    
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

  const handleFileUpload = (file: File) => {
    console.log("File upload triggered with:", file.name);
    handleFileSelect(file);
  };

  const handleFollowUpQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleNewConversation = () => {
    setMessages([]);
    resetAnalysis();
    conversationIdRef.current = undefined;
    setShowOnlyChatPanel(true);
    toast({
      title: "Conversation Reset",
      description: "Started a new conversation"
    });
  };

  const toggleLeftPanel = () => {
    setLeftPanelExpanded(!leftPanelExpanded);
  };

  const toggleViewMode = () => {
    setShowFullPreview(!showFullPreview);
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
        content: "I've completed analyzing your document. You can see the results in the left panel. Feel free to ask me any questions about it.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, completionMessage]);
    }
  }, [state.status]);

  useEffect(() => {
    console.log("Index component mounted, current state:", state);
  }, []);

  return (
    <div className="h-full w-full overflow-hidden flex items-center justify-center bg-background" style={{ height: '100vh' }}>
      <div className="flex h-full w-full">
        <Sidebar />
        
        {showOnlyChatPanel ? (
          <div className="h-full w-full max-w-3xl mx-auto flex flex-col items-center justify-center">
            <div className="flex-1 flex flex-col items-center justify-center w-full">
              <MessageList 
                messages={messages} 
                isWaiting={isWaitingForAI}
                onSendMessage={handleSendMessage}
                onFileUpload={handleFileSelect}
                onNewConversation={handleNewConversation}
                isDisabled={isWaitingForAI || state.status === 'uploading' || state.status === 'thinking' || state.status === 'analyzing'} 
              />
            </div>
          </div>
        ) : (
          <ResizablePanelGroup 
            direction="horizontal" 
            className="h-full w-full"
          >
            <ResizablePanel 
              defaultSize={50} 
              minSize={20}
              maxSize={leftPanelExpanded ? 100 : 80} 
              className={cn(
                "transition-all duration-300",
                leftPanelCollapsed && "!w-[80px] min-w-[80px] !max-w-[80px]"
              )}
              collapsible={leftPanelCollapsed}
              collapsedSize={5}
            >
              <div className="h-full flex flex-col">
                <div className={cn(
                  "flex items-center justify-between bg-background/80 backdrop-blur-md",
                  leftPanelCollapsed ? "p-2" : "p-4"
                )}>
                  <div className={leftPanelCollapsed ? "hidden" : "block"}>
                    <div className="flex items-center">
                      <h2 className="text-lg font-medium mr-2">
                        {state.status === 'idle' && 'Preview'}
                        {state.status === 'uploading' && 'Uploading Document...'}
                        {state.status === 'thinking' && 'Processing Document...'}
                        {state.status === 'analyzing' && 'Analyzing Document...'}
                        {state.status === 'complete' && 'Analysis Results'}
                        {state.status === 'error' && 'Analysis Error'}
                      </h2>
                      {state.status === 'complete' && (
                        <div className="bg-black/20 rounded-md p-1 flex items-center">
                          <Switch 
                            id="view-mode" 
                            checked={showFullPreview}
                            onCheckedChange={toggleViewMode}
                            className="mr-1"
                          />
                          <CodeIcon size={16} className="text-primary" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {state.status === 'idle' && ''}
                      {state.status === 'uploading' && 'Please wait while we upload your document'}
                      {state.status === 'thinking' && 'AI is processing your document'}
                      {state.status === 'analyzing' && 'Extracting insights from your document'}
                      {state.status === 'complete' && (showFullPreview ? 'Full document preview' : 'Review the extracted information')}
                      {state.status === 'error' && 'Something went wrong during analysis'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={leftPanelExpanded ? toggleLeftPanel : toggleLeftPanel}
                      className="flex-shrink-0 ml-2"
                      aria-label={leftPanelExpanded ? "Restore split view" : "Maximize panel"}
                    >
                      {leftPanelExpanded ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {state.status === 'idle' && (
                    <ScrollArea className="h-full">
                      <div className="h-full flex items-center justify-center">
                        <WelcomeAnimation />
                      </div>
                    </ScrollArea>
                  )}
                  
                  {(state.status === 'uploading' || state.status === 'thinking' || state.status === 'analyzing') && (
                    <ScrollArea className="h-full">
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
                    </ScrollArea>
                  )}
                  
                  {state.status === 'complete' && state.file && state.result && (
                    <div className="h-full">
                      {showComparison ? (
                        <ResizablePanelGroup direction="horizontal" className="h-full">
                          <ResizablePanel defaultSize={50}>
                            <ScrollArea className="h-full">
                              <DocumentViewer 
                                fileName={state.file.name}
                                result={state.result}
                                comparison={true}
                              />
                            </ScrollArea>
                          </ResizablePanel>
                          <ResizableHandle withHandle />
                          <ResizablePanel defaultSize={50}>
                            <ScrollArea className="h-full">
                              <DocumentViewer 
                                fileName="Comparison Document"
                                result={state.result}
                                comparison={true}
                              />
                            </ScrollArea>
                          </ResizablePanel>
                        </ResizablePanelGroup>
                      ) : (
                        showFullPreview ? (
                          <DocumentViewer 
                            fileName={state.file.name}
                            result={state.result}
                            comparison={false}
                          />
                        ) : (
                          <ResultsPanel result={state.result} />
                        )
                      )}
                    </div>
                  )}
                  
                  {state.status === 'error' && (
                    <ScrollArea className="h-full">
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
                    </ScrollArea>
                  )}
                </div>
              </div>
            </ResizablePanel>

            {!leftPanelCollapsed && !leftPanelExpanded && <ResizableHandle withHandle />}
            
            <ResizablePanel 
              defaultSize={50} 
              minSize={20}
              maxSize={80}
              className={cn(
                "transition-all duration-300",
                (leftPanelExpanded || leftPanelCollapsed) && "!w-[calc(100%-80px)] !min-w-[calc(100%-80px)] !max-w-[calc(100%-80px)]",
                leftPanelExpanded && "hidden"
              )}
            >
              <div className="h-full flex flex-col items-center justify-center">
                <ScrollArea className="flex-1 w-full overflow-hidden">
                  <div className="flex flex-col h-full items-center justify-center">
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
                    
                    <div className="flex-1 w-full max-w-2xl mx-auto">
                      <MessageList messages={messages} isWaiting={isWaitingForAI} />
                    </div>
                  </div>
                </ScrollArea>
                
                <div className="w-full max-w-2xl mx-auto">
                  <ChatInput 
                    onSendMessage={handleSendMessage} 
                    onFileUpload={handleFileSelect}
                    onNewConversation={handleNewConversation}
                    isDisabled={isWaitingForAI || state.status === 'uploading' || state.status === 'thinking' || state.status === 'analyzing'} 
                  />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default Index;
