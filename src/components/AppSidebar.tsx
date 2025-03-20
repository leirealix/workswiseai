
import React from 'react';
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
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { 
  History, 
  User, 
  Settings, 
  MessageSquare, 
  LogOut,
  Plus
} from 'lucide-react';

interface ConversationItem {
  id: string;
  title: string;
  date: string;
}

// Sample conversation history data - this would normally come from a real data source
const recentConversations: ConversationItem[] = [
  { id: '1', title: 'Legal contract review', date: '2 hours ago' },
  { id: '2', title: 'Trademark search', date: 'Yesterday' },
  { id: '3', title: 'Patent analysis', date: '3 days ago' },
  { id: '4', title: 'Compliance check', date: 'Last week' },
];

interface AppSidebarProps {
  onNewConversation: () => void;
  currentConversationId?: string;
}

export function AppSidebar({ onNewConversation, currentConversationId }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold">Legal Assistant</h2>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNewConversation}
            className="flex items-center gap-1 w-full"
          >
            <Plus size={16} />
            {!isCollapsed && <span>New Chat</span>}
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentConversations.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton 
                    isActive={conversation.id === currentConversationId}
                    tooltip={isCollapsed ? conversation.title : undefined}
                  >
                    <MessageSquare />
                    <span>{conversation.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={isCollapsed ? "History" : undefined}>
                  <History />
                  <span>History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={isCollapsed ? "Profile" : undefined}>
                  <User />
                  <span>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={isCollapsed ? "Settings" : undefined}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton variant="outline" tooltip={isCollapsed ? "Sign Out" : undefined}>
                  <LogOut />
                  <span>Sign Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
