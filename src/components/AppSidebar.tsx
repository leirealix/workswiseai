
import { useNavigate } from "react-router-dom";
import { 
  History, 
  User, 
  Settings, 
  MessageSquare,
  ChevronLeft
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
import { Button } from "@/components/ui/button";

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

  const handleSelectConversation = (id: string) => {
    // Logic to load the selected conversation would go here
    console.log(`Selected conversation: ${id}`);
  };

  const handleCloseSidebar = () => {
    onMouseLeave();
  };

  return (
    <div className="h-full" onMouseLeave={onMouseLeave}>
      <Sidebar className="border-r border-border/30">
        <SidebarHeader className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold text-primary">AI Lawyer</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full hover:bg-primary/10" 
            onClick={handleCloseSidebar}
          >
            <ChevronLeft size={18} className="text-primary" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </SidebarHeader>
        <SidebarContent>
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
