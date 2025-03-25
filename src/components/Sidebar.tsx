
import { useState } from 'react';
import { 
  FilesIcon, 
  UsersIcon, 
  SettingsIcon, 
  HistoryIcon,
  MenuIcon,
  HomeIcon,
  PanelLeftIcon,
  PanelRightIcon,
  BriefcaseIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatHistory from './ChatHistory';

interface SidebarProps {
  className?: string;
  onSelectConversation?: (conversationId: string) => void;
  currentConversationId?: string;
}

export default function Sidebar({ 
  className, 
  onSelectConversation = () => {}, 
  currentConversationId
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'documents' | 'collaborations' | 'settings'>('home');

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Renders content based on active tab
  const renderContent = () => {
    if (collapsed) return null;
    
    switch (activeTab) {
      case 'history':
        return (
          <ChatHistory 
            onSelectConversation={onSelectConversation}
            currentConversationId={currentConversationId}
          />
        );
      case 'home':
        return (
          <div className="p-4 text-sm">
            <h3 className="font-medium mb-2">Welcome to Works Wise</h3>
            <p className="text-muted-foreground">
              Your AI assistant that helps with legal documents and research.
            </p>
          </div>
        );
      case 'documents':
        return (
          <div className="p-4 text-sm">
            <h3 className="font-medium mb-2">Your Documents</h3>
            <p className="text-muted-foreground">
              Document management will be available soon.
            </p>
          </div>
        );
      case 'collaborations':
        return (
          <div className="p-4 text-sm">
            <h3 className="font-medium mb-2">Collaborations</h3>
            <p className="text-muted-foreground">
              Collaboration features will be available soon.
            </p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-4 text-sm">
            <h3 className="font-medium mb-2">Settings</h3>
            <p className="text-muted-foreground">
              Customize your Works Wise experience.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-60",
        className
      )}
    >
      <div className="flex h-14 items-center px-4 border-b">
        {!collapsed && (
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Works Wise</h2>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("ml-auto")} 
          onClick={toggleSidebar}
        >
          {collapsed ? <PanelRightIcon size={18} /> : <PanelLeftIcon size={18} />}
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col">
        <nav className="flex flex-col gap-1 p-2">
          <NavItem 
            icon={HomeIcon} 
            label="Home" 
            collapsed={collapsed} 
            active={activeTab === 'home'}
            onClick={() => setActiveTab('home')}
          />
          <NavItem 
            icon={HistoryIcon} 
            label="History" 
            collapsed={collapsed} 
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
          />
          <NavItem 
            icon={FilesIcon} 
            label="Documents" 
            collapsed={collapsed} 
            active={activeTab === 'documents'}
            onClick={() => setActiveTab('documents')}
          />
          <NavItem 
            icon={UsersIcon} 
            label="Collaborations" 
            collapsed={collapsed} 
            active={activeTab === 'collaborations'}
            onClick={() => setActiveTab('collaborations')}
          />

          <div className="my-2 border-t mx-2"></div>
          
          <NavItem 
            icon={SettingsIcon} 
            label="Settings" 
            collapsed={collapsed} 
            active={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </nav>
        
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon: Icon, label, collapsed, active, onClick }: NavItemProps) {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "flex justify-start h-10 py-2",
        collapsed ? "w-12 px-0 justify-center" : "w-full px-3"
      )}
      onClick={onClick}
    >
      <Icon size={20} className={collapsed ? "mx-auto" : "mr-2"} />
      {!collapsed && <span>{label}</span>}
    </Button>
  );
}
