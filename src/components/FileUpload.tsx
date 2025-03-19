
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  multiple?: boolean;
}

export default function FileUpload({ onFileSelect, multiple = false }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  const handleSubmit = () => {
    if (file) {
      onFileSelect(file);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="w-full p-6 flex flex-col items-center">
      <div 
        {...getRootProps()} 
        className={cn(
          "w-full border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all text-center hover:bg-muted/20",
          isDragActive ? "border-primary bg-primary/5" : "border-muted",
          file ? "bg-muted/10" : ""
        )}
      >
        <input {...getInputProps()} />
        
        {!file ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/70">
              <UploadIcon size={24} />
            </div>
            <div>
              <p className="text-lg font-medium">Upload a document</p>
              <p className="text-sm text-muted-foreground mt-1">
                Drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground/70 mt-4">
                Supported formats: PDF, DOC, DOCX, TXT
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FileIcon size={20} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <XIcon size={16} />
            </Button>
          </div>
        )}
      </div>

      {file && (
        <Button 
          onClick={handleSubmit} 
          className="mt-4 w-full max-w-xs transition-all"
        >
          Upload to Files
        </Button>
      )}
    </div>
  );
}
