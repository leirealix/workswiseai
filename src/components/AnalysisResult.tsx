import { useState } from 'react';
import { AnalysisResult as ResultType } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CalendarIcon, UsersIcon, FileTextIcon, ClipboardCheckIcon, ExternalLinkIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { DropdownActionMenu } from '@/components/ui/dropdown-action-menu';
import { cn } from '@/lib/utils';

interface AnalysisResultProps {
  result: ResultType;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({});
  const [expandedParties, setExpandedParties] = useState<Record<number, boolean>>({});
  const [expandedDates, setExpandedDates] = useState<Record<number, boolean>>({});

  const toggleClauseExpand = (id: string) => {
    setExpandedClauses(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const togglePartyExpand = (index: number) => {
    setExpandedParties(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleDateExpand = (index: number) => {
    setExpandedDates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="summary" className="h-full flex flex-col">
        <div className="px-6 py-4 border-b bg-muted/30">
          <TabsList className="w-full grid grid-cols-4 gap-2">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <ClipboardCheckIcon size={16} />
              <span>Summary</span>
            </TabsTrigger>
            <TabsTrigger value="parties" className="flex items-center gap-2">
              <UsersIcon size={16} />
              <span>Parties</span>
            </TabsTrigger>
            <TabsTrigger value="dates" className="flex items-center gap-2">
              <CalendarIcon size={16} />
              <span>Key Dates</span>
            </TabsTrigger>
            <TabsTrigger value="clauses" className="flex items-center gap-2">
              <FileTextIcon size={16} />
              <span>Clauses</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="summary" className="h-full mt-0 animate-fade-in">
            <Card className="h-full border-0 rounded-none shadow-none">
              <CardHeader className="bg-muted/10 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 bg-primary/10 text-primary p-2 rounded-full">
                      <ClipboardCheckIcon size={18} />
                    </div>
                    <div>
                      <CardTitle>Document Summary</CardTitle>
                      <CardDescription>Key points extracted from the document</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="p-6 space-y-6">
                    <div className="text-sm leading-relaxed bg-background p-4 rounded-md border shadow-sm">
                      {result.summary}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <Card className="transition-all">
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Document Type</div>
                          <div className="text-sm font-semibold">Contract Agreement</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Pages</div>
                          <div className="text-sm font-semibold">5</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Clauses</div>
                          <div className="text-sm font-semibold">{result.clauses.length}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Agreement Duration</div>
                          <div className="text-sm font-semibold">2 years</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t mt-auto p-4">
                <DropdownActionMenu entityName="Document Summary" />
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="parties" className="h-full mt-0 animate-fade-in">
            <Card className="h-full border-0 rounded-none shadow-none">
              <CardHeader className="bg-muted/10 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 bg-primary/10 text-primary p-2 rounded-full">
                      <UsersIcon size={18} />
                    </div>
                    <div>
                      <CardTitle>Parties Involved</CardTitle>
                      <CardDescription>Organizations and entities mentioned in the document</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="p-6 space-y-6">
                    <div className="grid gap-4">
                      {result.parties.map((party, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardHeader 
                            isExpanded={expandedParties[index]} 
                            onToggleExpand={() => togglePartyExpand(index)}
                          >
                            <div className="font-medium text-primary">{party}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {index === 0 ? 'First Party' : 'Second Party'}
                            </div>
                          </CardHeader>
                          <CardContent isExpanded={expandedParties[index]}>
                            <div className="text-sm">
                              {index === 0 ? 
                                'Primary entity in the agreement with primary obligations and rights.' : 
                                'Secondary entity in the agreement with corresponding obligations and rights.'}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  
                    <div className="mt-8">
                      <h4 className="text-sm font-medium mb-4 flex items-center">
                        <UsersIcon size={16} className="mr-2 text-primary" />
                        Signatories
                      </h4>
                      <div className="grid gap-3">
                        {result.signatures.map((signature, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-4 flex items-center">
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 text-lg font-semibold">
                                {signature.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium">{signature.name}</div>
                                <div className="text-xs text-muted-foreground">{signature.role}</div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t mt-auto p-4">
                <DropdownActionMenu entityName="Parties Information" />
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="dates" className="h-full mt-0 animate-fade-in">
            <Card className="h-full border-0 rounded-none shadow-none">
              <CardHeader className="bg-muted/10 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 bg-primary/10 text-primary p-2 rounded-full">
                      <CalendarIcon size={18} />
                    </div>
                    <div>
                      <CardTitle>Key Dates</CardTitle>
                      <CardDescription>Important deadlines and dates in the document</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="p-6 space-y-4">
                    {result.keyDates.map((date, index) => (
                      <Card key={index} className={cn("border overflow-hidden",
                        (() => {
                          const dateObj = new Date(date.date);
                          const now = new Date();
                          if (dateObj > now) {
                            return "border-l-4 border-l-amber-500";
                          } else if (
                            dateObj.getDate() === now.getDate() &&
                            dateObj.getMonth() === now.getMonth() &&
                            dateObj.getFullYear() === now.getFullYear()
                          ) {
                            return "border-l-4 border-l-emerald-500";
                          } else {
                            return "border-l-4 border-l-slate-300";
                          }
                        })()
                      )}>
                        <CardHeader
                          isExpanded={expandedDates[index]}
                          onToggleExpand={() => toggleDateExpand(index)}
                        >
                          <div className="font-medium text-primary">{date.description}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(date.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                        </CardHeader>
                        <CardContent isExpanded={expandedDates[index]}>
                          <div className={cn("text-xs font-medium px-2 py-1 rounded-full inline-block", 
                            (() => {
                              const dateObj = new Date(date.date);
                              const now = new Date();
                              if (dateObj > now) {
                                return "bg-amber-100 text-amber-700";
                              } else if (
                                dateObj.getDate() === now.getDate() &&
                                dateObj.getMonth() === now.getMonth() &&
                                dateObj.getFullYear() === now.getFullYear()
                              ) {
                                return "bg-emerald-100 text-emerald-700";
                              } else {
                                return "bg-slate-100 text-slate-700";
                              }
                            })()
                          )}>
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
                          <div className="mt-2 text-sm text-muted-foreground">
                            Additional details about this date and its significance in the document.
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t mt-auto p-4">
                <DropdownActionMenu entityName="Key Dates" />
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="clauses" className="h-full mt-0 animate-fade-in">
            <Card className="h-full border-0 rounded-none shadow-none">
              <CardHeader className="bg-muted/10 border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 bg-primary/10 text-primary p-2 rounded-full">
                      <FileTextIcon size={18} />
                    </div>
                    <div>
                      <CardTitle>Key Clauses</CardTitle>
                      <CardDescription>Important provisions and clauses in the document</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="p-6 space-y-4">
                    {result.clauses.map((clause) => (
                      <Card key={clause.id} className="overflow-hidden shadow-sm">
                        <CardHeader 
                          className="bg-muted/30 font-medium border-b" 
                          isExpanded={expandedClauses[clause.id]} 
                          onToggleExpand={() => toggleClauseExpand(clause.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-primary">{clause.title}</span>
                              <span className="ml-2 text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-background">
                                Page {clause.page}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 text-sm" isExpanded={expandedClauses[clause.id]}>
                          {clause.content}
                          <div className="mt-4 flex justify-end">
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              <ExternalLinkIcon size={14} className="mr-1" />
                              View in Document
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t mt-auto p-4">
                <DropdownActionMenu entityName="Key Clauses" />
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
