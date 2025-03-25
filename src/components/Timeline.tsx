
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { AnalysisResult } from '@/types';
import { CalendarIcon, ClockIcon, ChevronDownIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { cn } from '@/lib/utils';

interface TimelineProps {
  keyDates: AnalysisResult['keyDates'];
}

export function Timeline({ keyDates }: TimelineProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Sort dates chronologically
  const sortedDates = [...keyDates].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Calculate if a date is upcoming (within 30 days)
  const isUpcoming = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  };

  // Calculate if a date is past due
  const isPastDue = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <CardTitle>Timeline</CardTitle>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <ChevronDownIcon
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded ? "rotate-180" : "rotate-0"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CardDescription>
            Key dates and deadlines from the document
          </CardDescription>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {sortedDates.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">No dates detected in this document</p>
            ) : (
              <div className="relative pl-6 mt-2">
                {/* Vertical timeline line */}
                <div className="absolute left-[9px] top-1 bottom-1 w-[2px] bg-muted" />
                
                {sortedDates.map((dateItem, index) => (
                  <div key={index} className="mb-4 last:mb-0 relative">
                    {/* Timeline dot */}
                    <div 
                      className={cn(
                        "absolute left-[-6px] top-1 h-3 w-3 rounded-full border-2 border-background",
                        isPastDue(dateItem.date) ? "bg-muted-foreground" : 
                        isUpcoming(dateItem.date) ? "bg-orange-500" : "bg-primary"
                      )}
                    />
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="font-medium text-sm mb-1">{dateItem.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <ClockIcon className="h-3.5 w-3.5 mr-1" />
                          <span 
                            className={cn(
                              isPastDue(dateItem.date) ? "text-muted-foreground line-through" : 
                              isUpcoming(dateItem.date) ? "text-orange-500 font-medium" : ""
                            )}
                          >
                            {formatDate(dateItem.date)}
                          </span>
                          {isUpcoming(dateItem.date) && (
                            <span className="ml-2 px-1.5 py-0.5 bg-orange-100 text-orange-800 text-[10px] rounded-sm font-medium">
                              Upcoming
                            </span>
                          )}
                          {isPastDue(dateItem.date) && (
                            <span className="ml-2 px-1.5 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-sm">
                              Past due
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
