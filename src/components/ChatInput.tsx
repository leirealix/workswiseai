
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus, Search, Mic, MoreHorizontal, RefreshCw, FileIcon, XIcon, BookmarkIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
  onNewConversation?: () => void;
  isDisabled?: boolean;
  savedPrompts?: string[];
  onSavePrompt?: (prompt: string) => void;
  onDeletePrompt?: (index: number) => void;
  onUsePrompt?: (prompt: string) => void;
}

export default function ChatInput({ 
  onSendMessage, 
  onFileUpload, 
  onNewConversation, 
  isDisabled = false,
  savedPrompts = [],
  onSavePrompt,
  onDeletePrompt,
  onUsePrompt
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPromptsOpen, setIsPromptsOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Upload any pending files first
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        onFileUpload(file);
      });
    }
    
    // Then send the message if there is one
    if (input.trim() && !isDisabled) {
      onSendMessage(input);
      setInput('');
      // Clear uploaded files after sending
      setSelectedFiles([]);
    }
  };

  const handleFileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.doc,.docx,.txt';
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const fileArray = Array.from(files);
        console.log("Files selected:", fileArray.map(f => f.name));
        setSelectedFiles(prev => [...prev, ...fileArray]);
      }
    };
    fileInput.click();
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleNewConversation = () => {
    if (onNewConversation) {
      onNewConversation();
      setInput('');
      setSelectedFiles([]);
    }
  };

  const handleSavePrompt = () => {
    if (input.trim() && onSavePrompt) {
      onSavePrompt(input.trim());
    }
  };

  const handleUsePrompt = (prompt: string) => {
    setInput(prompt);
    setIsPromptsOpen(false);
    
    // Focus the textarea and place cursor at the end
    if (inputRef.current) {
      inputRef.current.focus();
      const length = prompt.length;
      inputRef.current.setSelectionRange(length, length);
    }

    if (onUsePrompt) {
      onUsePrompt(prompt);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex flex-col w-full px-4 py-3 border-t bg-background/80 backdrop-blur-sm z-10"
    >
      {/* Display selected files above the input */}
      {selectedFiles.length > 0 && (
        <div className="mb-2 p-2 rounded-lg bg-muted/30">
          <div className="text-xs text-muted-foreground mb-1 pl-1">Selected files:</div>
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 bg-background rounded-full pl-2 pr-1 py-1 border text-sm"
              >
                <FileIcon size={14} className="text-primary" />
                <span className="truncate max-w-[120px]">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFile(index)}
                  className="h-5 w-5 rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <XIcon size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="relative w-full">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Complete any work you request"
          disabled={isDisabled}
          className="pr-14 py-4 pl-5 min-h-[100px] rounded-xl bg-white dark:bg-black/20 border border-border shadow-sm focus-visible:ring-1 focus-visible:ring-primary/30 text-base resize-none"
        />
        
        <div className="absolute right-3 bottom-3">
          <Button 
            type="submit" 
            size="icon" 
            disabled={(!input.trim() && selectedFiles.length === 0) || isDisabled}
            className="rounded-full w-12 h-12 hover:bg-primary/90"
          >
            <Send size={22} />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2 mt-2 px-2">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          className="rounded-full flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={handleFileUpload}
        >
          <Plus size={16} />
          <span>Files</span>
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          className="rounded-full flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={handleNewConversation}
        >
          <RefreshCw size={16} />
          <span>New</span>
        </Button>
        
        <Popover open={isPromptsOpen} onOpenChange={setIsPromptsOpen}>
          <PopoverTrigger asChild>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              className="rounded-full flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <BookmarkIcon size={16} />
              <span>Prompts</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2" align="start">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Saved Prompts</h3>
                {input.trim() && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSavePrompt}
                    className="h-7 text-xs"
                  >
                    <Plus size={12} className="mr-1" />
                    Save Current
                  </Button>
                )}
              </div>
              
              <ScrollArea className="h-56">
                {savedPrompts.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    {savedPrompts.map((prompt, index) => (
                      <div key={index} className="flex justify-between items-start gap-2 p-2 rounded-md hover:bg-muted group">
                        <button
                          type="button"
                          className="text-sm text-left flex-1 truncate"
                          onClick={() => handleUsePrompt(prompt)}
                        >
                          {prompt}
                        </button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeletePrompt && onDeletePrompt(index)}
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-6 text-center">
                    <BookmarkIcon size={24} className="text-muted-foreground mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">No prompts saved yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Type a prompt and click Save Current
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex-1"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <MoreHorizontal size={16} />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          className="rounded-full h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Mic size={16} />
        </Button>
      </div>
    </form>
  );
}

