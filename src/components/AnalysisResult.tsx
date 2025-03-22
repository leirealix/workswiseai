
import { AnalysisResult as ResultType } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  CalendarIcon, 
  UsersIcon, 
  FileTextIcon, 
  ClipboardCheckIcon, 
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  DownloadIcon
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AnalysisResultProps {
  result: ResultType;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="summary" className="h-full flex flex-col">
        <div className="sticky top-0 z-10 px-4 pt-4 pb-2 bg-background/95 backdrop-blur-sm border-b">
          <TabsList className="w-full grid grid-cols-4 h-10">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="parties">Parties</TabsTrigger>
            <TabsTrigger value="dates">Key Dates</TabsTrigger>
            <TabsTrigger value="clauses">Clauses</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="summary" className="h-full mt-0 animate-fade-in">
            <Card className="h-full border-0 rounded-none">
              <CardHeader className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ClipboardCheckIcon size={20} className="mr-2 text-primary" />
                    Document Summary
                  </CardTitle>
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                    <DownloadIcon size={14} />
                    <span>Export</span>
                  </Button>
                </div>
                <CardDescription className="mt-1.5">
                  Key points extracted from the document
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="p-6 space-y-6">
                    <div className="text-sm leading-relaxed bg-muted/20 p-4 rounded-lg border border-muted">
                      {result.summary}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/60">
                        <div className="text-xs text-muted-foreground mb-2 uppercase font-medium">Document Type</div>
                        <div className="text-sm font-medium">Contract Agreement</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/60">
                        <div className="text-xs text-muted-foreground mb-2 uppercase font-medium">Total Pages</div>
                        <div className="text-sm font-medium">5</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/60">
                        <div className="text-xs text-muted-foreground mb-2 uppercase font-medium">Total Clauses</div>
                        <div className="text-sm font-medium">{result.clauses.length}</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/60">
                        <div className="text-xs text-muted-foreground mb-2 uppercase font-medium">Agreement Duration</div>
                        <div className="text-sm font-medium">2 years</div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/10 rounded-lg p-5 border border-dashed">
                      <h4 className="text-sm font-medium mb-3 flex items-center">
                        <AlertTriangleIcon size={16} className="mr-2 text-amber-500" />
                        Risk Assessment
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between bg-amber-500/10 p-3 rounded-md border border-amber-500/30">
                          <div className="flex items-center">
                            <Badge variant="outline" className="bg-amber-500 text-white border-amber-500 mr-2">Medium</Badge>
                            <span className="text-sm">Non-standard termination clause</span>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 text-xs">Review</Button>
                        </div>
                        <div className="flex items-center justify-between bg-destructive/10 p-3 rounded-md border border-destructive/30">
                          <div className="flex items-center">
                            <Badge variant="outline" className="bg-destructive text-white border-destructive mr-2">High</Badge>
                            <span className="text-sm">Missing liability limitations</span>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7 text-xs">Review</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-4 justify-end">
                <Button size="sm" variant="default" className="flex items-center gap-1.5">
                  <span>Share Analysis</span>
                  <ArrowRightIcon size={14} />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="parties" className="h-full mt-0 animate-fade-in">
            <Card className="h-full border-0 rounded-none">
              <CardHeader className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <UsersIcon size={20} className="mr-2 text-primary" />
                    Parties Involved
                  </CardTitle>
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                    <DownloadIcon size={14} />
                    <span>Export</span>
                  </Button>
                </div>
                <CardDescription className="mt-1.5">
                  Organizations and entities mentioned in the document
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="p-6 space-y-4">
                    {result.parties.map((party, index) => (
                      <div key={index} className="bg-muted/20 rounded-lg p-4 border border-border/60">
                        <div className="font-medium">{party}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {index === 0 ? 'First Party' : 'Second Party'}
                        </div>
                      </div>
                    ))}
                  
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Signatories</h4>
                      <div className="space-y-3">
                        {result.signatures.map((signature, index) => (
                          <div key={index} className="flex items-center border rounded-lg p-4 bg-muted/10 hover:bg-muted/20 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 font-semibold">
                              {signature.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{signature.name}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{signature.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-4 justify-end">
                <Button size="sm" variant="default" className="flex items-center gap-1.5">
                  <span>Verify Parties</span>
                  <CheckCircleIcon size={14} />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="dates" className="h-full mt-0 animate-fade-in">
            <Card className="h-full border-0 rounded-none">
              <CardHeader className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <CalendarIcon size={20} className="mr-2 text-primary" />
                    Key Dates
                  </CardTitle>
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                    <DownloadIcon size={14} />
                    <span>Export</span>
                  </Button>
                </div>
                <CardDescription className="mt-1.5">
                  Important dates mentioned in the document
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="p-6 space-y-4">
                    {result.keyDates.map((date, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/20 border rounded-lg p-4 hover:bg-muted/30 transition-colors">
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
                        <div className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
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
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-4 justify-end">
                <Button size="sm" variant="default" className="flex items-center gap-1.5">
                  <span>Add to Calendar</span>
                  <CalendarIcon size={14} />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="clauses" className="h-full mt-0 animate-fade-in">
            <Card className="h-full border-0 rounded-none">
              <CardHeader className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileTextIcon size={20} className="mr-2 text-primary" />
                    Key Clauses
                  </CardTitle>
                  <Button size="sm" variant="outline" className="flex items-center gap-1.5">
                    <DownloadIcon size={14} />
                    <span>Export</span>
                  </Button>
                </div>
                <CardDescription className="mt-1.5">
                  Important provisions and clauses in the document
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-240px)]">
                  <div className="p-6 space-y-6">
                    {result.clauses.map((clause) => (
                      <div key={clause.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all">
                        <div className="bg-muted/50 p-4 font-medium flex items-center justify-between">
                          <div className="flex items-center">
                            <span>{clause.title}</span>
                            <span className="ml-2 text-xs text-muted-foreground px-1.5 py-0.5 bg-muted/50 rounded">
                              Page {clause.page}
                            </span>
                          </div>
                          <Button size="sm" variant="ghost" className="h-7">Review</Button>
                        </div>
                        <div className="p-4 text-sm bg-white/50 dark:bg-black/5">
                          {clause.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-4 justify-end">
                <Button size="sm" variant="default" className="flex items-center gap-1.5">
                  <span>Extract All Clauses</span>
                  <FileTextIcon size={14} />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
