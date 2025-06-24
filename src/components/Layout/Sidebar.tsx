
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home,
  Upload,
  Map,
  Lightbulb,
  Settings,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
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
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">PPTD</h2>
            <p className="text-sm text-gray-300">Kemenkominfo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <p>Masuk sebagai: {user?.email}</p>
          <p className="text-xs mt-1">Role: {user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
