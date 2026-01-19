import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarItem {
  name: string;
  path: string;
  icon: string;
  roles: ('admin' | 'employee')[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: '📊',
    roles: ['admin', 'employee'],
  },
  {
    name: 'Employees',
    path: '/employees',
    icon: '👥',
    roles: ['admin'],
  },
  {
    name: 'My Profile',
    path: '/profile',
    icon: '👤',
    roles: ['admin', 'employee'],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredItems = sidebarItems.filter(item => 
    item.roles.includes(user?.role as 'admin' | 'employee')
  );

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="space-y-2">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;