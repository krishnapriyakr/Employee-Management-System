import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getPerformanceStats, getPendingReviews, getAllReviews,type PerformanceReview } from '../../../api/performanceApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AdminPerformanceDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [pendingReviews, setPendingReviews] = useState<PerformanceReview[]>([]);
  const [recentReviews, setRecentReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, allRes] = await Promise.all([
        getPerformanceStats(),
        getPendingReviews(),
        getAllReviews({})
      ]);
      
      if (statsRes.success) setStats(statsRes.data);
      if (pendingRes.success) setPendingReviews(pendingRes.data);
      if (allRes.success) setRecentReviews(allRes.data.slice(0, 5));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Performance Dashboard</h1>
              <p className="text-gray-600 mt-1">Overview of employee performance and reviews</p>
            </div>
            <button
              onClick={() => navigate('/performance/reviews/create')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              + Create Review
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-800">{stats?.total || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Pending Self</p>
            <p className="text-2xl font-bold text-yellow-600">{stats?.pendingSelf || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-500">Pending Manager</p>
            <p className="text-2xl font-bold text-orange-600">{stats?.pendingManager || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Avg Rating</p>
            <p className={`text-2xl font-bold ${getRatingColor(stats?.averageRating || 0)}`}>
              {stats?.averageRating || 0} / 5
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Manager Recommendations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats?.recommendations?.promote || 0}</p>
              <p className="text-sm text-gray-600">Promote</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{stats?.recommendations?.retain || 0}</p>
              <p className="text-sm text-gray-600">Retain</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{stats?.recommendations?.improvement || 0}</p>
              <p className="text-sm text-gray-600">Needs Improvement</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">{stats?.recommendations?.terminate || 0}</p>
              <p className="text-sm text-gray-600">Terminate</p>
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        {pendingReviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pending Manager Reviews</h2>
            <div className="space-y-3">
              {pendingReviews.map((review) => (
                <div key={review._id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{review.employeeId?.name}</p>
                    <p className="text-sm text-gray-500">
                      {review.reviewCycle === 'quarterly' ? `Q${review.quarter} ${review.year}` : `${review.reviewCycle} ${review.year}`}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/performance/reviews/${review._id}/manager`)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Review Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Reviews */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Recent Reviews</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cycle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Self Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Manager Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{review.employeeId?.name}</div>
                      <div className="text-xs text-gray-500">{review.employeeId?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {review.reviewCycle === 'quarterly' ? `Q${review.quarter} ${review.year}` : `${review.reviewCycle} ${review.year}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {review.selfRating ? `${review.selfRating}/5` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {review.managerRating ? `${review.managerRating}/5` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-semibold ${getRatingColor(review.finalRating || 0)}`}>
                        {review.finalRating ? `${review.finalRating}/5` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {review.status === 'pending_self' && <span className="text-yellow-600">Pending Self</span>}
                      {review.status === 'pending_manager' && <span className="text-orange-600">Pending Manager</span>}
                      {review.status === 'completed' && <span className="text-green-600">Completed</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/performance/reviews/${review._id}`)}
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPerformanceDashboard;