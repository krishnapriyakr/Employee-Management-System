import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { fetchDashboardStats } from '../../api/employeeApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  departments: { [key: string]: number };
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate=useNavigate()


  // const getDashboardStats = async () => {
  //   try {
  //     setIsLoading(true);
  //     const response = await fetchDashboardStats();
  //     if (response.success) {
  //       setStats(response.data);
  //     }
  //   } catch (error: any) {
  //     toast.error('Failed to load dashboard stats');
  //     console.error('Dashboard error:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

    // useEffect(() => {
    // getDashboardStats();
    // }, []);
  
  // if (isLoading) {
  //   return (
  //     <Layout>
  //       <div className="flex items-center justify-center h-64">
  //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  //       </div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">
            Welcome to your Employee Management System dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Employees Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalEmployees || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Active Employees Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.activeEmployees || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Departments Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.departments ? Object.keys(stats.departments).length : 0}
                </p>
              </div>
            </div>
          </div>

          {/* Active Rate Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalEmployees && stats?.activeEmployees
                    ? `${Math.round((stats.activeEmployees / stats.totalEmployees) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        {stats?.departments && Object.keys(stats.departments).length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Department Distribution
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.departments).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{dept}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{
                          width: `${(count / stats.totalEmployees) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button onClick={() => navigate('/employees/add')} className="bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
              Add New Employee
            </button>
            <button onClick={() => navigate('/employees/')} className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
              View All Employees
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
              Generate Reports
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;