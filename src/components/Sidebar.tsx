
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FilesIcon, 
  UsersIcon, 
  SettingsIcon, 
  HistoryIcon,
  MenuIcon,
  HomeIcon,
  PanelLeftIcon,
  PanelRightIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-52",
        className
      )}
    >
      <div className="flex h-14 items-center px-4 border-b">
        {!collapsed && (
          <div className="flex items-center">
            <h2 className="text-lg font-semibold">Workswise AI</h2>
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
      
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          <NavItem 
            icon={HomeIcon} 
            label="Home" 
            to="/"
            collapsed={collapsed} 
          />
          <NavItem 
            icon={FilesIcon} 
            label="Documents" 
            to="/documents"
            collapsed={collapsed} 
          />
          <NavItem 
            icon={UsersIcon} 
            label="Collaborations" 
            to="/collaborations"
            collapsed={collapsed} 
          />
          <NavItem 
            icon={HistoryIcon} 
            label="History" 
            to="/history"
            collapsed={collapsed} 
          />

          <div className="my-2 border-t mx-2"></div>
          
          <NavItem 
            icon={SettingsIcon} 
            label="Settings" 
            to="/settings"
            collapsed={collapsed} 
          />
        </nav>
      </ScrollArea>
    </div>
  );
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  collapsed: boolean;
}

function NavItem({ icon: Icon, label, to, collapsed }: NavItemProps) {
  // Check if this link is active based on the current location
  const isActive = window.location.pathname === to;
  
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "flex justify-start h-10 py-2",
        collapsed ? "w-12 px-0 justify-center" : "w-full px-3"
      )}
      asChild
    >
      <Link to={to}>
        <Icon size={20} className={collapsed ? "mx-auto" : "mr-2"} />
        {!collapsed && <span>{label}</span>}
      </Link>
    </Button>
  );
}
