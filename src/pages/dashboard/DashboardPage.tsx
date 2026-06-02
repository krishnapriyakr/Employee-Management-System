import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { fetchDashboardStats } from '../../api/employeeApi';
import { getAttendanceStats } from '../../api/attendanceApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  departments: { [key: string]: number };
}

interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  absent: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const getDashboardStats = async () => {
    try {
      setIsLoading(true);
      const [employeeResponse, attendanceResponse] = await Promise.all([
        fetchDashboardStats(),
        isAdmin ? getAttendanceStats() : Promise.resolve(null)
      ]);
      
      if (employeeResponse.success) {
        setStats(employeeResponse.data);
      }
      
      if (isAdmin && attendanceResponse?.success) {
        setAttendanceStats(attendanceResponse.data);
      }
    } catch (error: any) {
      toast.error('Failed to load dashboard stats');
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">
            Welcome {user?.name} to your Employee Management System dashboard
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Role: {user?.role === 'admin' ? 'Administrator' : 'Employee'}
          </p>
        </div>

        {/* Today's Attendance Stats - Admin only */}
        {isAdmin && attendanceStats && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Attendance Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Total Employees</p>
                    <p className="text-2xl font-bold text-blue-700">{attendanceStats.total || 0}</p>
                  </div>
                  <span className="text-2xl">👥</span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Present Today</p>
                    <p className="text-2xl font-bold text-green-700">{attendanceStats.present || 0}</p>
                  </div>
                  <span className="text-2xl">✅</span>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600">Late Arrivals</p>
                    <p className="text-2xl font-bold text-yellow-700">{attendanceStats.late || 0}</p>
                  </div>
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-600">Absent Today</p>
                    <p className="text-2xl font-bold text-red-700">{attendanceStats.absent || 0}</p>
                  </div>
                  <span className="text-2xl">❌</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards - Admin only */}
        {isAdmin && stats && (
          <>
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
                              width: `${(count / (stats?.totalEmployees || 1)) * 100}%`
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
                <button 
                  onClick={() => navigate('/employees/add')} 
                  className="bg-primary-500 hover:bg-primary-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Add New Employee
                </button>
                <button 
                  onClick={() => navigate('/employees/')} 
                  className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  View All Employees
                </button>
                <button 
                  onClick={() => navigate('/attendance/list')} 
                  className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  View Attendance Report
                </button>
              </div>
            </div>
          </>
        )}

        {/* Employee-only view */}
        {!isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Quick Action</p>
                  <p className="text-lg font-semibold mt-1">Check In/Out</p>
                  <button 
                    onClick={() => navigate('/attendance/my-attendance')}
                    className="mt-3 bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Go to Attendance
                  </button>
                </div>
                <span className="text-4xl">📅</span>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Quick Action</p>
                  <p className="text-lg font-semibold mt-1">Apply for Leave</p>
                  <button 
                    onClick={() => navigate('/leave/apply')}
                    className="mt-3 bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
                <span className="text-4xl">🏖️</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;