import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getLeaveStatistics, type LeaveStatistics } from '../../../api/leaveApi';
import { toast } from 'react-toastify';

const LeaveStatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<LeaveStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await getLeaveStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <h1 className="text-2xl font-bold text-gray-800">Leave Statistics</h1>
          <p className="text-gray-600 mt-1">Overview of all leave requests</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-blue-100 text-sm">Total Requests</p>
            <p className="text-3xl font-bold mt-2">{stats?.total || 0}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-yellow-100 text-sm">Pending</p>
            <p className="text-3xl font-bold mt-2">{stats?.pending || 0}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-green-100 text-sm">Approved</p>
            <p className="text-3xl font-bold mt-2">{stats?.approved || 0}</p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <p className="text-red-100 text-sm">Rejected</p>
            <p className="text-3xl font-bold mt-2">{stats?.rejected || 0}</p>
          </div>
        </div>

        {/* By Type */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Requests by Leave Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Sick Leave</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.byType?.sick || 0}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Casual Leave</p>
              <p className="text-2xl font-bold text-purple-600">{stats?.byType?.casual || 0}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Annual Leave</p>
              <p className="text-2xl font-bold text-indigo-600">{stats?.byType?.annual || 0}</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-sm text-gray-500">Unpaid Leave</p>
              <p className="text-2xl font-bold text-gray-600">{stats?.byType?.unpaid || 0}</p>
            </div>
          </div>
        </div>

        {/* Chart Visualization (simple progress bars) */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Request Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Approved</span>
                <span>{Math.round((stats?.approved || 0) / (stats?.total || 1) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(stats?.approved || 0) / (stats?.total || 1) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Pending</span>
                <span>{Math.round((stats?.pending || 0) / (stats?.total || 1) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(stats?.pending || 0) / (stats?.total || 1) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Rejected</span>
                <span>{Math.round((stats?.rejected || 0) / (stats?.total || 1) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${(stats?.rejected || 0) / (stats?.total || 1) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveStatisticsPage;