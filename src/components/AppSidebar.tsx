
import { useNavigate } from "react-router-dom";
import { 
  History, 
  User, 
  Settings, 
  MessageSquare, 
  Plus
} from "lucide-react";
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

interface AppSidebarProps {
  isHovered: boolean;
  onMouseLeave: () => void;
}

const AppSidebar = ({ isHovered, onMouseLeave }: AppSidebarProps) => {
  const navigate = useNavigate();
  const { setOpen } = useSidebar();
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
    <div className="h-full" onMouseLeave={onMouseLeave}>
      <Sidebar className="border-r border-border/30">
        <SidebarHeader className="flex items-center p-4">
          <h2 className="text-xl font-semibold text-primary">Document AI</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="px-4 mb-2">
              <button 
                onClick={handleNewChat} 
                className="w-full flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-md px-3 py-2 transition-colors"
              >
                <Plus size={18} />
                New Chat
              </button>
            </div>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground font-medium">Recent Conversations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentConversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton 
                      onClick={() => handleSelectConversation(conversation.id)}
                      tooltip={conversation.title}
                      className="hover:bg-primary/5 text-foreground"
                    >
                      <MessageSquare size={18} className="text-primary/70" />
                      <span>{conversation.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground font-medium">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="History" className="hover:bg-primary/5 text-foreground">
                    <History size={18} className="text-primary/70" />
                    <span>History</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Profile" className="hover:bg-primary/5 text-foreground">
                    <User size={18} className="text-primary/70" />
                    <span>Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings" className="hover:bg-primary/5 text-foreground">
                    <Settings size={18} className="text-primary/70" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-border/30">
          <div className="text-xs text-muted-foreground">
            Version 1.0.0
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
