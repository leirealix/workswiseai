
import { useState, useEffect } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Prompt {
  id: string;
  content: string;
}

interface PromptManagerProps {
  onSelectPrompt: (prompt: string) => void;
}

export default function PromptManager({ onSelectPrompt }: PromptManagerProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [newPrompt, setNewPrompt] = useState('');
  
  // Load prompts from localStorage on component mount
  useEffect(() => {
    const savedPrompts = localStorage.getItem('userPrompts');
    if (savedPrompts) {
      setPrompts(JSON.parse(savedPrompts));
    }
  }, []);
  
  // Save prompts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPrompts', JSON.stringify(prompts));
  }, [prompts]);
  
  const addPrompt = () => {
    if (newPrompt.trim()) {
      const newPromptItem = {
        id: Date.now().toString(),
        content: newPrompt.trim()
      };
      setPrompts([...prompts, newPromptItem]);
      setNewPrompt('');
    }
  };
  
  const deletePrompt = (id: string) => {
    setPrompts(prompts.filter(prompt => prompt.id !== id));
  };
  
  const handleSelectPrompt = (content: string) => {
    onSelectPrompt(content);
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="rounded-full flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Plus size={16} />
          <span>Prompts</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="end" 
        sideOffset={5}
      >
        <div className="flex flex-col max-h-[400px]">
          <div className="p-4 border-b">
            <h3 className="font-medium mb-1">Saved Prompts</h3>
            <p className="text-sm text-muted-foreground">
              Create and use prompts for quick actions
            </p>
          </div>
          
          <div className="p-3 flex gap-2">
            <Input
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Enter a new prompt..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addPrompt();
                }
              }}
            />
            <Button onClick={addPrompt} disabled={!newPrompt.trim()}>
              Add
            </Button>
          </div>
          
          <div className="overflow-y-auto max-h-[250px] p-2">
            {prompts.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No prompts saved yet. Add one above.
              </div>
            ) : (
              <div className="space-y-2">
                {prompts.map((prompt) => (
                  <div 
                    key={prompt.id} 
                    className="group flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div 
                      className="flex-1 text-sm truncate"
                      onClick={() => handleSelectPrompt(prompt.content)}
                    >
                      {prompt.content}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deletePrompt(prompt.id)}
                    >
                      <Trash2 size={14} className="text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
