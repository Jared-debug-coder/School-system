import React from 'react';
import { Users, Calendar, Book, FileText, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const getNavigationForRole = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/', icon: Calendar },
        { name: 'Students', href: '/students', icon: Users },
        { name: 'Finance', href: '/finance', icon: FileText },
        { name: 'Reports', href: '/reports', icon: Book },
      ];
    }

    if (user?.role === 'accountant') {
      return [
        { name: 'Finance Dashboard', href: '/accountant', icon: Calendar },
        { name: 'Students', href: '/students', icon: Users },
        { name: 'Finance', href: '/finance', icon: FileText },
        { name: 'Reports', href: '/reports', icon: Book },
      ];
    }

    if (user?.role === 'parent') {
      return [
        { name: 'Dashboard', href: '/parent', icon: Calendar },
      ];
    }

    return [
      { name: 'Dashboard', href: '/', icon: Calendar },
    ];
  };

  const navigation = getNavigationForRole();

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Small delay to show the toast before logout
    setTimeout(() => {
      logout();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-600 to-orange-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">NA</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Nairobi Academy</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-600 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="p-1 h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8 px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
