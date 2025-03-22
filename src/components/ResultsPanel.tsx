
import { AnalysisResult } from '@/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AlertTriangleIcon, 
  ArrowRightIcon, 
  CalendarIcon, 
  CheckIcon, 
  ClipboardCheckIcon, 
  DownloadIcon, 
  EditIcon, 
  ExternalLinkIcon, 
  FileTextIcon, 
  FlagIcon, 
  MailIcon, 
  SearchIcon, 
  UsersIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';

type RiskLevel = 'Low' | 'Moderate' | 'High';

interface ResultsPanelProps {
  result: AnalysisResult;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  // Calculate risk level based on clauses
  const riskLevel: RiskLevel = result.clauses.length > 2 ? 'High' : result.clauses.length > 1 ? 'Moderate' : 'Low';
  
  // Count the number of high risk clauses (for demo purposes)
  const highRiskClauseCount = result.clauses.length > 2 ? 2 : result.clauses.length > 1 ? 1 : 0;
  
  // Get suggested revisions count (for demo purposes)
  const suggestedRevisions = result.clauses.length;

  // Helper function to get risk level styling
  const getRiskLevelStyle = (level: RiskLevel) => {
    switch(level) {
      case 'High':
        return 'text-red-500 bg-red-100 border-red-200';
      case 'Moderate':
        return 'text-amber-500 bg-amber-100 border-amber-200';
      case 'Low':
        return 'text-green-500 bg-green-100 border-green-200';
      default:
        return 'text-green-500 bg-green-100 border-green-200';
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Summary Card */}
          <Card className="border shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <FileTextIcon size={20} className="mr-2 text-primary" />
                Document Analysis
              </CardTitle>
              <CardDescription>
                {result.summary.substring(0, 120)}...
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
                  <FileTextIcon size={18} className="mb-1 text-primary" />
                  <div className="text-xs text-muted-foreground">Documents</div>
                  <div className="font-semibold">1</div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
                  <AlertTriangleIcon size={18} className="mb-1 text-amber-500" />
                  <div className="text-xs text-muted-foreground">High Risk</div>
                  <div className="font-semibold">{highRiskClauseCount}</div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-lg">
                  <EditIcon size={18} className="mb-1 text-blue-500" />
                  <div className="text-xs text-muted-foreground">Revisions</div>
                  <div className="font-semibold">{suggestedRevisions}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FlagIcon size={16} className={`${riskLevel === 'High' ? 'text-red-500' : riskLevel === 'Moderate' ? 'text-amber-500' : 'text-green-500'}`} />
                <span className="text-sm font-medium">Overall Risk Level:</span>
                <Badge variant="outline" className={`${getRiskLevelStyle(riskLevel)}`}>
                  {riskLevel}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              <Button variant="outline" size="sm" className="gap-1">
                <DownloadIcon size={14} />
                Export
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <MailIcon size={14} />
                Share
              </Button>
              <Button variant="default" size="sm" className="gap-1">
                <ArrowRightIcon size={14} />
                Details
              </Button>
            </CardFooter>
          </Card>

          {/* Detail Cards (Using Collapsible instead of Accordion for better control) */}
          <div className="space-y-5">
            {/* Summarized Findings */}
            <Card className="border shadow-md overflow-hidden">
              <Collapsible defaultOpen>
                <CardHeader className="pb-2">
                  <CollapsibleTrigger className="group flex w-full items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <ClipboardCheckIcon size={18} className="mr-2 text-primary" />
                      Summarized Findings
                    </CardTitle>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <p className="text-sm">{result.summary}</p>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Key Document Points:</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckIcon size={14} className="mt-1 text-green-500 flex-shrink-0" />
                          <span>This is a non-exclusive licensing agreement between two parties.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckIcon size={14} className="mt-1 text-green-500 flex-shrink-0" />
                          <span>Agreement is effective for 2 years with automatic renewal provisions.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckIcon size={14} className="mt-1 text-green-500 flex-shrink-0" />
                          <span>Standard confidentiality, non-compete, and termination clauses included.</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            
            {/* Parties Information */}
            <Card className="border shadow-md overflow-hidden">
              <Collapsible>
                <CardHeader className="pb-2">
                  <CollapsibleTrigger className="group flex w-full items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <UsersIcon size={18} className="mr-2 text-primary" />
                      Parties Involved
                    </CardTitle>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-3">
                      {result.parties.map((party, index) => (
                        <div key={index} className="bg-muted/30 rounded-lg p-3">
                          <div className="font-medium">{party}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {index === 0 ? 'First Party' : 'Second Party'}
                          </div>
                        </div>
                      ))}
                    
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-3">Signatories</h4>
                        <div className="space-y-3">
                          {result.signatures.map((signature, index) => (
                            <div key={index} className="flex items-center border rounded-lg p-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                                {signature.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{signature.name}</div>
                                <div className="text-xs text-muted-foreground">{signature.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            
            {/* Key Dates */}
            <Card className="border shadow-md overflow-hidden">
              <Collapsible>
                <CardHeader className="pb-2">
                  <CollapsibleTrigger className="group flex w-full items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <CalendarIcon size={18} className="mr-2 text-primary" />
                      Key Dates
                    </CardTitle>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-3">
                      {result.keyDates.map((date, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                          <div>
                            <div className="font-medium">{date.description}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(date.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                          <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
                            {(() => {
                              const dateObj = new Date(date.date);
                              const now = new Date();
                              if (dateObj > now) {
                                return 'Upcoming';
                              } else if (
                                dateObj.getDate() === now.getDate() &&
                                dateObj.getMonth() === now.getMonth() &&
                                dateObj.getFullYear() === now.getFullYear()
                              ) {
                                return 'Today';
                              } else {
                                return 'Past';
                              }
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            
            {/* Risk Identification */}
            <Card className="border shadow-md overflow-hidden">
              <Collapsible>
                <CardHeader className="pb-2">
                  <CollapsibleTrigger className="group flex w-full items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <AlertTriangleIcon size={18} className="mr-2 text-amber-500" />
                      Risk Assessment
                    </CardTitle>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent>
                    <div className="space-y-3">
                      {result.clauses.map((clause, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-2">
                              <FlagIcon 
                                size={16} 
                                className={index === 0 ? 'text-red-500' : index === 1 ? 'text-amber-500' : 'text-green-500'} 
                              />
                              <div>
                                <h4 className="text-sm font-medium">{clause.title}</h4>
                                <p className="text-xs text-muted-foreground">Page {clause.page}</p>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={index === 0 ? 'text-red-500 bg-red-50' : index === 1 ? 'text-amber-500 bg-amber-50' : 'text-green-500 bg-green-50'}
                            >
                              {index === 0 ? 'High Risk' : index === 1 ? 'Moderate' : 'Low Risk'}
                            </Badge>
                          </div>
                          <p className="text-sm mt-2">{clause.content.substring(0, 100)}...</p>
                          <div className="flex justify-end mt-2">
                            <Button variant="ghost" size="sm">View Details</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
