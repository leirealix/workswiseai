
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, BookOpen, FileText, Code, Clock, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LegalResearchProps {
  onClose: () => void;
}

export default function LegalResearch({ onClose }: LegalResearchProps) {
  const [searchQuery, setSearchQuery] = useState('Non-compete clauses in California');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ id: string; title: string; source: string; snippet: string; relevance: number }>>([]);
  
  // Default research results that appear immediately
  const defaultResults = [
    {
      id: '1',
      title: 'Smith v. Jones (2021)',
      source: 'Supreme Court of California',
      snippet: 'The court ruled that non-compete clauses are generally unenforceable in California unless they fall within one of the statutory exceptions...',
      relevance: 0.95
    },
    {
      id: '2',
      title: 'California Labor Code § 2872',
      source: 'California State Legislature',
      snippet: 'Protections for employee inventions created on their own time without employer resources...',
      relevance: 0.88
    },
    {
      id: '3',
      title: 'Non-Compete Agreements: A Review of Recent Case Law',
      source: 'California Law Review (2022)',
      snippet: 'Recent developments in how courts have interpreted the scope and enforceability of various restrictive covenants...',
      relevance: 0.82
    },
    {
      id: '4',
      title: 'ABC Corp v. XYZ Inc. (2020)',
      source: 'Court of Appeals, 9th Circuit',
      snippet: 'The court distinguished between general non-compete provisions and more limited customer non-solicitation provisions...',
      relevance: 0.75
    },
    {
      id: '5',
      title: 'Protecting Trade Secrets in Employment Relationships',
      source: 'Harvard Business Law Review (2023)',
      snippet: 'Analysis of effective strategies for protecting proprietary information within the constraints of employment law...',
      relevance: 0.70
    }
  ];
  
  // Load default results when component mounts
  useEffect(() => {
    setSearchResults(defaultResults);
    toast({
      title: "Legal Research Ready",
      description: "Showing relevant results for non-compete clauses in California"
    });
  }, []);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate a search delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use the default results for mock search
    setSearchResults(defaultResults);
    setIsSearching(false);
  };
  
  const recentSearches = [
    'Non-compete enforcement California',
    'Trade secret misappropriation damages',
    'Force majeure clause COVID-19 cases',
    'Intellectual property ownership employment agreement',
  ];
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background">
        <div>
          <h2 className="text-lg font-medium">Legal Research</h2>
          <p className="text-sm text-muted-foreground">
            Find relevant cases, statutes, and legal articles
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClose}
          className="ml-auto"
        >
          Close Research
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="search" className="h-full flex flex-col">
          <div className="px-4 pt-4 border-b">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="search" className="flex-1 p-0 overflow-hidden flex flex-col">
            <form onSubmit={handleSearch} className="p-4 flex gap-2">
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cases, statutes, or legal articles..."
                className="flex-1"
              />
              <Button type="submit" disabled={isSearching}>
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </form>
            
            <ScrollArea className="flex-1">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Searching legal databases...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-4 space-y-4">
                  <p className="text-sm text-muted-foreground">{searchResults.length} results for "{searchQuery}"</p>
                  
                  {searchResults.map(result => (
                    <Card key={result.id} className="hover:bg-muted/30 transition-colors">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-md">{result.title}</CardTitle>
                          <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
                            {(result.relevance * 100).toFixed(0)}% match
                          </span>
                        </div>
                        <CardDescription>{result.source}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-1">
                        <p className="text-sm">{result.snippet}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <span>Read more</span>
                          <ArrowRight size={14} />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="flex flex-col items-center justify-center p-12">
                  <FileText size={48} className="text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                  <p className="text-xs text-muted-foreground mt-2">Try different keywords or browse recent searches</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12">
                  <Search size={48} className="text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Enter a search query to find legal resources</p>
                  <p className="text-xs text-muted-foreground mt-2">Search cases, statutes, or legal articles</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="recent" className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <h3 className="text-md font-medium mb-4">Recent Searches</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="flex items-center p-2 hover:bg-muted/30 rounded-md transition-colors cursor-pointer">
                      <Clock size={16} className="text-muted-foreground mr-2" />
                      <span>{search}</span>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-md font-medium mb-4 mt-8">Recently Viewed</h3>
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-md">Brown v. Board of Education (1954)</CardTitle>
                      <CardDescription>Supreme Court of the United States</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      <p className="text-sm">Landmark decision declaring segregation in public schools unconstitutional...</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-md">Delaware General Corporation Law § 102(b)(7)</CardTitle>
                      <CardDescription>Delaware Code</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-1">
                      <p className="text-sm">Provisions regarding the limitation of director liability...</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="saved" className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="flex flex-col items-center justify-center p-12">
                <BookOpen size={48} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground">You haven't saved any research items yet</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Browse library
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
