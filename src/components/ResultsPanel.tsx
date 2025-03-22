
import { useState } from 'react';
import { AnalysisResult } from '@/types';
import { 
  FileTextIcon, AlertTriangleIcon, EditIcon, 
  DownloadIcon, MailIcon, LinkIcon, ExternalLinkIcon,
  InfoIcon, SearchIcon, FlagIcon, BarChartIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';

interface ResultsPanelProps {
  result: AnalysisResult;
  fileName: string;
}

export default function ResultsPanel({ result, fileName }: ResultsPanelProps) {
  const [openSection, setOpenSection] = useState<string | null>('summary');
  
  const handleExport = () => {
    toast({
      title: "Exporting Results",
      description: "Preparing your document for download..."
    });
  };
  
  const handleSendEmail = () => {
    toast({
      title: "Email Draft Created",
      description: "Opening email client with results summary..."
    });
  };
  
  const handleOpenInIManage = () => {
    toast({
      title: "Opening in iManage",
      description: "Redirecting to document in iManage..."
    });
  };

  const riskLevel = 'Moderate';
  const reviewedDocuments = 1;
  const highRiskClauses = result.clauses.filter(c => 
    c.title.toLowerCase().includes('termination') || 
    c.title.toLowerCase().includes('non-compete')).length;
  const suggestedRevisions = 3;

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Summary Card */}
          <Card className="border border-border shadow-sm animate-fade-in">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center justify-between">
                <span>Document Analysis Summary</span>
                <Button variant="ghost" size="icon" onClick={() => setOpenSection(openSection === 'summary' ? null : 'summary')}>
                  <InfoIcon size={18} />
                </Button>
              </CardTitle>
              <CardDescription>
                {fileName} - {result.summary.split('.')[0]}.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <FileTextIcon size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Documents Reviewed</p>
                    <p className="font-medium">{reviewedDocuments}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <AlertTriangleIcon size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">High-Risk Clauses</p>
                    <p className="font-medium">{highRiskClauses}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <EditIcon size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Suggested Revisions</p>
                    <p className="font-medium">{suggestedRevisions}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    riskLevel === 'Low' ? 'bg-green-500/10 text-green-500' : 
                    riskLevel === 'Moderate' ? 'bg-amber-500/10 text-amber-500' : 
                    'bg-red-500/10 text-red-500'
                  }`}>
                    <FlagIcon size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Risk Level</p>
                    <p className="font-medium">{riskLevel}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" size="sm" className="gap-1" onClick={handleExport}>
                <DownloadIcon size={14} />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={handleSendEmail}>
                <MailIcon size={14} />
                Email
              </Button>
              <Button variant="outline" size="sm" className="gap-1" onClick={handleOpenInIManage}>
                <LinkIcon size={14} />
                Open in iManage
              </Button>
            </CardFooter>
          </Card>
          
          {/* Detail Cards - Accordion Layout */}
          <Accordion type="single" collapsible className="border rounded-lg shadow-sm">
            <AccordionItem value="findings">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <FileTextIcon size={16} className="text-primary" />
                  <span>Summarized Findings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <p className="text-sm mb-4">{result.summary}</p>
                
                <div className="space-y-3">
                  {result.clauses.slice(0, 2).map((clause) => (
                    <Collapsible key={clause.id} className="border rounded-md">
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-sm font-medium text-left">
                        {clause.title}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="p-3 pt-0 text-sm border-t">
                        {clause.content}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
                
                <Button variant="link" size="sm" className="mt-2 gap-1">
                  View All Clauses
                  <ExternalLinkIcon size={14} />
                </Button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="data">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <SearchIcon size={16} className="text-primary" />
                  <span>Key Data Extraction</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Parties Involved</h4>
                    <div className="space-y-2">
                      {result.parties.map((party, index) => (
                        <div key={index} className="bg-muted/50 p-2 rounded-md text-sm">
                          {party}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Dates</h4>
                    <div className="space-y-2">
                      {result.keyDates.map((date, index) => (
                        <div key={index} className="flex justify-between bg-muted/50 p-2 rounded-md text-sm">
                          <span>{date.description}</span>
                          <span className="font-medium">{new Date(date.date).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="risks">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon size={16} className="text-amber-500" />
                  <span>Risk Identification</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="space-y-3">
                  <div className="border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/50 rounded-md p-3">
                    <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-1">
                      <AlertTriangleIcon size={14} /> Termination Clause
                    </h4>
                    <p className="text-sm text-amber-800 dark:text-amber-300/80">
                      The termination notice period of 60 days is shorter than industry standard (90 days).
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Dismiss</Button>
                      <Button size="sm" className="h-7 px-2 text-xs">View Recommendations</Button>
                    </div>
                  </div>
                  
                  <div className="border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 rounded-md p-3">
                    <h4 className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-1 mb-1">
                      <AlertTriangleIcon size={14} /> Non-Compete Clause
                    </h4>
                    <p className="text-sm text-red-800 dark:text-red-300/80">
                      The 24-month non-compete period may not be enforceable in certain jurisdictions.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Dismiss</Button>
                      <Button size="sm" className="h-7 px-2 text-xs">View Recommendations</Button>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="insights">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2">
                  <BarChartIcon size={16} className="text-primary" />
                  <span>Visual Insights</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4">
                <div className="flex justify-center items-center p-8">
                  <div className="text-center text-muted-foreground">
                    <BarChartIcon size={48} className="mx-auto mb-2 text-muted" />
                    <p>Visual insights will appear here</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {/* Actionable Recommendations */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <EditIcon size={16} className="text-primary" />
                Actionable Recommendations
              </CardTitle>
              <CardDescription>
                Suggested next steps based on our analysis
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-md">
                  <div className="mt-0.5">
                    <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <EditIcon size={12} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Review termination clause</p>
                    <p className="text-xs text-muted-foreground mb-2">Consider extending the notice period to 90 days</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Dismiss</Button>
                      <Button size="sm" className="h-7 px-2 text-xs">Accept</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-md">
                  <div className="mt-0.5">
                    <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <EditIcon size={12} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Revise non-compete clause</p>
                    <p className="text-xs text-muted-foreground mb-2">Reduce duration to 12 months for better enforceability</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Dismiss</Button>
                      <Button size="sm" className="h-7 px-2 text-xs">Accept</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
