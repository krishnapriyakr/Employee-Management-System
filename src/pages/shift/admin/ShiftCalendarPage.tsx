import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getAllAssignments, getShiftStats,type ShiftAssignment, formatTime } from '../../../api/shiftApi';
import { fetchAllEmployees, type Employee } from '../../../api/employeeApi';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaClock, FaUser, FaBriefcase } from 'react-icons/fa';

const ShiftCalendarPage: React.FC = () => {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignRes, statsRes] = await Promise.all([
        getAllAssignments(selectedDate, selectedDate),
        getShiftStats(selectedDate)
      ]);
      
      if (assignRes.success) setAssignments(assignRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-800">Shift Calendar</h1>
          <p className="text-gray-600 mt-1">View daily shift assignments</p>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Today
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-600">Total Shifts</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
            </div>
          </div>
        )}

        {/* Shift List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              Shifts for {formatDate(selectedDate)}
            </h2>
          </div>
          
          {assignments.length === 0 ? (
            <div className="p-12 text-center">
              <FaCalendarAlt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No shifts scheduled for this date</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {assignments.map((assignment) => (
                <div key={assignment._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: assignment.shiftId?.color || '#3b82f6' }}
                        />
                        <h3 className="text-lg font-semibold text-gray-800">{assignment.shiftId?.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          assignment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {assignment.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaUser className="h-4 w-4" />
                          {assignment.employeeId?.name} ({assignment.employeeId?.email})
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock className="h-4 w-4" />
                          {formatTime(assignment.shiftId?.startTime)} - {formatTime(assignment.shiftId?.endTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaBriefcase className="h-4 w-4" />
                          Duration: {assignment.shiftId?.duration} hours
                        </span>
                      </div>
                      {assignment.overtimeHours > 0 && (
                        <p className="text-sm text-orange-600 mt-2">Overtime: {assignment.overtimeHours} hours</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShiftCalendarPage;