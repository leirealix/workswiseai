
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus, Mic, MoreHorizontal, RefreshCw, FileIcon, XIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import PromptManager from './PromptManager';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
  onNewConversation?: () => void;
  isDisabled?: boolean;
}

export default function ChatInput({ 
  onSendMessage, 
  onFileUpload, 
  onNewConversation, 
  isDisabled = false 
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

  const handleSelectPrompt = (promptContent: string) => {
    setInput(promptContent);
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
        
        {/* Replace the standard Button with PromptManager component */}
        <PromptManager onSelectPrompt={handleSelectPrompt} />
        
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
