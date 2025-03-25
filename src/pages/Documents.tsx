
import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileIcon, TrashIcon, ShareIcon, EyeIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Sidebar from '@/components/Sidebar';

interface Document {
  id: string;
  title: string;
  createdAt: string;
  content: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);

  // Load saved documents from localStorage on component mount
  useEffect(() => {
    const savedDocuments = localStorage.getItem('savedDocuments');
    if (savedDocuments) {
      setDocuments(JSON.parse(savedDocuments));
    }
  }, []);

  const handleDelete = (id: string) => {
    const updatedDocs = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocs);
    localStorage.setItem('savedDocuments', JSON.stringify(updatedDocs));
  };

  const handleView = (document: Document) => {
    // Future enhancement: Implement document viewer
    console.log('Viewing document:', document);
    alert(`Document content: ${document.content}`);
  };

  const handleShare = (document: Document) => {
    // Navigate to collaborations page with the document
    window.location.href = `/collaborations?docId=${document.id}`;
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage your saved documents</p>
        </div>

        <ScrollArea className="h-[calc(100vh-180px)] w-full">
          {documents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="flex items-center">
                      <FileIcon size={18} className="mr-2 text-muted-foreground" />
                      {doc.title}
                    </TableCell>
                    <TableCell>{new Date(doc.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(doc)}>
                        <EyeIcon size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleShare(doc)}>
                        <ShareIcon size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                        <TrashIcon size={16} className="text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FileIcon size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No documents yet</h3>
              <p className="text-muted-foreground mb-4">
                When you save documents from your conversations, they'll appear here.
              </p>
            </div>
          )}
        </ScrollArea>
      </main>
    </div>
  );
}
