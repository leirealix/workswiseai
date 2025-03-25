
import { useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { AnalysisResult } from '@/types';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Timeline } from './Timeline';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from './ui/table';
import { 
  FileText as FileTextIcon, 
  AlertTriangle as AlertTriangleIcon,
  Edit as EditIcon,
  Flag as FlagIcon,
  ClipboardCheck as ClipboardCheckIcon,
  Users as UsersIcon,
  Database as DatabaseIcon,
  BarChart2 as BarChart2Icon,
  Lightbulb as LightbulbIcon,
  Check as CheckIcon,
  Calendar as CalendarIcon,
  Search as SearchIcon,
  Minimize as MinimizeIcon,
  Table as TableIcon,
} from 'lucide-react';
import { DropdownActionMenu } from './ui/dropdown-action-menu';

type RiskLevel = 'Low' | 'Moderate' | 'High';

interface ResultsPanelProps {
  result: AnalysisResult;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const riskLevel: RiskLevel = result.clauses.length > 2 ? 'High' : result.clauses.length > 1 ? 'Moderate' : 'Low';
  
  const highRiskClauseCount = result.clauses.length > 2 ? 2 : result.clauses.length > 1 ? 1 : 0;
  
  const suggestedRevisions = result.clauses.length;

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'summary': true,
    'findings': true,
    'parties': false,
    'extraction': false,
    'risks': false,
    'comparison': true,
    'recommendations': true
  });

  const toggleCardExpansion = (cardKey: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));
  };
  
  const [showDetailedView, setShowDetailedView] = useState<string | null>(null);

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

  const toggleDetailedView = (cardId: string) => {
    if (showDetailedView === cardId) {
      setShowDetailedView(null);
    } else {
      setShowDetailedView(cardId);
    }
  };

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
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Document Analysis</h2>
        
        <Timeline keyDates={result.keyDates} />
        
        <div className="space-y-4">
          <Card className="border shadow-md">
            <CardHeader isExpanded={expandedCards.summary} onToggleExpand={() => toggleCardExpansion('summary')}>
              <CardTitle className="flex items-center">
                <FileTextIcon size={20} className="mr-2 text-primary flex-shrink-0" />
                <span>Document Analysis</span>
              </CardTitle>
              <CardDescription>
                {result.summary.substring(0, 120)}...
              </CardDescription>
            </CardHeader>
            {expandedCards.summary && (
              <>
                <CardContent>
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
                <CardFooter className="flex justify-between items-center pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 hover:bg-primary/10"
                    onClick={() => toggleDetailedView('summary')}
                  >
                    <SearchIcon size={14} />
                    View Details
                  </Button>
                  <DropdownActionMenu entityName="Document Analysis" />
                </CardFooter>
              </>
            )}
          </Card>

          <Card className="border shadow-md overflow-hidden">
            <CardHeader isExpanded={expandedCards.findings} onToggleExpand={() => toggleCardExpansion('findings')}>
              <CardTitle className="flex items-center">
                <ClipboardCheckIcon size={18} className="mr-2 text-primary flex-shrink-0" />
                <span>Summarized Findings</span>
              </CardTitle>
            </CardHeader>
            {expandedCards.findings && (
              <>
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
                <CardFooter className="flex justify-between items-center pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 hover:bg-primary/10"
                    onClick={() => toggleDetailedView('findings')}
                  >
                    <SearchIcon size={14} />
                    View Details
                  </Button>
                  <DropdownActionMenu entityName="Summarized Findings" />
                </CardFooter>
              </>
            )}
          </Card>
          
          <Card className="border shadow-md overflow-hidden">
            <CardHeader isExpanded={expandedCards.parties} onToggleExpand={() => toggleCardExpansion('parties')}>
              <CardTitle className="flex items-center">
                <UsersIcon size={18} className="mr-2 text-primary flex-shrink-0" />
                <span>Parties Involved</span>
              </CardTitle>
            </CardHeader>
            {expandedCards.parties && (
              <>
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
                <CardFooter className="flex justify-between items-center pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 hover:bg-primary/10"
                    onClick={() => toggleDetailedView('parties')}
                  >
                    <SearchIcon size={14} />
                    View Details
                  </Button>
                  <DropdownActionMenu entityName="Parties Information" />
                </CardFooter>
              </>
            )}
          </Card>
          
          <Card className="border shadow-md overflow-hidden">
            <CardHeader isExpanded={expandedCards.extraction} onToggleExpand={() => toggleCardExpansion('extraction')}>
              <CardTitle className="flex items-center">
                <DatabaseIcon size={18} className="mr-2 text-primary flex-shrink-0" />
                <span>Key Data Extraction</span>
              </CardTitle>
            </CardHeader>
            {expandedCards.extraction && (
              <>
                <CardContent>
                  <div className="space-y-3">
                    {extractedData.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div>
                          <div className="font-medium flex items-center">
                            {item.type === 'Date' && <CalendarIcon size={14} className="mr-1 text-primary" />}
                            {item.type === 'Party' && <UsersIcon size={14} className="mr-1 text-primary" />}
                            {item.type === 'Clause' && <FileTextIcon size={14} className="mr-1 text-primary" />}
                            {item.type === 'Obligation' && <CheckIcon size={14} className="mr-1 text-primary" />}
                            {item.type === 'Provision' && <AlertTriangleIcon size={14} className="mr-1 text-primary" />}
                            {item.label}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 max-w-xs truncate">
                            {item.value}
                          </div>
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-full 
                          ${item.confidence === 'High' 
                            ? 'bg-green-100 text-green-700' 
                            : item.confidence === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'}`
                        }>
                          {item.confidence}
                        </div>
                      </div>
                    ))}
                    
                    {extractedData.length > 5 && (
                      <div className="text-sm text-center text-muted-foreground pt-2">
                        + {extractedData.length - 5} more extracted elements
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 hover:bg-primary/10"
                    onClick={() => toggleDetailedView('extraction')}
                  >
                    <TableIcon size={14} />
                    View Details
                  </Button>
                  <DropdownActionMenu entityName="Key Data Extraction" />
                </CardFooter>
              </>
            )}
          </Card>
          
          <Card className="border shadow-md overflow-hidden">
            <CardHeader isExpanded={expandedCards.risks} onToggleExpand={() => toggleCardExpansion('risks')}>
              <CardTitle className="flex items-center">
                <AlertTriangleIcon size={18} className="mr-2 text-amber-500 flex-shrink-0" />
                <span>Risk Assessment</span>
              </CardTitle>
            </CardHeader>
            {expandedCards.risks && (
              <>
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
                <CardFooter className="flex justify-between items-center pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 hover:bg-primary/10"
                    onClick={() => toggleDetailedView('risks')}
                  >
                    <SearchIcon size={14} />
                    View All Risks
                  </Button>
                  <DropdownActionMenu entityName="Risk Assessment" />
                </CardFooter>
              </>
            )}
          </Card>

          <Card className="border shadow-md overflow-hidden">
            <CardHeader isExpanded={expandedCards.comparison} onToggleExpand={() => toggleCardExpansion('comparison')}>
              <CardTitle className="flex items-center">
                <BarChart2Icon size={18} className="mr-2 text-primary flex-shrink-0" />
                <span>Comparative Analysis</span>
              </CardTitle>
            </CardHeader>
            {expandedCards.comparison && (
              <>
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
                <CardFooter className="flex justify-between items-center pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 hover:bg-primary/10"
                    onClick={() => toggleDetailedView('comparison')}
                  >
                    <SearchIcon size={14} />
                    View Details
                  </Button>
                  <DropdownActionMenu entityName="Comparative Analysis" />
                </CardFooter>
              </>
            )}
          </Card>

          <Card className="border shadow-md overflow-hidden">
            <CardHeader isExpanded={expandedCards.recommendations} onToggleExpand={() => toggleCardExpansion('recommendations')}>
              <CardTitle className="flex items-center">
                <LightbulbIcon size={18} className="mr-2 text-amber-500 flex-shrink-0" />
                <span>Actionable Recommendations</span>
              </CardTitle>
            </CardHeader>
            {expandedCards.recommendations && (
              <>
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
                <CardFooter className="flex justify-between items-center pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 hover:bg-primary/10"
                    onClick={() => toggleDetailedView('recommendations')}
                  >
                    <SearchIcon size={14} />
                    View All
                  </Button>
                  <DropdownActionMenu entityName="Actionable Recommendations" />
                </CardFooter>
              </>
            )}
          </Card>
        </div>
        
        {showDetailedView && renderDetailedView()}
      </div>
    </ScrollArea>
  );
}
