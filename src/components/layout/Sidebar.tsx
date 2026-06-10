import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaCalendarAlt, 
  FaUmbrellaBeach, 
  FaStar, 
  FaFolderOpen, 
  FaUserCircle,
  FaChevronDown,
  FaChevronRight,
  FaClipboardList,
  FaPlusCircle,
  FaChartLine,
  FaFileAlt,
  FaRegCalendarAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaExchangeAlt,
  FaUserPlus,
  FaRupeeSign,
  FaUniversity,
  FaBuilding,
  FaCalculator,
} from 'react-icons/fa';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: ('admin' | 'employee')[];
  isDropdown?: boolean;
  dropdownItems?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <FaTachometerAlt className="h-5 w-5" />,
    roles: ['admin', 'employee'],
  },
  {
    name: 'Employees',
    path: '/employees',
    icon: <FaUsers className="h-5 w-5" />,
    roles: ['admin'],
  },
  {
    name: 'Attendance',
    path: '/attendance/my-attendance',
    icon: <FaRegCalendarAlt className="h-5 w-5" />,
    roles: ['admin', 'employee'],
  },
  {
    name: 'Leave Management',
    path: '#',
    icon: <FaUmbrellaBeach className="h-5 w-5" />,
    roles: ['admin', 'employee'],
    isDropdown: true,
    dropdownItems: [
      {
        name: 'My Leaves',
        path: '/leave/my-leaves',
        icon: <FaClipboardList className="h-4 w-4" />,
        roles: ['employee', 'admin'],
      },
      {
        name: 'Apply Leave',
        path: '/leave/apply',
        icon: <FaPlusCircle className="h-4 w-4" />,
        roles: ['employee', 'admin'],
      },
      {
        name: 'Leave Balance',
        path: '/leave/balance',
        icon: <FaMoneyBillWave className="h-4 w-4" />,
        roles: ['employee', 'admin'],
      },
      {
        name: 'Leave Requests',
        path: '/leave/requests',
        icon: <FaClipboardList className="h-4 w-4" />,
        roles: ['admin'],
      },
      {
        name: 'Leave Statistics',
        path: '/leave/statistics',
        icon: <FaChartLine className="h-4 w-4" />,
        roles: ['admin'],
      },
    ],
  },
  {
    name: 'Performance',
    path: '#',
    icon: <FaStar className="h-5 w-5" />,
    roles: ['admin', 'employee'],
    isDropdown: true,
    dropdownItems: [
      {
        name: 'My Reviews',
        path: '/performance/my-reviews',
        icon: <FaClipboardList className="h-4 w-4" />,
        roles: ['employee', 'admin'],
      },
      {
        name: 'My Goals',
        path: '/performance/my-goals',
        icon: <FaStar className="h-4 w-4" />,
        roles: ['employee', 'admin'],
      },
      {
        name: 'Performance Dashboard',
        path: '/performance/admin/dashboard',
        icon: <FaChartLine className="h-4 w-4" />,
        roles: ['admin'],
      },
      {
        name: 'Create Review',
        path: '/performance/reviews/create',
        icon: <FaPlusCircle className="h-4 w-4" />,
        roles: ['admin'],
      },
    ],
  },
  {
    name: 'Documents',
    path: '#',
    icon: <FaFolderOpen className="h-5 w-5" />,
    roles: ['admin', 'employee'],
    isDropdown: true,
    dropdownItems: [
      {
        name: 'My Documents',
        path: '/documents/my',
        icon: <FaFileAlt className="h-4 w-4" />,
        roles: ['employee', 'admin'],
      },
      {
        name: 'Document Library',
        path: '/documents/library',
        icon: <FaFolderOpen className="h-4 w-4" />,
        roles: ['admin'],
      },
    ],
  },
  {
    name: 'Recruitment',
    path: '#',
    icon: <FaBriefcase className="h-5 w-5" />,
    roles: ['admin'],
    isDropdown: true,
    dropdownItems: [
      {
        name: 'Job Postings',
        path: '/recruitment/admin/jobs',
        icon: <FaClipboardList className="h-4 w-4" />,
        roles: ['admin'],
      },
      {
        name: 'Applications',
        path: '/recruitment/admin/applications',
        icon: <FaFileAlt className="h-4 w-4" />,
        roles: ['admin'],
      },
    ],
  },
  {
  name: 'Shifts',
  path: '#',
  icon: <FaCalendarAlt className="h-5 w-5" />,
  roles: ['admin', 'employee'],
  isDropdown: true,
  dropdownItems: [
    {
      name: 'My Shifts',
      path: '/shifts/my-shifts',
      icon: <FaRegCalendarAlt className="h-4 w-4" />,
      roles: ['employee', 'admin'],
    },
    {
      name: 'Assign Shift',
      path: '/shifts/assign',
      icon: <FaUserPlus className="h-4 w-4" />,
      roles: ['admin'],
    },
    {
      name: 'Shift Calendar',
      path: '/shifts/calendar',
      icon: <FaCalendarAlt className="h-4 w-4" />,
      roles: ['admin'],
    },
    {
      name: 'Shift Templates',
      path: '/shifts/templates',
      icon: <FaClipboardList className="h-4 w-4" />,
      roles: ['admin'],
    },
    {
      name: 'Swap Requests',
      path: '/shifts/swaps',
      icon: <FaExchangeAlt className="h-4 w-4" />,
      roles: ['employee', 'admin'],
    },
  ],
  },
  {
      name: 'Payroll',
      path: '#',
      icon: <FaMoneyBillWave className="h-5 w-5" />,
      roles: ['admin', 'employee'],
      isDropdown: true,
      dropdownItems: [
        {
          name: 'My Payroll',
          path: '/payroll/my-payroll',
          icon: <FaRupeeSign className="h-4 w-4" />,
          roles: ['employee', 'admin'],
        },
        {
          name: 'Bank Details',
          path: '/payroll/bank-details',
          icon: <FaUniversity className="h-4 w-4" />,
          roles: ['employee', 'admin'],
        },
        {
          name: 'Salary Structures',
          path: '/payroll/salary-structures',
          icon: <FaBuilding className="h-4 w-4" />,
          roles: ['admin'],
        },
        {
          name: 'Process Payroll',
          path: '/payroll/process',
          icon: <FaCalculator className="h-4 w-4" />,
          roles: ['admin'],
        },
      ],
  },
    {
      name: 'Reports',
      path: '#',
      icon: <FaChartLine className="h-5 w-5" />,
      roles: ['admin'],
      isDropdown: true,
      dropdownItems: [
        {
          name: 'Attendance Report',
          path: '/reports/attendance',
          icon: <FaCalendarAlt className="h-4 w-4" />,
          roles: ['admin'],
        },
        {
          name: 'Leave Report',
          path: '/reports/leave',
          icon: <FaUmbrellaBeach className="h-4 w-4" />,
          roles: ['admin'],
        },
        {
          name: 'Payroll Report',
          path: '/reports/payroll',
          icon: <FaMoneyBillWave className="h-4 w-4" />,
          roles: ['admin'],
        },
      ],
    },

  {
    name: 'My Profile',
    path: '/profile',
    icon: <FaUserCircle className="h-5 w-5" />,
    roles: ['admin', 'employee'],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  // ✅ Start with EMPTY array - all dropdowns CLOSED by default
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

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
                  {isOpen ? (
                    <FaChevronDown className="h-4 w-4" />
                  ) : (
                    <FaChevronRight className="h-4 w-4" />
                  )}
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