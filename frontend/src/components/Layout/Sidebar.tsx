import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Wrench, 
  Database, 
  Archive,
  ChevronLeft,
  ChevronRight,
  Brain,
  Zap,
  Server,
  Loader2,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Workspace', href: '/workspace', icon: Wrench },
  { name: 'Model Registry', href: '/registry', icon: Archive },
  { name: 'Data Sources', href: '/data', icon: Database },
  { name: 'Server Details', href: '/servers', icon: Server },
  { name: 'API Keys', href: '/api-keys', icon: Key },
];

interface SidebarProps {
  isTraining: boolean;
}

export function Sidebar({ isTraining }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="h-8 w-8 text-indigo-400" />
              <Zap className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">I2v data trainer</h1>
              <p className="text-xs text-slate-400">ML Platform</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          const isWorkspace = item.name === 'Workspace';

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center p-3 rounded-lg text-sm font-medium transition-colors",
                !collapsed && "space-x-3",
                collapsed && "justify-center",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isWorkspace && isTraining && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                )}
              </div>

              {!collapsed && (
                <span className="flex-1">{item.name}</span>
              )}

              {isWorkspace && isTraining && !collapsed && (
                <Loader2 className="h-4 w-4 animate-spin text-yellow-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-slate-800">
          <div className="text-xs text-slate-500">
            <p>Version 2.1.0</p>
            <p>© 2025 I2v data trainer</p>
          </div>
        </div>
      )}
    </div>
  );
}