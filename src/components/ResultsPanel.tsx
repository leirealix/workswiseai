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
  DatabaseIcon,
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
  TableIcon,
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
import { DropdownActionMenu } from '@/components/ui/dropdown-action-menu';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

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

  // State for card expansion
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'summary': true,
    'findings': true,
    'parties': false,
    'extraction': false,
    'risks': false,
    'comparison': true,
    'recommendations': true
  });

  // Toggle card expansion
  const toggleCardExpansion = (cardKey: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));
  };
  
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

  // Mock data for Key Data Extraction
  const extractedData = [
    { type: 'Date', label: 'Effective Date', value: '2023-06-15', page: 1, confidence: 'High' },
    { type: 'Date', label: 'Termination Date', value: '2025-06-14', page: 4, confidence: 'High' },
    { type: 'Date', label: 'First Review', value: '2023-12-15', page: 2, confidence: 'Medium' },
    { type: 'Party', label: 'First Party', value: 'Acme Corporation', page: 1, confidence: 'High' },
    { type: 'Party', label: 'Second Party', value: 'XYZ Enterprises Ltd.', page: 1, confidence: 'High' },
    { type: 'Clause', label: 'Confidentiality', value: 'Both parties agree to maintain confidentiality...', page: 2, confidence: 'High' },
    { type: 'Clause', label: 'Non-Compete', value: 'For a period of 24 months following termination...', page: 3, confidence: 'Medium' },
    { type: 'Clause', label: 'Termination', value: 'This agreement may be terminated by either party...', page: 4, confidence: 'High' },
    { type: 'Obligation', label: 'Payment Terms', value: 'Payment due within 30 days of invoice...', page: 2, confidence: 'Medium' },
    { type: 'Provision', label: 'Change of Control', value: 'In the event of change of control...', page: 4, confidence: 'Low' },
    { type: 'Provision', label: 'Force Majeure', value: 'Neither party shall be liable for failure...', page: 5, confidence: 'Medium' },
  ];

  const renderDetailedView = () => {
    switch(showDetailedView) {
      case 'summary':
        return (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-lg border max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileTextIcon size={20} className="mr-2 text-primary flex-shrink-0" />
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
      case 'extraction':
        return (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-lg border max-w-5xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <DatabaseIcon size={20} className="mr-2 text-primary" />
                  Key Data Extraction Details
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowDetailedView(null)}>
                  <MinimizeIcon size={18} />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Extracted Data Elements</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    The following data points have been automatically extracted from the document with the confidence levels indicated.
                  </p>
                  
                  <div className="border rounded-md overflow-hidden mb-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Label</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Page</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extractedData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.type}</TableCell>
                            <TableCell>{item.label}</TableCell>
                            <TableCell className="max-w-xs truncate">{item.value}</TableCell>
                            <TableCell>{item.page}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  item.confidence === 'High' 
                                    ? 'bg-green-100 text-green-700 border-green-200' 
                                    : item.confidence === 'Medium'
                                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                                    : 'bg-red-100 text-red-700 border-red-200'
                                }
                              >
                                {item.confidence}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                <SearchIcon size={14} className="mr-1" />
                                <span>View</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border p-4 rounded-md bg-muted/10">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <CheckIcon size={16} className="mr-2 text-green-500" />
                        Data Extraction Statistics
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total Elements:</span>
                          <span className="ml-1 font-medium">{extractedData.length}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">High Confidence:</span>
                          <span className="ml-1 font-medium">
                            {extractedData.filter(item => item.confidence === 'High').length}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Medium/Low Confidence:</span>
                          <span className="ml-1 font-medium">
                            {extractedData.filter(item => item.confidence !== 'High').length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDetailedView(null)}>Close</Button>
                <Button variant="default">Export Data</Button>
              </div>
            </div>
          </div>
        );
      case 'findings':
        return (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-lg border max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <ClipboardCheckIcon size={20} className="mr-2 text-primary" />
                  Summarized Findings Details
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowDetailedView(null)}>
                  <MinimizeIcon size={18} />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-6">
                <h3 className="text-lg font-medium mb-3">Complete Document Analysis</h3>
                <p className="text-sm mb-6">{result.summary}</p>
                
                <h3 className="text-lg font-medium mb-3">Key Findings</h3>
                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Agreement Structure</h4>
                    <p className="text-sm">
                      This is a standard legal agreement following conventional structure with clearly 
                      defined terms, conditions, and obligations for all parties involved.
                    </p>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Key Provisions</h4>
                    <ul className="text-sm space-y-2">
                      {result.clauses.map((clause, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckIcon size={14} className="mt-1 text-green-500 flex-shrink-0" />
                          <span>{clause.title}: {clause.content.substring(0, 80)}...</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Entities Involved</h4>
                    <ul className="text-sm space-y-2">
                      {result.parties.map((party, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <UsersIcon size={14} className="mt-1 text-primary flex-shrink-0" />
                          <span>{party} ({index === 0 ? 'First Party' : 'Second Party'})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mb-3 mt-6">Document Timeline</h3>
                <div className="relative border-l border-muted-foreground/30 pl-6 pb-2 space-y-6">
                  {result.keyDates.map((date, index) => (
                    <div key={index} className="relative">
                      <div className="absolute w-3 h-3 rounded-full bg-primary -left-[1.65rem] top-1.5"></div>
                      <div className="font-medium">{date.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(date.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDetailedView(null)}>Close</Button>
                <Button variant="default">Export as PDF</Button>
              </div>
            </div>
          </div>
        );
      case 'risks':
        return (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-lg border max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <AlertTriangleIcon size={20} className="mr-2 text-amber-500" />
                  Risk Assessment Details
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowDetailedView(null)}>
                  <MinimizeIcon size={18} />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-2">Risk Summary</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    This document has been analyzed for potential legal, financial, and operational risks.
                    Below is a detailed breakdown of identified risk areas and their severity.
                  </p>
                  
                  <div className="mb-6 grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 bg-muted/10">
                      <div className="text-4xl font-bold text-amber-500 mb-1">{result.clauses.length}</div>
                      <div className="text-sm text-muted-foreground">Total Risk Points</div>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/10">
                      <div className="text-4xl font-bold text-red-500 mb-1">{highRiskClauseCount}</div>
                      <div className="text-sm text-muted-foreground">High Risk Items</div>
                    </div>
                    <div className="border rounded-lg p-4 bg-muted/10">
                      <div className="text-4xl font-bold text-green-500 mb-1">{suggestedRevisions}</div>
                      <div className="text-sm text-muted-foreground">Recommended Actions</div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4">Identified Risks by Clause</h3>
                  <div className="space-y-6">
                    {result.clauses.map((clause, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className={`p-4 ${
                          index === 0 ? 'bg-red-50 border-l-4 border-l-red-500' : 
                          index === 1 ? 'bg-amber-50 border-l-4 border-l-amber-500' : 
                          'bg-green-50 border-l-4 border-l-green-500'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <FlagIcon 
                                size={18} 
                                className={`mr-2 ${
                                  index === 0 ? 'text-red-500' : 
                                  index === 1 ? 'text-amber-500' : 
                                  'text-green-500'
                                }`} 
                              />
                              <h4 className="font-medium">{clause.title}</h4>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={
                                index === 0 ? 'text-red-500 bg-red-50 border-red-200' : 
                                index === 1 ? 'text-amber-500 bg-amber-50 border-amber-200' : 
                                'text-green-500 bg-green-50 border-green-200'
                              }
                            >
                              {index === 0 ? 'High Risk' : index === 1 ? 'Moderate Risk' : 'Low Risk'}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 bg-card">
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-1">Risk Description</div>
                            <p className="text-sm">
                              {index === 0 ? 
                                'This clause contains vague language that could be interpreted in multiple ways, creating legal uncertainty.' : 
                                index === 1 ? 
                                'The obligations outlined in this section may be difficult to enforce in certain jurisdictions.' : 
                                'Standard clause with well-defined parameters and minimal risk exposure.'
                              }
                            </p>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-1">Original Clause Text</div>
                            <div className="text-sm p-3 bg-muted/30 rounded-md">
                              {clause.content}
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="text-sm font-medium mb-1">Potential Impact</div>
                            <p className="text-sm">
                              {index === 0 ? 
                                'May lead to contract disputes, potential litigation, and financial liability.' : 
                                index === 1 ? 
                                'Could create operational challenges and require additional resources to manage.' : 
                                'Minimal impact expected under normal circumstances.'
                              }
                            </p>
                          </div>
                          
                          <div>
                            <div className="text-sm font-medium mb-1">Recommended Action</div>
                            <p className="text-sm">
                              {index === 0 ? 
                                'Revise clause with more specific language and clearly defined terms.' : 
                                index === 1 ? 
                                'Consider adding jurisdiction-specific provisions or clarifications.' : 
                                'No action required, continue with standard monitoring.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
              <div className="p-4 border-t flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDetailedView(null)}>Close</Button>
                <Button variant="default">Generate Risk Report</Button>
              </div>
            </div>
          </div>
        );
      case 'comparison':
        return (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-lg border max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <BarChart2Icon size={20} className="mr-2 text-primary" />
                  Comparative Analysis Details
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowDetailedView(null)}>
                  <MinimizeIcon size={18} />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-2">Industry Benchmark Comparison</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    This analysis compares the document against industry standards, similar documents in our database, 
                    and best practices for this document type.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">Completeness</div>
                          <div className="text-sm">90%</div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div className="bg-green-500 h-3 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          How complete this document is compared to ideal templates
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">Clarity</div>
                          <div className="text-sm">75%</div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div className="bg-primary h-3 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          How clear and unambiguous the language is
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">Required Clauses</div>
                          <div className="text-sm">85%</div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div className="bg-blue-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Inclusion of industry-standard required clauses
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">Risk Level</div>
                          <div className="text-sm">45%</div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div className="bg-amber-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Risk level compared to similar documents (lower is better)
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">Enforceability</div>
                          <div className="text-sm">80%</div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Likelihood of terms being enforceable
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">Overall Rating</div>
                          <div className="text-sm">78%</div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div className="bg-primary h-3 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Aggregate score across all metrics
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4">Clause Comparison</h3>
                  <div className="border rounded-lg overflow-hidden mb-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Clause</TableHead>
                          <TableHead>This Document</TableHead>
                          <TableHead>Industry Standard</TableHead>
                          <TableHead>Gap Analysis</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {result.clauses.map((clause, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{clause.title}</TableCell>
                            <TableCell>Present</TableCell>
                            <TableCell>
                              {index < 2 ? 'Present' : 'Optional'}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={
                                  index === 0 ? 'bg-red-100 text-red-700 border-red-200' : 
                                  'bg-green-100 text-green-700 border-green-200'
                                }
                              >
                                {index === 0 ? 'Needs Improvement' : 'Meets Standard'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-medium">Force Majeure</TableCell>
                          <TableCell>Present</TableCell>
                          <TableCell>Present</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className="bg-green-100 text-green-700 border
