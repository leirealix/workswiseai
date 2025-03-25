
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookmarkIcon, PlusCircleIcon, XIcon, StarIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface SavedQuery {
  id: string;
  text: string;
  createdAt: Date;
  usageCount: number;
}

interface SavedQueriesProps {
  onSelectQuery: (query: string) => void;
}

export default function SavedQueries({ onSelectQuery }: SavedQueriesProps) {
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [newQueryText, setNewQueryText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    // Load saved queries from localStorage
    const storedQueries = localStorage.getItem('savedQueries');
    if (storedQueries) {
      try {
        const parsedQueries = JSON.parse(storedQueries);
        // Convert string dates back to Date objects
        const queriesWithDates = parsedQueries.map((query: any) => ({
          ...query,
          createdAt: new Date(query.createdAt)
        }));
        setSavedQueries(queriesWithDates);
      } catch (error) {
        console.error('Error parsing saved queries:', error);
      }
    }
  }, []);

  const saveToLocalStorage = (queries: SavedQuery[]) => {
    localStorage.setItem('savedQueries', JSON.stringify(queries));
  };

  const addQuery = () => {
    if (!newQueryText.trim()) return;
    
    const newQuery: SavedQuery = {
      id: crypto.randomUUID(),
      text: newQueryText.trim(),
      createdAt: new Date(),
      usageCount: 0
    };
    
    const updatedQueries = [...savedQueries, newQuery];
    setSavedQueries(updatedQueries);
    saveToLocalStorage(updatedQueries);
    setNewQueryText('');
    setIsAdding(false);
    
    toast({
      title: "Query Saved",
      description: "Your query has been saved for future use."
    });
  };

  const deleteQuery = (id: string) => {
    const updatedQueries = savedQueries.filter(query => query.id !== id);
    setSavedQueries(updatedQueries);
    saveToLocalStorage(updatedQueries);
    
    toast({
      title: "Query Deleted",
      description: "The saved query has been removed."
    });
  };

  const handleUseQuery = (query: SavedQuery) => {
    // Update usage count
    const updatedQueries = savedQueries.map(q => 
      q.id === query.id ? { ...q, usageCount: q.usageCount + 1 } : q
    );
    setSavedQueries(updatedQueries);
    saveToLocalStorage(updatedQueries);
    
    // Call the callback function with the query text
    onSelectQuery(query.text);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookmarkIcon size={18} className="text-primary" />
          <h2 className="text-lg font-medium">Saved Queries</h2>
        </div>
        
        {!isAdding && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1"
          >
            <PlusCircleIcon size={14} />
            <span>Add</span>
          </Button>
        )}
      </div>
      
      {isAdding && (
        <div className="mb-4 p-3 border rounded-lg bg-muted/20">
          <div className="flex gap-2 mb-2">
            <Input
              value={newQueryText}
              onChange={(e) => setNewQueryText(e.target.value)}
              placeholder="Enter your query text..."
              className="flex-1"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setIsAdding(false);
                setNewQueryText('');
              }}
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={addQuery}
              disabled={!newQueryText.trim()}
            >
              Save Query
            </Button>
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-1">
        {savedQueries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <BookmarkIcon size={48} className="text-muted-foreground mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-1">No Saved Queries</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              Save your frequently used questions to quickly access them in the future.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1"
            >
              <PlusCircleIcon size={14} />
              <span>Add Your First Query</span>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {savedQueries
              .sort((a, b) => b.usageCount - a.usageCount) // Sort by most used
              .map((query) => (
                <Card key={query.id} className="group">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-sm font-medium flex items-start justify-between">
                      <span className="line-clamp-2">{query.text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
                        onClick={() => deleteQuery(query.id)}
                      >
                        <XIcon size={14} />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="p-3 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <StarIcon size={12} className="fill-primary/30 text-primary/50" />
                      <span>Used {query.usageCount} times</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleUseQuery(query)}
                    >
                      Use
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
