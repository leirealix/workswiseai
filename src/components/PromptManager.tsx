
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
        className="w-80 p-0 shadow-md border rounded-2xl" 
        align="start" 
        alignOffset={-40} 
        side="top"
        sideOffset={10}
      >
        <div className="flex flex-col max-h-[400px]">
          <div className="p-4 border-b">
            <h3 className="text-base font-medium">Saved Prompts</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create and use prompts for quick actions
            </p>
          </div>
          
          <div className="p-4 flex gap-2 border-b">
            <Input
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              placeholder="Enter a new prompt..."
              className="flex-1 h-10 rounded-full text-sm border-[#E5DEFF] focus-visible:ring-[#9b87f5]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addPrompt();
                }
              }}
            />
            <Button 
              onClick={addPrompt} 
              disabled={!newPrompt.trim()} 
              className="h-10 px-6 rounded-full bg-[#9b87f5] hover:bg-[#7E69AB]"
            >
              Add
            </Button>
          </div>
          
          <div className="overflow-y-auto max-h-[250px] py-2">
            {prompts.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No prompts saved yet
              </div>
            ) : (
              <div className="space-y-1 px-2">
                {prompts.map((prompt) => (
                  <div 
                    key={prompt.id} 
                    className="group flex items-center gap-2 px-3 py-2 rounded-md hover:bg-[#F1F0FB] cursor-pointer transition-colors"
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
