
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HistoryIcon, ArrowRightIcon, RotateCcwIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import Sidebar from '@/components/Sidebar';

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  messages: number;
  documentName?: string;
}

export default function History() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem('history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        // Convert string dates back to Date objects
        const historyWithDates = parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistoryItems(historyWithDates);
      } catch (error) {
        console.error('Error parsing history:', error);
      }
    }
  }, []);

  const continueConversation = (id: string) => {
    // In a real app, this would load the conversation
    toast({
      title: "Conversation Loaded",
      description: "Continuing from previous conversation."
    });
  };

  const clearHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem('history');
    toast({
      title: "History Cleared",
      description: "Your conversation history has been cleared."
    });
  };

  return (
    <div className="h-full w-full overflow-hidden flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Conversation History</h1>
          {historyItems.length > 0 && (
            <Button variant="outline" onClick={clearHistory}>
              <RotateCcwIcon size={16} className="mr-2" />
              Clear History
            </Button>
          )}
        </div>

        {historyItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <HistoryIcon size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No History Yet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Your conversation history will appear here once you start chatting with the AI.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {historyItems.map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="truncate">{item.title}</CardTitle>
                    <CardDescription>
                      {item.timestamp.toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {item.messages} message{item.messages !== 1 ? 's' : ''}
                    </p>
                    {item.documentName && (
                      <p className="text-sm font-medium mt-2">
                        Document: {item.documentName}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      onClick={() => continueConversation(item.id)}
                    >
                      <span>Continue</span>
                      <ArrowRightIcon size={16} className="ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
