import React, { useState, useEffect } from 'react';
import { getAttendanceStats } from '../../api/attendanceApi';
import { useAuth } from '../../context/AuthContext';

const AdminAttendanceStats: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      const interval = setInterval(fetchStats, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchStats = async () => {
    try {
      const response = await getAttendanceStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch attendance stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show for admin
  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Employees</p>
            <p className="text-2xl font-bold text-gray-800">{stats?.total || 0}</p>
          </div>
          <span className="text-2xl">👥</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Present Today</p>
            <p className="text-2xl font-bold text-green-600">{stats?.present || 0}</p>
          </div>
          <span className="text-2xl">✅</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Late Arrivals</p>
            <p className="text-2xl font-bold text-yellow-600">{stats?.late || 0}</p>
          </div>
          <span className="text-2xl">⚠️</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Absent Today</p>
            <p className="text-2xl font-bold text-red-600">{stats?.absent || 0}</p>
          </div>
          <span className="text-2xl">❌</span>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendanceStats;