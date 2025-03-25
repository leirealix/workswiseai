
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { HistoryIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Sidebar from '@/components/Sidebar';

interface HistoryItem {
  id: string;
  query: string;
  result: string;
  timestamp: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('conversationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToDocuments = (item: HistoryItem) => {
    const newDocument = {
      id: `doc-${Date.now()}`,
      title: item.query.substring(0, 30) + (item.query.length > 30 ? '...' : ''),
      createdAt: new Date().toISOString(),
      content: item.result
    };

    // Add to saved documents
    const savedDocuments = localStorage.getItem('savedDocuments');
    const documents = savedDocuments ? JSON.parse(savedDocuments) : [];
    documents.push(newDocument);
    localStorage.setItem('savedDocuments', JSON.stringify(documents));

    // Show confirmation
    alert('Document saved successfully!');
  };

  const deleteHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('conversationHistory', JSON.stringify(updatedHistory));
  };

  const clearAllHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      localStorage.removeItem('conversationHistory');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">History</h1>
            <p className="text-muted-foreground">Your past conversations with Workswise AI</p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" onClick={clearAllHistory}>
              Clear All
            </Button>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-180px)] w-full">
          {history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Query</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium truncate max-w-md">
                      {item.query}
                    </TableCell>
                    <TableCell>
                      {new Date(item.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => saveToDocuments(item)}>
                        <SaveIcon size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteHistoryItem(item.id)}>
                        <TrashIcon size={16} className="text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <HistoryIcon size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No history yet</h3>
              <p className="text-muted-foreground mb-4">
                Your conversations with Workswise AI will appear here.
              </p>
            </div>
          )}
        </ScrollArea>
      </main>
    </div>
  );
}
