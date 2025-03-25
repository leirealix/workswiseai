
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilesIcon, TrashIcon, DownloadIcon, ShareIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import Sidebar from '@/components/Sidebar';

// Rename this interface to avoid conflict with the browser's Document interface
interface DocumentItem {
  id: string;
  title: string;
  createdAt: Date;
  content: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    // Load documents from localStorage
    const savedDocuments = localStorage.getItem('documents');
    if (savedDocuments) {
      try {
        const parsedDocs = JSON.parse(savedDocuments);
        // Convert string dates back to Date objects
        const docsWithDates = parsedDocs.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt)
        }));
        setDocuments(docsWithDates);
      } catch (error) {
        console.error('Error parsing documents:', error);
      }
    }
  }, []);

  const deleteDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    localStorage.setItem('documents', JSON.stringify(updatedDocuments));
    toast({
      title: "Document Deleted",
      description: "The document has been removed successfully."
    });
  };

  const downloadDocument = (document: DocumentItem) => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.title}.txt`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Download Started",
      description: "Your document is being downloaded."
    });
  };

  const shareDocument = (id: string) => {
    // In a real app, this would open a share dialog
    // For now, we'll just copy a fake share link to clipboard
    navigator.clipboard.writeText(`https://app.workswise.ai/share/${id}`);
    toast({
      title: "Share Link Copied",
      description: "Share link has been copied to your clipboard."
    });
  };

  return (
    <div className="h-full w-full overflow-hidden flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">My Documents</h1>
        </div>

        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <FilesIcon size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No Documents Yet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Your analyzed documents will appear here. Start a conversation and save your analysis results.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc) => (
                <Card key={doc.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="truncate">{doc.title}</CardTitle>
                    <CardDescription>
                      {doc.createdAt.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {doc.content.slice(0, 150)}...
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => deleteDocument(doc.id)}
                    >
                      <TrashIcon size={16} />
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => shareDocument(doc.id)}
                      >
                        <ShareIcon size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => downloadDocument(doc)}
                      >
                        <DownloadIcon size={16} />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
