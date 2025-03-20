
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { UserIcon, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import LawyerIcon from './LawyerIcon';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatInput from '@/components/ChatInput';

interface MessageListProps {
  messages: Message[];
  isWaiting?: boolean;
  onSendMessage?: (message: string) => void;
  onFileUpload?: (file: File) => void;
  onNewConversation?: () => void;
  isDisabled?: boolean;
}

export default function MessageList({ 
  messages, 
  isWaiting = false,
  onSendMessage,
  onFileUpload,
  onNewConversation,
  isDisabled = false
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isWaiting]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-muted/50 rounded-full p-4 mb-4 animate-fade-in">
          <LawyerIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>AI Lawyer</h3>
        <p className="text-muted-foreground max-w-md mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          I can use various tools, including iManage, emails, legal databases, and more, to help you complete the task.
        </p>
        
        {onSendMessage && onFileUpload && (
          <div className="w-full max-w-2xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <ChatInput 
              onSendMessage={onSendMessage} 
              onFileUpload={onFileUpload}
              onNewConversation={onNewConversation}
              isDisabled={isDisabled} 
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 h-full">
      <div className="space-y-4 p-4 pb-6 min-h-full">
        {messages.map((message, index) => {
          const isConsecutive = index > 0 && messages[index - 1].role === message.role;
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 animate-fade-in",
                message.role === 'user' ? "justify-end" : "justify-start",
                isConsecutive ? "mt-1" : "mt-4"
              )}
            >
              {message.role === 'assistant' && !isConsecutive && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <LawyerIcon size={18} />
                </div>
              )}

              {message.role === 'assistant' && isConsecutive && (
                <div className="w-8 flex-shrink-0"></div>
              )}

              <div
                className={cn(
                  "px-4 py-3 rounded-xl max-w-[85%]",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-secondary text-secondary-foreground rounded-tl-none",
                  isConsecutive && message.role === 'user' ? "rounded-tr-xl" : "",
                  isConsecutive && message.role === 'assistant' ? "rounded-tl-xl" : ""
                )}
              >
                {message.content}
              </div>

              {message.role === 'user' && !isConsecutive && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <UserIcon size={18} />
                </div>
              )}

              {message.role === 'user' && isConsecutive && (
                <div className="w-8 flex-shrink-0"></div>
              )}
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Improved subtle typing animation when waiting for AI response */}
      {isWaiting && (
        <div className="flex justify-center items-center mt-2 mb-4">
          <div className="bg-secondary/70 text-secondary-foreground rounded-full px-4 py-2 flex items-center space-x-1.5 shadow-sm animate-fade-in">
            <span className="text-xs font-medium">Thinking</span>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      )}
    </ScrollArea>
  );
}
