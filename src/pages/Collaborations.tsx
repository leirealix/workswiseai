
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UsersIcon, SendIcon, PlusIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import Sidebar from '@/components/Sidebar';

interface Collaboration {
  id: string;
  documentId: string;
  documentTitle: string;
  sharedWith: string;
  status: 'pending' | 'active';
  createdAt: string;
}

export default function Collaborations() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [email, setEmail] = useState('');
  const [searchParams] = useSearchParams();
  const docId = searchParams.get('docId');

  // Load collaborations from localStorage on component mount
  useEffect(() => {
    const savedCollaborations = localStorage.getItem('collaborations');
    if (savedCollaborations) {
      setCollaborations(JSON.parse(savedCollaborations));
    }
  }, []);

  // If docId is provided, prepare to share it
  useEffect(() => {
    if (docId) {
      const savedDocuments = localStorage.getItem('savedDocuments');
      if (savedDocuments) {
        const documents = JSON.parse(savedDocuments);
        const document = documents.find((doc: any) => doc.id === docId);
        if (document) {
          // Set up for sharing document
          console.log('Ready to share document:', document.title);
        }
      }
    }
  }, [docId]);

  const handleShare = () => {
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    if (docId) {
      const savedDocuments = localStorage.getItem('savedDocuments');
      if (savedDocuments) {
        const documents = JSON.parse(savedDocuments);
        const document = documents.find((doc: any) => doc.id === docId);
        
        if (document) {
          const newCollaboration = {
            id: `collab-${Date.now()}`,
            documentId: docId,
            documentTitle: document.title,
            sharedWith: email,
            status: 'pending' as const,
            createdAt: new Date().toISOString(),
          };
          
          const updatedCollaborations = [...collaborations, newCollaboration];
          setCollaborations(updatedCollaborations);
          localStorage.setItem('collaborations', JSON.stringify(updatedCollaborations));
          setEmail('');
        }
      }
    } else {
      // Request help without document
      const newCollaboration = {
        id: `collab-${Date.now()}`,
        documentId: '',
        documentTitle: 'Help Request',
        sharedWith: email,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };
      
      const updatedCollaborations = [...collaborations, newCollaboration];
      setCollaborations(updatedCollaborations);
      localStorage.setItem('collaborations', JSON.stringify(updatedCollaborations));
      setEmail('');
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Collaborations</h1>
          <p className="text-muted-foreground">Share documents or request help from team members</p>
        </div>

        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-lg font-medium mb-3">
            {docId ? 'Share this document' : 'Request help from a team member'}
          </h2>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="flex-1"
            />
            <Button onClick={handleShare}>
              <SendIcon size={16} className="mr-2" />
              {docId ? 'Share' : 'Request Help'}
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-280px)] w-full">
          {collaborations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Shared With</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collaborations.map((collab) => (
                  <TableRow key={collab.id}>
                    <TableCell>{collab.documentTitle}</TableCell>
                    <TableCell>{collab.sharedWith}</TableCell>
                    <TableCell>
                      <span className={collab.status === 'active' ? 'text-green-500' : 'text-amber-500'}>
                        {collab.status === 'active' ? 'Active' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(collab.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="bg-muted/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <UsersIcon size={24} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No collaborations yet</h3>
              <p className="text-muted-foreground mb-4">
                Share documents with team members or request their help on a document.
              </p>
              <Button variant="outline" onClick={() => setEmail('example@company.com')}>
                <PlusIcon size={16} className="mr-2" />
                Start a collaboration
              </Button>
            </div>
          )}
        </ScrollArea>
      </main>
    </div>
  );
}
