
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersIcon, UserPlusIcon, MessageSquareIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import Sidebar from '@/components/Sidebar';

interface Collaboration {
  id: string;
  title: string;
  participants: string[];
  lastUpdated: Date;
  status: 'active' | 'pending' | 'completed';
}

export default function Collaborations() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);

  useEffect(() => {
    // Load collaborations from localStorage
    const savedCollaborations = localStorage.getItem('collaborations');
    if (savedCollaborations) {
      try {
        const parsedCollabs = JSON.parse(savedCollaborations);
        // Convert string dates back to Date objects
        const collabsWithDates = parsedCollabs.map((collab: any) => ({
          ...collab,
          lastUpdated: new Date(collab.lastUpdated)
        }));
        setCollaborations(collabsWithDates);
      } catch (error) {
        console.error('Error parsing collaborations:', error);
      }
    }
  }, []);

  const inviteCollaborator = (id: string) => {
    // In a real app, this would open an invite dialog
    toast({
      title: "Invite Sent",
      description: "An invitation has been sent to collaborate."
    });
  };

  const openChat = (id: string) => {
    // In a real app, this would open a chat window
    toast({
      title: "Chat Opened",
      description: "Chat functionality would open here."
    });
  };

  return (
    <div className="h-full w-full overflow-hidden flex">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Collaborations</h1>
          <Button>
            <UserPlusIcon size={16} className="mr-2" />
            New Collaboration
          </Button>
        </div>

        {collaborations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <UsersIcon size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No Collaborations Yet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Invite team members to collaborate on document analysis and share insights.
            </p>
            <Button>
              <UserPlusIcon size={16} className="mr-2" />
              Start Collaborating
            </Button>
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collaborations.map((collab) => (
                <Card key={collab.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="truncate">{collab.title}</CardTitle>
                    <CardDescription>
                      Last updated: {collab.lastUpdated.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium mr-2">Status:</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        collab.status === 'active' ? 'bg-green-100 text-green-800' :
                        collab.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {collab.participants.length} participant{collab.participants.length !== 1 ? 's' : ''}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => inviteCollaborator(collab.id)}
                    >
                      <UserPlusIcon size={16} className="mr-2" />
                      Invite
                    </Button>
                    <Button 
                      variant="secondary"
                      onClick={() => openChat(collab.id)}
                    >
                      <MessageSquareIcon size={16} className="mr-2" />
                      Chat
                    </Button>
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
