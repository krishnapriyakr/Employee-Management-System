import React, { useState, useEffect } from 'react';
import { getAttendanceStats } from '../../api/attendanceApi';

interface StatsData {
  total: number;
  present: number;
  late: number;
  absent: number;
}

const AttendanceStats: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await getAttendanceStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const items = [
    { label: 'Total Employees', value: stats?.total || 0, color: 'blue', icon: '👥' },
    { label: 'Present', value: stats?.present || 0, color: 'green', icon: '✅' },
    { label: 'Late', value: stats?.late || 0, color: 'yellow', icon: '⚠️' },
    { label: 'Absent', value: stats?.absent || 0, color: 'red', icon: '❌' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className={`bg-white rounded-xl shadow-sm p-4 border-l-4 border-${item.color}-500`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
            </div>
            <span className="text-2xl">{item.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceStats;