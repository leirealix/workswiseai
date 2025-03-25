
import { useState, useEffect } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  
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
  
  const deletePrompt = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    setPrompts(prompts.filter(prompt => prompt.id !== id));
  };
  
  const handleSelectPrompt = (content: string) => {
    onSelectPrompt(content);
    setIsOpen(false); // Close the popover after selection
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
          <div className="p-2 border-b">
            <h3 className="text-sm font-medium">Saved Prompts</h3>
            <p className="text-xs text-muted-foreground">
              Create and use prompts for quick actions
            </p>
          </div>
          
          <div className="p-2 flex gap-2 border-b">
            <Input
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Enter a new prompt..."
              className="flex-1 text-sm h-8"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addPrompt();
                }
              }}
            />
            <Button 
              onClick={addPrompt} 
              disabled={!newPrompt.trim()} 
              size="sm" 
              className="h-8"
            >
              Add
            </Button>
          </div>
          
          <div className="overflow-y-auto max-h-[250px] py-1">
            {prompts.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No prompts saved yet
              </div>
            ) : (
              <div className="space-y-0.5 px-1">
                {prompts.map((prompt) => (
                  <div 
                    key={prompt.id} 
                    className="group flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleSelectPrompt(prompt.content)}
                  >
                    <div 
                      className="flex-1 text-sm truncate"
                      title={prompt.content}
                    >
                      {prompt.content}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => deletePrompt(e, prompt.id)}
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
