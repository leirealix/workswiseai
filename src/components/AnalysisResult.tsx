
import { AnalysisResult as ResultType } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, UsersIcon, FileTextIcon, ClipboardCheckIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalysisResultProps {
  result: ResultType;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="summary" className="h-full flex flex-col">
        <div className="px-4 pt-4 border-b">
          <TabsList className="w-full">
            <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
            <TabsTrigger value="parties" className="flex-1">Parties</TabsTrigger>
            <TabsTrigger value="dates" className="flex-1">Key Dates</TabsTrigger>
            <TabsTrigger value="clauses" className="flex-1">Clauses</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value="summary" className="h-full mt-0 animate-fade-in">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardCheckIcon size={18} className="mr-2 text-primary" />
                  Document Summary
                </CardTitle>
                <CardDescription>
                  Key points extracted from the document
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)] overflow-hidden">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-4">
                    <div className="text-sm leading-relaxed">{result.summary}</div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Document Type</div>
                        <div className="text-sm font-medium">Contract Agreement</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Total Pages</div>
                        <div className="text-sm font-medium">5</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Total Clauses</div>
                        <div className="text-sm font-medium">{result.clauses.length}</div>
                      </div>
                      <div className="bg-muted/30 rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Agreement Duration</div>
                        <div className="text-sm font-medium">2 years</div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="parties" className="h-full mt-0 animate-fade-in">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UsersIcon size={18} className="mr-2 text-primary" />
                  Parties Involved
                </CardTitle>
                <CardDescription>
                  Organizations and entities mentioned in the document
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)] overflow-hidden">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-4">
                    {result.parties.map((party, index) => (
                      <div key={index} className="bg-muted/30 rounded-lg p-4">
                        <div className="font-medium">{party}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {index === 0 ? 'First Party' : 'Second Party'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
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
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dates" className="h-full mt-0 animate-fade-in">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon size={18} className="mr-2 text-primary" />
                  Key Dates
                </CardTitle>
                <CardDescription>
                  Important dates mentioned in the document
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)] overflow-hidden">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-4">
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
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clauses" className="h-full mt-0 animate-fade-in">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileTextIcon size={18} className="mr-2 text-primary" />
                  Key Clauses
                </CardTitle>
                <CardDescription>
                  Important provisions and clauses in the document
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-4rem)] overflow-hidden">
                <ScrollArea className="h-full w-full">
                  <div className="space-y-6">
                    {result.clauses.map((clause) => (
                      <div key={clause.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-muted p-3 font-medium text-sm">
                          {clause.title}
                          <span className="ml-2 text-xs text-muted-foreground">
                            Page {clause.page}
                          </span>
                        </div>
                        <div className="p-3 text-sm">
                          {clause.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
