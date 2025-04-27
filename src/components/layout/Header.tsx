import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  Search, 
  User 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const pageTitle: Record<string, string> = {
  '/': 'Dashboard',
  '/board': 'Kanban Board',
  '/customers': 'Customers',
  '/settings': 'Settings'
};

function Header({ toggleSidebar }: HeaderProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const title = pageTitle[location.pathname] || 'Page Not Found';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="z-10 py-4 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="mr-3 md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200">
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center focus:outline-none"
            >
              <div className="p-2 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200">
                <User className="h-5 w-5" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-20">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                </div>
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;