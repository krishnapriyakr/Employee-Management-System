import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { getMyLeaves, type LeaveRequest } from '../../api/leaveApi';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const MyLeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      const response = await getMyLeaves();
      if (response.success) {
        setLeaves(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch leave requests');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      sick: { color: 'bg-blue-100 text-blue-800', label: 'Sick Leave' },
      casual: { color: 'bg-purple-100 text-purple-800', label: 'Casual Leave' },
      annual: { color: 'bg-indigo-100 text-indigo-800', label: 'Annual Leave' },
      unpaid: { color: 'bg-gray-100 text-gray-800', label: 'Unpaid Leave' }
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Leave Requests</h1>
              <p className="text-gray-600 mt-1">View and track your leave applications</p>
            </div>
            <Link
              to="/leave/apply"
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              + Apply for Leave
            </Link>
          </div>
        </div>

        {/* Leave Requests Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : leaves.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex flex-col items-center justify-center text-gray-500">
                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">No leave requests found</p>
                <p className="text-sm mt-1">You haven't applied for any leave yet</p>
                <Link
                  to="/leave/apply"
                  className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Apply for Leave
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaves.map((leave) => (
                    <tr key={leave._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(leave.type)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{leave.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(leave.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(leave.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {leave.comments || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyLeavesPage;