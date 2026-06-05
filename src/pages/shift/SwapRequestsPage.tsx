import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { getMySwapRequests, respondToSwap, requestSwap, getMyShifts,type ShiftAssignment, formatTime } from '../../api/shiftApi';
import { fetchAllEmployees,type Employee } from '../../api/employeeApi';
import { toast } from 'react-toastify';
import { FaExchangeAlt, FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaPaperPlane } from 'react-icons/fa';

const SwapRequestsPage: React.FC = () => {
  const [swapRequests, setSwapRequests] = useState<any[]>([]);
  const [myShifts, setMyShifts] = useState<ShiftAssignment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    assignmentId: '',
    toEmployeeId: '',
    message: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [swapsRes, shiftsRes, employeesRes] = await Promise.all([
        getMySwapRequests(),
        getMyShifts(),
        fetchAllEmployees(1, 100, '', '')
      ]);
      
      if (swapsRes.success) setSwapRequests(swapsRes.data);
      if (shiftsRes.success) setMyShifts(shiftsRes.data);
      if (employeesRes.success) setEmployees(employeesRes.data.employees);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id: string, status: string) => {
    try {
      await respondToSwap(id, status);
      toast.success(`Swap request ${status}`);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRequestSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assignmentId || !formData.toEmployeeId || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await requestSwap(formData);
      toast.success('Swap request sent successfully');
      setShowRequestForm(false);
      setFormData({ assignmentId: '', toEmployeeId: '', message: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
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

  // Separate requests: incoming (to me) and outgoing (from me)
  const incomingRequests = swapRequests.filter(req => 
    req.toEmployeeId?._id === req.toEmployeeId?._id && req.status === 'pending'
  );
  const outgoingRequests = swapRequests.filter(req => 
    req.fromEmployeeId?._id === req.fromEmployeeId?._id
  );

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Shift Swap Requests</h1>
              <p className="text-gray-600 mt-1">Request to swap shifts with colleagues</p>
            </div>
            <button
              onClick={() => setShowRequestForm(!showRequestForm)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <FaExchangeAlt className="h-4 w-4" />
              Request Swap
            </button>
          </div>
        </div>

        {/* Request Form */}
        {showRequestForm && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Request Shift Swap</h2>
            <form onSubmit={handleRequestSwap} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Your Shift *</label>
                <select
                  value={formData.assignmentId}
                  onChange={(e) => setFormData({ ...formData, assignmentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a shift...</option>
                  {myShifts.filter(s => s.status === 'scheduled').map(shift => (
                    <option key={shift._id} value={shift._id}>
                      {formatDate(shift.date)} - {shift.shiftId?.title} ({formatTime(shift.shiftId?.startTime)} - {formatTime(shift.shiftId?.endTime)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Colleague *</label>
                <select
                  value={formData.toEmployeeId}
                  onChange={(e) => setFormData({ ...formData, toEmployeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select a colleague...</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.personalInfo.firstName} {emp.personalInfo.lastName} - {emp.employmentInfo.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  placeholder="Why do you want to swap this shift?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FaPaperPlane className="h-4 w-4" />
                  Send Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Incoming Requests */}
        {incomingRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-yellow-50 border-b">
              <h2 className="text-lg font-semibold text-yellow-800">Incoming Requests ({incomingRequests.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {incomingRequests.map((req) => (
                <div key={req._id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUser className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{req.fromEmployeeId?.name}</span>
                        <span className="text-sm text-gray-500">wants to swap with you</span>
                      </div>
                      <p className="text-gray-600 mb-2">{req.message}</p>
                      <div className="text-sm text-gray-500">
                        Shift: {req.assignmentId?.shiftId?.title} on {formatDate(req.assignmentId?.date)}
                        ({formatTime(req.assignmentId?.shiftId?.startTime)} - {formatTime(req.assignmentId?.shiftId?.endTime)})
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handleRespond(req._id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                      >
                        <FaCheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRespond(req._id, 'rejected')}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                      >
                        <FaTimesCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Outgoing Requests */}
        {outgoingRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b">
              <h2 className="text-lg font-semibold text-blue-800">My Requests ({outgoingRequests.length})</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {outgoingRequests.map((req) => (
                <div key={req._id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUser className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">To: {req.toEmployeeId?.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(req.status)}`}>
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{req.message}</p>
                      <div className="text-sm text-gray-500">
                        Shift: {req.assignmentId?.shiftId?.title} on {formatDate(req.assignmentId?.date)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Requests */}
        {swapRequests.length === 0 && !showRequestForm && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaExchangeAlt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No swap requests</p>
            <p className="text-sm text-gray-400 mt-1">Request a shift swap using the button above</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SwapRequestsPage;