
import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { History, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Conversation } from '@/types';
import { cn } from '@/lib/utils';

interface ChatHistoryProps {
  onSelectConversation: (conversationId: string) => void;
  currentConversationId?: string;
}

export default function ChatHistory({ 
  onSelectConversation,
  currentConversationId 
}: ChatHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  // Load conversations from localStorage on component mount
  useEffect(() => {
    const storedConversations = localStorage.getItem('conversations');
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    }
  }, []);

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => 
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort conversations by date
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (sortNewestFirst) {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    } else {
      return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
    }
  });

  const toggleSort = () => {
    setSortNewestFirst(!sortNewestFirst);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 space-y-2">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-xs"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={14} />
            Filter
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={toggleSort}
          >
            {sortNewestFirst ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            {sortNewestFirst ? 'Newest first' : 'Oldest first'}
          </Button>
        </div>
        
        {filterOpen && (
          <div className="p-2 bg-muted rounded-md space-y-2">
            <p className="text-xs font-medium">Filter options</p>
            {/* Filter options can be expanded in the future */}
            <Button variant="secondary" size="sm" className="w-full text-xs">
              Clear filters
            </Button>
          </div>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sortedConversations.length > 0 ? (
            sortedConversations.map((conversation) => (
              <div 
                key={conversation.id}
                className={cn(
                  "p-2 rounded-md hover:bg-accent cursor-pointer transition-colors",
                  currentConversationId === conversation.id && "bg-accent"
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm line-clamp-1">{conversation.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(conversation.lastUpdated)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {conversation.snippet}
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <History className="text-muted-foreground mb-2" size={24} />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'No conversations match your search' : 'No conversation history found'}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
