
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { UserIcon, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import LawyerIcon from './LawyerIcon';

interface MessageListProps {
  messages: Message[];
  isWaiting?: boolean;
}

export default function MessageList({ messages, isWaiting = false }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-muted/50 rounded-full p-4 mb-4">
          <LawyerIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">AI Lawyer</h3>
        <p className="text-muted-foreground max-w-md">
          Upload a document or ask me to analyze its content. I can help extract key information and generate summaries.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto h-full" style={{ maxHeight: "calc(100% - 70px)" }}>
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
                <LawyerIcon size={18} />
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
      
      {/* Centered typing animation when waiting for AI response */}
      {isWaiting && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
          <div className="bg-secondary/90 text-secondary-foreground rounded-xl px-6 py-3 flex items-center space-x-2 shadow-lg animate-fade-in">
            <span className="text-sm font-medium mr-2">AI is thinking</span>
            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      )}
    </div>
  );
}
