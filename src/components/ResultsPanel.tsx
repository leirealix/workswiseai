
import { useState } from 'react';
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
  BarChart2Icon,
  CalendarIcon, 
  CheckIcon, 
  ClipboardCheckIcon, 
  DownloadIcon, 
  EditIcon, 
  ExternalLinkIcon, 
  FileTextIcon, 
  FlagIcon, 
  LightbulbIcon,
  MailIcon, 
  MinimizeIcon,
  MaximizeIcon,
  SearchIcon, 
  UsersIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  // State for card minimization
  const [summaryCardCollapsed, setSummaryCardCollapsed] = useState(false);
  
  // State for detailed view 
  const [showDetailedView, setShowDetailedView] = useState<string | null>(null);

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

  // Helper function to toggle detailed view
  const toggleDetailedView = (cardId: string) => {
    if (showDetailedView === cardId) {
      setShowDetailedView(null);
    } else {
      setShowDetailedView(cardId);
    }
  };

  const renderDetailedView = () => {
    switch(showDetailedView) {
      case 'summary':
        return (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-lg border max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileTextIcon size={20} className="mr-2 text-primary" />
                  Document Analysis Details
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowDetailedView(null)}>
                  <MinimizeIcon size={18} />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-6">
                <h3 className="text-lg font-medium mb-3">Full Document Summary</h3>
                <p className="text-sm mb-6">{result.summary}</p>
                
                <h3 className="text-lg font-medium mb-3">Document Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="font-medium">Document Type</div>
                    <div className="text-sm text-muted-foreground">Contract Agreement</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="font-medium">Total Pages</div>
                    <div className="text-sm text-muted-foreground">5</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="font-medium">Created Date</div>
                    <div className="text-sm text-muted-foreground">June 15, 2023</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="font-medium">Status</div>
                    <div className="text-sm text-muted-foreground">Active</div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-3">Key Points</h3>
                <ul className="space-y-2 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckIcon size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">
                        {i === 0 && "Non-exclusive licensing agreement between two parties."}
                        {i === 1 && "Agreement effective for 2 years with automatic renewal provisions."}
                        {i === 2 && "Includes standard confidentiality and non-compete clauses."}
                        {i === 3 && "60-day termination notice required from either party."}
                        {i === 4 && "Governed by New York state law."}
                      </span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
              <div className="p-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDetailedView(null)}>Close</Button>
                <Button variant="default">Download Full Report</Button>
              </div>
            </div>
          </div>
        );
      case 'parties':
        return (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-lg border max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <UsersIcon size={20} className="mr-2 text-primary" />
                  Parties Details
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowDetailedView(null)}>
                  <MinimizeIcon size={18} />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-6">
                <h3 className="text-lg font-medium mb-3">Party Information</h3>
                
                {result.parties.map((party, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        {party.charAt(0)}
                      </div>
                      <h4 className="font-medium">{party}</h4>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Role</div>
                          <div className="text-sm font-medium">{index === 0 ? 'First Party' : 'Second Party'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Type</div>
                          <div className="text-sm font-medium">{index === 0 ? 'Corporation' : 'Limited Company'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm mb-4">
                      <h5 className="font-medium mb-2">Obligations</h5>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <CheckIcon size={14} className="mt-1 text-primary flex-shrink-0" />
                          <span>{index === 0 ? 'Provide services as specified in Schedule A' : 'Pay fees according to payment schedule'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckIcon size={14} className="mt-1 text-primary flex-shrink-0" />
                          <span>{index === 0 ? 'Maintain confidentiality of shared information' : 'Provide necessary access and information'}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
                
                <h3 className="text-lg font-medium mb-3">Signatories</h3>
                <div className="space-y-4">
                  {result.signatures.map((signature, index) => (
                    <div key={index} className="flex items-center border rounded-lg p-4 bg-muted/20">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                        {signature.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{signature.name}</div>
                        <div className="text-sm text-muted-foreground">{signature.role}</div>
                        <div className="text-xs text-muted-foreground mt-1">Signed: June 15, 2023</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDetailedView(null)}>Close</Button>
                <Button variant="default">View Contact Details</Button>
              </div>
            </div>
          </div>
        );
      // Add more detailed views for other cards as needed
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Summary Card */}
          <Card className="border shadow-md">
            <Collapsible defaultOpen={!summaryCardCollapsed} onOpenChange={(isOpen) => setSummaryCardCollapsed(!isOpen)}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      {summaryCardCollapsed ? <MaximizeIcon size={16} /> : <MinimizeIcon size={16} />}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CardTitle className="text-xl flex items-center">
                  <FileTextIcon size={20} className="mr-2 text-primary" />
                  Document Analysis
                </CardTitle>
                <CardDescription>
                  {result.summary.substring(0, 120)}...
                </CardDescription>
              </CardHeader>
              <CollapsibleContent>
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 hover:bg-primary/10"
                    onClick={() => toggleDetailedView('summary')}
                  >
                    <SearchIcon size={14} />
                    View Details
                  </Button>
                  <Button variant="default" size="sm" className="gap-1">
                    <ArrowRightIcon size={14} />
                    Take Action
                  </Button>
                </CardFooter>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Comparative Analysis Card - NEW */}
          <Card className="border shadow-md overflow-hidden">
            <Collapsible defaultOpen>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <BarChart2Icon size={18} className="mr-2 text-primary" />
                  Comparative Analysis
                </CardTitle>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="font-medium text-sm">Industry Standard Comparison</div>
                      <div className="mt-2 flex items-center">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-xs ml-2 text-muted-foreground">75%</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        This agreement meets 75% of industry standard clauses
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="font-medium text-sm">Risk Profile Comparison</div>
                      <div className="mt-2 flex items-center">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-xs ml-2 text-muted-foreground">45%</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        This agreement has 45% lower risk than similar documents
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3">
                      <div className="font-medium text-sm">Completeness Score</div>
                      <div className="mt-2 flex items-center">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <span className="text-xs ml-2 text-muted-foreground">90%</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        This agreement is 90% complete compared to ideal templates
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 hover:bg-primary/10"
                    onClick={() => toggleDetailedView('comparison')}
                  >
                    <SearchIcon size={14} />
                    View Details
                  </Button>
                  <Button variant="default" size="sm" className="gap-1">
                    <ArrowRightIcon size={14} />
                    Run Comparison
                  </Button>
                </CardFooter>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Actionable Recommendations Card - NEW */}
          <Card className="border shadow-md overflow-hidden">
            <Collapsible defaultOpen>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <LightbulbIcon size={18} className="mr-2 text-amber-500" />
                  Actionable Recommendations
                </CardTitle>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                      <div className="mt-0.5">
                        <AlertTriangleIcon size={16} className="text-amber-500" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Strengthen Confidentiality Clause</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Current clause lacks specificity on information handling after termination.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">View Suggested Text</Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <div className="mt-0.5">
                        <AlertTriangleIcon size={16} className="text-red-500" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Add Dispute Resolution Clause</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Document lacks clear dispute resolution process. Recommend adding arbitration clause.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">View Suggested Text</Button>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                      <div className="mt-0.5">
                        <LightbulbIcon size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Update Force Majeure Clause</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Consider expanding to include modern disruptions like cyber attacks.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2 h-7 text-xs">View Suggested Text</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 hover:bg-primary/10"
                    onClick={() => toggleDetailedView('recommendations')}
                  >
                    <SearchIcon size={14} />
                    View All
                  </Button>
                  <Button variant="default" size="sm" className="gap-1">
                    <ArrowRightIcon size={14} />
                    Implement All
                  </Button>
                </CardFooter>
              </CollapsibleContent>
            </Collapsible>
          </Card>
          
          {/* Detail Cards (Using Collapsible instead of Accordion for better control) */}
          <div className="space-y-4">
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
                  <CardFooter className="flex justify-between pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 hover:bg-primary/10"
                      onClick={() => toggleDetailedView('parties')}
                    >
                      <SearchIcon size={14} />
                      View Details
                    </Button>
                  </CardFooter>
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
                  <CardFooter className="flex justify-between pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 hover:bg-primary/10"
                      onClick={() => toggleDetailedView('dates')}
                    >
                      <SearchIcon size={14} />
                      View Details
                    </Button>
                  </CardFooter>
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => toggleDetailedView(`clause-${index}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 hover:bg-primary/10"
                      onClick={() => toggleDetailedView('risks')}
                    >
                      <SearchIcon size={14} />
                      View All Risks
                    </Button>
                  </CardFooter>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>
        </div>
      </ScrollArea>
      
      {/* Render detailed view if needed */}
      {showDetailedView && renderDetailedView()}
    </div>
  );
}
