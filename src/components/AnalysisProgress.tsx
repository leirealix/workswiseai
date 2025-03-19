
import { Progress } from '@/components/ui/progress';
import { ThinkingStep } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2Icon, AlertCircleIcon, ClockIcon, ListChecksIcon, HelpCircleIcon } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalysisProgressProps {
  status: 'idle' | 'uploading' | 'thinking' | 'analyzing' | 'complete' | 'error';
  progress: number;
  steps: ThinkingStep[];
  error?: string;
  onFollowUpSelected?: (question: string) => void;
}

export default function AnalysisProgress({ 
  status, 
  progress, 
  steps, 
  error, 
  onFollowUpSelected 
}: AnalysisProgressProps) {
  if (status === 'idle') return null;
  
  const completedSteps = steps.filter(step => step.status === 'complete').length;
  const totalSteps = steps.length;
  const stepsProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const displayProgress = status === 'complete' ? 100 : progress || stepsProgress;

  // Suggested follow-up questions after analysis completion
  const followUpQuestions = [
    "Can you explain this document in simpler terms?",
    "What are the key risks in this agreement?",
    "Highlight the most important dates and deadlines.",
    "Are there any unusual clauses I should be aware of?"
  ];

  return (
    <div className="p-4 border rounded-lg bg-card space-y-3 text-sm animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">
          {status === 'uploading' && 'Uploading Document...'}
          {status === 'thinking' && 'Processing Document...'}
          {status === 'analyzing' && 'Analyzing Content...'}
          {status === 'complete' && 'Analysis Complete'}
          {status === 'error' && 'Analysis Failed'}
        </h3>
        
        {status === 'complete' ? (
          <CheckCircle2Icon className="h-4 w-4 text-green-500" />
        ) : status === 'error' ? (
          <AlertCircleIcon className="h-4 w-4 text-destructive" />
        ) : (
          <ClockIcon className="h-4 w-4 text-muted-foreground animate-pulse" />
        )}
      </div>
      
      <Progress value={displayProgress} className="h-2" />
      
      <div className="text-xs text-muted-foreground">
        {status === 'error' ? (
          <span className="text-destructive">{error || 'An error occurred during analysis'}</span>
        ) : status === 'complete' ? (
          <span>Analysis completed successfully</span>
        ) : (
          <span>
            {totalSteps > 0 ? `${completedSteps}/${totalSteps} steps completed` : 'Processing...'}
          </span>
        )}
      </div>
      
      {steps.length > 0 && (
        <ScrollArea className="max-h-32 pt-1">
          <div className="space-y-1">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={cn(
                  "py-1.5 flex items-center text-xs",
                  step.status === 'in-progress' ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center mr-2",
                  step.status === 'pending' ? "border border-muted-foreground/30" : 
                  step.status === 'in-progress' ? "bg-primary/10 text-primary animate-pulse" : 
                  step.status === 'complete' ? "bg-green-500/10 text-green-500" :
                  "bg-destructive/10 text-destructive"
                )}>
                  {index + 1}
                </span>
                <span className="truncate">{step.description}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Analysis Summary - shown only when analysis is complete */}
      {status === 'complete' && (
        <div className="mt-4 space-y-3">
          <Separator />
          
          <div className="flex items-center gap-2 text-foreground">
            <ListChecksIcon className="h-4 w-4" />
            <h4 className="font-medium">Analysis Summary</h4>
          </div>
          
          <Alert className="bg-muted/50 border-muted">
            <AlertTitle>How this document was analyzed</AlertTitle>
            <AlertDescription className="text-xs space-y-2 mt-2">
              <p>The document went through multiple stages of processing:</p>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Text extraction and OCR for machine readability</li>
                <li>Structure analysis to identify sections and clauses</li>
                <li>Entity recognition for parties, dates, and key terms</li>
                <li>Legal pattern matching against common clause templates</li>
                <li>Semantic analysis to understand document context</li>
              </ol>
            </AlertDescription>
          </Alert>
          
          <div className="flex items-center gap-2 text-foreground">
            <HelpCircleIcon className="h-4 w-4" />
            <h4 className="font-medium">Ask Follow-up Questions</h4>
          </div>
          
          <ScrollArea className="max-h-[200px]">
            <div className="space-y-2 pb-2">
              {followUpQuestions.map((question, index) => (
                <div 
                  key={index}
                  className="text-xs p-2 bg-secondary/30 rounded-md cursor-pointer hover:bg-secondary/50 transition-colors"
                  role="button"
                  onClick={() => onFollowUpSelected && onFollowUpSelected(question)}
                >
                  {question}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
