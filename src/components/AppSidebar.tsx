
import { useNavigate } from "react-router-dom";
import { 
  History, 
  User, 
  Settings, 
  MessageSquare, 
  ChevronLeft,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { useState } from "react";

type Conversation = {
  id: string;
  title: string;
  date: Date;
};

const AppSidebar = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const [recentConversations, setRecentConversations] = useState<Conversation[]>([
    { id: '1', title: 'Document analysis', date: new Date(2023, 6, 15) },
    { id: '2', title: 'Legal contract review', date: new Date(2023, 6, 10) },
    { id: '3', title: 'Resume parsing', date: new Date(2023, 6, 5) },
  ]);

  const handleNewChat = () => {
    // Clear the current conversation and redirect to home
    navigate('/');
    // Logic for starting a new conversation would go here
  };

  const handleSelectConversation = (id: string) => {
    // Logic to load the selected conversation would go here
    console.log(`Selected conversation: ${id}`);
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">Document AI</h2>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 mb-2">
            <Button 
              onClick={handleNewChat} 
              className="w-full justify-start gap-2"
            >
              <Plus size={18} />
              New Chat
            </Button>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentConversations.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton 
                    onClick={() => handleSelectConversation(conversation.id)}
                    tooltip={conversation.title}
                  >
                    <MessageSquare size={18} />
                    <span>{conversation.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="History">
                  <History size={18} />
                  <span>History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Profile">
                  <User size={18} />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings size={18} />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground">
          Version 1.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
