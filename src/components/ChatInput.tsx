
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Plus, Search, Mic, MoreHorizontal, RefreshCw, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File) => void;
  onFilesUpload?: (files: File[]) => void;
  onNewConversation?: () => void;
  isDisabled?: boolean;
}

export default function ChatInput({ 
  onSendMessage, 
  onFileUpload,
  onFilesUpload,
  onNewConversation, 
  isDisabled = false 
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length === 1) {
        onFileUpload(acceptedFiles[0]);
      } else if (acceptedFiles.length > 1 && onFilesUpload) {
        onFilesUpload(acceptedFiles);
      }
    },
    disabled: isDisabled,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    noClick: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isDisabled) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleFileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.doc,.docx,.txt';
    fileInput.multiple = true;
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        if (files.length === 1) {
          console.log("File selected:", files[0].name);
          onFileUpload(files[0]);
        } else if (files.length > 1 && onFilesUpload) {
          console.log("Multiple files selected:", files.length);
          onFilesUpload(Array.from(files));
        }
      }
    };
    fileInput.click();
  };

  const handleNewConversation = () => {
    if (onNewConversation) {
      onNewConversation();
      setInput('');
    }
  };

  return (
    <div {...getRootProps()} className={`relative w-full ${isDragActive ? 'bg-primary/5' : ''}`}>
      <input {...getInputProps()} />
      <form 
        onSubmit={handleSubmit} 
        className="relative flex flex-col w-full px-4 py-3 border-t bg-background/80 backdrop-blur-sm z-10"
      >
        {isDragActive && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary/50 rounded-lg flex items-center justify-center z-20">
            <div className="text-center p-4">
              <Upload className="mx-auto h-10 w-10 text-primary mb-2" />
              <p className="text-sm font-medium">Drop files to upload</p>
            </div>
          </div>
        )}
        <div className="relative w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Complete any work you request"
            disabled={isDisabled}
            className="pr-12 py-6 pl-4 rounded-full bg-white dark:bg-black/20 border border-border shadow-sm focus-visible:ring-1 focus-visible:ring-primary/30"
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button 
              type="submit" 
              size="icon" 
              disabled={!input.trim() || isDisabled}
              className="rounded-full w-10 h-10 hover:bg-primary/90"
            >
              <Send size={18} />
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
          
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            className="rounded-full flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary"
          >
            <Search size={16} />
            <span>Research</span>
          </Button>
          
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
    </div>
  );
}
