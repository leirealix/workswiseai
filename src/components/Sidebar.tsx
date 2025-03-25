
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
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-14" : "w-52",
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
            collapsed={collapsed} 
            active={location.pathname === '/'}
            onClick={() => navigate('/')}
          />
          <NavItem 
            icon={FilesIcon} 
            label="Documents" 
            collapsed={collapsed}
            active={location.pathname === '/documents'}
            onClick={() => navigate('/documents')}
          />
          <NavItem 
            icon={UsersIcon} 
            label="Collaborations" 
            collapsed={collapsed}
            active={location.pathname === '/collaborations'}
            onClick={() => navigate('/collaborations')}
          />
          <NavItem 
            icon={HistoryIcon} 
            label="History" 
            collapsed={collapsed}
            active={location.pathname === '/history'}
            onClick={() => navigate('/history')}
          />

          <div className="my-2 border-t mx-2"></div>
          
          <NavItem 
            icon={SettingsIcon} 
            label="Settings" 
            collapsed={collapsed}
            active={location.pathname === '/settings'}
            onClick={() => navigate('/settings')}
          />
        </nav>
      </ScrollArea>
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
        collapsed ? "w-10 px-0 justify-center" : "w-full px-3"
      )}
      onClick={onClick}
    >
      <Icon size={20} className={collapsed ? "mx-auto" : "mr-2"} />
      {!collapsed && <span>{label}</span>}
    </Button>
  );
}
