
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

export default function ChatInput({ onSendMessage, isDisabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isDisabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-center w-full px-4 py-3 border-t bg-background/80 backdrop-blur-sm custom-transition"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your document..."
        disabled={isDisabled}
        className="flex-1 px-4 py-2 bg-white dark:bg-black/20 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 custom-transition"
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={!input.trim() || isDisabled}
        className="ml-2 rounded-full w-10 h-10 custom-transition hover:bg-primary/90"
      >
        <Send size={18} />
      </Button>
    </form>
  );
}
