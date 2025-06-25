
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast({
      title: "Berhasil logout",
      description: "Anda telah keluar dari sistem",
    });
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Get user avatar from localStorage or use default
  const userAvatar = localStorage.getItem('userAvatar');
  const userName = localStorage.getItem('userName') || user?.email?.split('@')[0] || 'User';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo Website */}
          <div className="flex items-center space-x-3">
            <div className="w-48 rounded-lg flex items-center justify-center">
              <img className="bg-opacity-0" src="./dist/assets/pusbangtaldig.png" alt="Description of image" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Talenta Digital</h1>
            </div>
          </div>
        </div>

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-3 p-2 hover:bg-gray-50">
              <Avatar className="w-8 h-8">
                <AvatarImage src={userAvatar || undefined} alt={userName} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white">
            <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
              <User className="w-4 h-4 mr-2" />
              User Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
