import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getShifts, assignShift,type Shift, getAllAssignments, formatTime } from '../../../api/shiftApi';
import { fetchAllEmployees,type Employee } from '../../../api/employeeApi';
import { toast } from 'react-toastify';
import { FaUserPlus, FaTrash, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';

const AssignShiftPage: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [formData, setFormData] = useState({
    employeeId: '',
    shiftId: '',
    date: new Date().toISOString().split('T')[0],
    overtimeHours: 0,
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shiftsRes, employeesRes, assignmentsRes] = await Promise.all([
        getShifts(),
        fetchAllEmployees(1, 100, '', ''),
        getAllAssignments(selectedDate, selectedDate)
      ]);
      
      if (shiftsRes.success) setShifts(shiftsRes.data);
      if (employeesRes.success) setEmployees(employeesRes.data.employees);
      if (assignmentsRes.success) setAssignments(assignmentsRes.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.shiftId) {
      toast.error('Please select employee and shift');
      return;
    }

    try {
      await assignShift({
        employeeId: formData.employeeId,
        shiftId: formData.shiftId,
        date: formData.date,
        overtimeHours: formData.overtimeHours,
        notes: formData.notes
      });
      toast.success('Shift assigned successfully');
      setFormData({
        employeeId: '',
        shiftId: '',
        date: selectedDate,
        overtimeHours: 0,
        notes: ''
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
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
          <h1 className="text-2xl font-bold text-gray-800">Assign Shifts</h1>
          <p className="text-gray-600 mt-1">Assign employees to specific shifts</p>
        </div>

        {/* Date Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assign Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUserPlus className="h-5 w-5 text-primary-500" />
              Assign New Shift
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee *</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select an employee...</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.personalInfo.firstName} {emp.personalInfo.lastName} - {emp.employmentInfo.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Shift *</label>
                <select
                  value={formData.shiftId}
                  onChange={(e) => setFormData({ ...formData, shiftId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a shift...</option>
                  {shifts.map(shift => (
                    <option key={shift._id} value={shift._id}>
                      {shift.title} ({formatTime(shift.startTime)} - {formatTime(shift.endTime)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.overtimeHours}
                  onChange={(e) => setFormData({ ...formData, overtimeHours: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Any additional notes..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <FaUserPlus className="h-4 w-4" />
                Assign Shift
              </button>
            </form>
          </div>

          {/* Today's Assignments List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaCalendarAlt className="h-5 w-5 text-primary-500" />
              Assigned Shifts for {formatDate(selectedDate)}
            </h2>
            
            {assignments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No shifts assigned for this date</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {assignments.map((assignment) => (
                  <div key={assignment._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: assignment.shiftId?.color || '#3b82f6' }}
                          />
                          <span className="font-medium text-gray-800">{assignment.shiftId?.title}</span>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FaUser className="h-3 w-3" />
                          {assignment.employeeId?.name}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <FaClock className="h-3 w-3" />
                          {formatTime(assignment.shiftId?.startTime)} - {formatTime(assignment.shiftId?.endTime)}
                        </p>
                        {assignment.overtimeHours > 0 && (
                          <p className="text-xs text-orange-600 mt-1">Overtime: {assignment.overtimeHours} hrs</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignShiftPage;