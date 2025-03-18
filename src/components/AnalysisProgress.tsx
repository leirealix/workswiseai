
import { Progress } from '@/components/ui/progress';
import { ThinkingStep } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2Icon, AlertCircleIcon, ClockIcon } from 'lucide-react';

interface AnalysisProgressProps {
  status: 'idle' | 'uploading' | 'thinking' | 'analyzing' | 'complete' | 'error';
  progress: number;
  steps: ThinkingStep[];
  error?: string;
}

export default function AnalysisProgress({ status, progress, steps, error }: AnalysisProgressProps) {
  if (status === 'idle') return null;
  
  const completedSteps = steps.filter(step => step.status === 'complete').length;
  const totalSteps = steps.length;
  const stepsProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const displayProgress = status === 'complete' ? 100 : progress || stepsProgress;

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
      
      {steps.length > 0 && status !== 'complete' && status !== 'error' && (
        <div className="max-h-32 overflow-y-auto space-y-1 pt-1">
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
      )}
    </div>
  );
}
