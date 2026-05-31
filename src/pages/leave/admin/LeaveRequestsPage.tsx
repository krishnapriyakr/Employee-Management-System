import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getAllLeaveRequests, approveLeave, rejectLeave, type LeaveRequest } from '../../../api/leaveApi';
import { toast } from 'react-toastify';

const LeaveRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      
      const response = await getAllLeaveRequests(filters);
      if (response.success) {
        setRequests(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch leave requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!window.confirm('Are you sure you want to approve this leave request?')) return;
    
    try {
      const response = await approveLeave(id);
      if (response.success) {
        toast.success('Leave request approved successfully');
        fetchRequests();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve request');
    }
  };

  const handleReject = async () => {
    if (!rejectComment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await rejectLeave(selectedRequest!._id, rejectComment);
      if (response.success) {
        toast.success('Leave request rejected');
        setShowRejectModal(false);
        setRejectComment('');
        setSelectedRequest(null);
        fetchRequests();
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject request');
    }
  };

  const openRejectModal = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };
    const c = config[status as keyof typeof config];
    return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${c.color}`}>{c.label}</span>;
  };

  const getTypeBadge = (type: string) => {
    const config = {
      sick: { color: 'bg-blue-100 text-blue-800', label: 'Sick' },
      casual: { color: 'bg-purple-100 text-purple-800', label: 'Casual' },
      annual: { color: 'bg-indigo-100 text-indigo-800', label: 'Annual' },
      unpaid: { color: 'bg-gray-100 text-gray-800', label: 'Unpaid' }
    };
    const c = config[type as keyof typeof config];
    return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${c.color}`}>{c.label}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <h1 className="text-2xl font-bold text-gray-800">Leave Requests Management</h1>
          <p className="text-gray-600 mt-1">Review and manage employee leave requests</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex space-x-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors duration-200 ${
                  statusFilter === status
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No leave requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.employeeId?.name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">{request.employeeId?.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(request.type)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                        {getDays(request.startDate, request.endDate)} days
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{request.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(request._id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openRejectModal(request)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Reject Leave Request</h2>
            <p className="text-gray-600 mb-4">
              Rejecting leave for <span className="font-semibold">{selectedRequest?.employeeId?.name}</span>
            </p>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
              rows={4}
            />
            <div className="flex space-x-3">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectComment('');
                  setSelectedRequest(null);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default LeaveRequestsPage;