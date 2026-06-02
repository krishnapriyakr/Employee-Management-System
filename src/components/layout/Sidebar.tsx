import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarItem {
  name: string;
  path: string;
  icon: string;
  roles: ('admin' | 'employee')[];
  isDropdown?: boolean;
  dropdownItems?: SidebarItem[];
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
    name: 'Attendance',
    path: '/attendance/my-attendance',
    icon: '📅',
    roles: ['admin', 'employee'],
  },
  {
    name: 'Leave Management',
    path: '#',
    icon: '🏖️',
    roles: ['admin', 'employee'],
    isDropdown: true,
    dropdownItems: [
      {
        name: 'My Leaves',
        path: '/leave/my-leaves',
        icon: '📋',
        roles: ['employee', 'admin'],
      },
      {
        name: 'Apply Leave',
        path: '/leave/apply',
        icon: '✏️',
        roles: ['employee', 'admin'],
      },
      {
        name: 'Leave Balance',
        path: '/leave/balance',
        icon: '💰',
        roles: ['employee', 'admin'],
      },
      {
        name: 'Leave Requests',
        path: '/leave/requests',
        icon: '📋',
        roles: ['admin'],
      },
      {
        name: 'Leave Statistics',
        path: '/leave/statistics',
        icon: '📈',
        roles: ['admin'],
      },
    ],
  },
  {
    name: 'Performance',
    path: '#',
    icon: '⭐',
    roles: ['admin', 'employee'],
    isDropdown: true,
    dropdownItems: [
      {
        name: 'My Reviews',
        path: '/performance/my-reviews',
        icon: '📝',
        roles: ['employee', 'admin'],
      },
      {
        name: 'My Goals',
        path: '/performance/my-goals',
        icon: '🎯',
        roles: ['employee', 'admin'],
      },
      {
        name: 'Performance Dashboard',
        path: '/performance/admin/dashboard',
        icon: '📊',
        roles: ['admin'],
      },
      {
        name: 'Create Review',
        path: '/performance/reviews/create',
        icon: '➕',
        roles: ['admin'],
      },
    ],
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
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(['Leave Management', 'Performance']);

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev =>
      prev.includes(name)
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (path: string) => {
    if (path === '#') return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const filteredItems = sidebarItems.filter(item =>
    item.roles.includes(user?.role as 'admin' | 'employee')
  );

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">EMS Portal</h1>
        <p className="text-xs text-gray-400 mt-1">{user?.role === 'admin' ? 'Administrator' : 'Employee'}</p>
      </div>
      
      <div className="space-y-1">
        {filteredItems.map((item) => {
          if (item.isDropdown && item.dropdownItems) {
            const isOpen = openDropdowns.includes(item.name);
            const filteredDropdown = item.dropdownItems.filter(dropItem =>
              dropItem.roles.includes(user?.role as 'admin' | 'employee')
            );

            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors duration-200 hover:bg-gray-700 ${
                    isOpen ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isOpen && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-2">
                    {filteredDropdown.map((dropItem) => (
                      <Link
                        key={dropItem.path}
                        to={dropItem.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                          isActive(dropItem.path)
                            ? 'bg-primary-500 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <span className="text-sm">{dropItem.icon}</span>
                        <span className="text-sm">{dropItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
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