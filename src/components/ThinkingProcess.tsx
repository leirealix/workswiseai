
import { ThinkingStep } from '@/types';
import { cn } from '@/lib/utils';
import { CircleCheckIcon, CircleDotIcon, CircleAlertIcon, Loader2Icon } from 'lucide-react';

interface ThinkingProcessProps {
  steps: ThinkingStep[];
}

export default function ThinkingProcess({ steps }: ThinkingProcessProps) {
  if (steps.length === 0) return null;

  return (
    <div className="w-full space-y-1 animate-enter">
      {steps.map((step, index) => (
        <div 
          key={step.id}
          className={cn(
            "flex items-center p-3 rounded-lg transition-all",
            step.status === 'in-progress' ? "bg-muted/40" : "bg-transparent"
          )}
        >
          <div className="flex-shrink-0 mr-3">
            {step.status === 'pending' && (
              <CircleDotIcon className="w-5 h-5 text-muted-foreground" />
            )}
            {step.status === 'in-progress' && (
              <Loader2Icon className="w-5 h-5 text-primary animate-spin" />
            )}
            {step.status === 'complete' && (
              <CircleCheckIcon className="w-5 h-5 text-green-500" />
            )}
            {step.status === 'error' && (
              <CircleAlertIcon className="w-5 h-5 text-destructive" />
            )}
          </div>
          <div className="flex-1">
            <p className={cn(
              "text-sm",
              step.status === 'in-progress' ? "text-foreground" : "text-muted-foreground"
            )}>
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
