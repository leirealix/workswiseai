
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { UserIcon, BotIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-muted/50 rounded-full p-4 mb-4">
          <BotIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">AI Lawyer</h3>
        <p className="text-muted-foreground max-w-md">
          Upload a document or ask me to analyze its content. I can help extract key information and generate summaries.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 w-full">
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-3 animate-enter",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <BotIcon size={18} />
              </div>
            )}

            <div
              className={cn(
                "px-4 py-3 rounded-xl max-w-[80%]",
                message.role === 'user'
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-secondary text-secondary-foreground rounded-tl-none"
              )}
            >
              {message.content}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <UserIcon size={18} />
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
