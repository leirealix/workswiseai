
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onMultipleFilesSelect?: (files: File[]) => void;
}

export default function FileUpload({ onFileSelect, onMultipleFilesSelect }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(acceptedFiles);
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
  });

  const handleSubmit = () => {
    if (files.length === 1) {
      onFileSelect(files[0]);
    } else if (files.length > 1 && onMultipleFilesSelect) {
      onMultipleFilesSelect(files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeAllFiles = () => {
    setFiles([]);
  };

  return (
    <div className="w-full p-6 flex flex-col items-center">
      <div 
        {...getRootProps()} 
        className={cn(
          "w-full border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all text-center hover:bg-muted/20",
          isDragActive ? "border-primary bg-primary/5" : "border-muted",
          files.length > 0 ? "bg-muted/10" : ""
        )}
      >
        <input {...getInputProps()} />
        
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/70">
              <UploadIcon size={24} />
            </div>
            <div>
              <p className="text-lg font-medium">Upload documents</p>
              <p className="text-sm text-muted-foreground mt-1">
                Drop your files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground/70 mt-4">
                Supported formats: PDF, DOC, DOCX, TXT
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center space-x-4 bg-muted/20 p-2 rounded-lg">
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
                      removeFile(index);
                    }}
                    className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  >
                    <XIcon size={16} />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAllFiles();
                }}
                className="text-sm"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <Button 
          onClick={handleSubmit} 
          className="mt-4 w-full max-w-xs transition-all"
        >
          Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
        </Button>
      )}
    </div>
  );
}
