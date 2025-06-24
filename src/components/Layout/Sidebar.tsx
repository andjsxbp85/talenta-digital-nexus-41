
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home,
  Upload,
  Map,
  Lightbulb,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      show: true
    },
    {
      title: 'Unggah SKKNI',
      href: '/upload-skkni',
      icon: Upload,
      show: true
    },
    {
      title: 'Peta Mitra',
      href: '/peta-mitra',
      icon: Map,
      show: true
    },
    {
      title: 'Rekomendasi',
      href: '/rekomendasi',
      icon: Lightbulb,
      show: true
    },
    {
      title: 'Admin Panel',
      href: '/admin',
      icon: Settings,
      show: user?.role === 'admin'
    }
  ];

  const visibleMenuItems = menuItems.filter(item => item.show);

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-200 sidebar-transition z-50",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="text-white">
              <h2 className="text-xl font-bold">PPTD</h2>
              <p className="text-sm text-blue-100">Kemenkominfo</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg" 
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600")} />
                  {!collapsed && <span className="font-medium">{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <p className="font-medium">Masuk sebagai:</p>
            <p className="text-xs truncate">{user?.email}</p>
            <p className="text-xs mt-1 text-blue-600 font-medium">Role: {user?.role}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
