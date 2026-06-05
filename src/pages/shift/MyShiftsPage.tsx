import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { getMyShifts, updateShiftStatus, formatTime, type ShiftAssignment } from '../../api/shiftApi';
// import { getMyDetails } from '../../api/authApi';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';

const MyShiftsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchShifts();
  }, [selectedMonth, selectedYear]);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await getMyShifts(selectedMonth, selectedYear);
      if (response.success) {
        setAssignments(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteShift = async (id: string) => {
    try {
      await updateShiftStatus(id, 'completed');
      toast.success('Shift marked as completed');
      fetchShifts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = [2024, 2025, 2026];

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      swap_requested: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
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
          <h1 className="text-2xl font-bold text-gray-800">My Shifts</h1>
          <p className="text-gray-600 mt-1">View your scheduled work shifts</p>
        </div>

        {/* Month/Year Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Shifts List */}
        {assignments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaCalendarAlt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No shifts scheduled for this month</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: assignment.shiftId?.color || '#3b82f6' }}
                      />
                      <h3 className="text-lg font-semibold text-gray-800">{assignment.shiftId?.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(assignment.status)}`}>
                        {assignment.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{formatDate(assignment.date)}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaClock className="h-4 w-4" />
                        {formatTime(assignment.shiftId?.startTime)} - {formatTime(assignment.shiftId?.endTime)}
                      </span>
                      <span>Duration: {assignment.shiftId?.duration} hours</span>
                      {assignment.overtimeHours > 0 && (
                        <span className="text-orange-600">Overtime: {assignment.overtimeHours} hrs</span>
                      )}
                    </div>
                    {assignment.notes && (
                      <p className="text-sm text-gray-500 mt-2">📝 {assignment.notes}</p>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0">
                    {assignment.status === 'scheduled' && (
                      <button
                        onClick={() => handleCompleteShift(assignment._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                      >
                        <FaCheckCircle className="h-4 w-4" />
                        Mark Complete
                      </button>
                    )}
                    {assignment.status === 'completed' && (
                      <span className="inline-flex items-center gap-2 text-green-600">
                        <FaCheckCircle className="h-5 w-5" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyShiftsPage;