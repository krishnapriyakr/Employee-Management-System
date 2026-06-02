import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { getMyReviews, submitSelfAssessment,type PerformanceReview } from '../../api/performanceApi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const MyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    selfRating: 3,
    selfStrengths: '',
    selfWeaknesses: '',
    selfAchievements: '',
    selfGoals: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getMyReviews();
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (review: PerformanceReview) => {
    setSelectedReview(review);
    setFormData({
      selfRating: 3,
      selfStrengths: '',
      selfWeaknesses: '',
      selfAchievements: '',
      selfGoals: ''
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.selfStrengths || !formData.selfWeaknesses || !formData.selfAchievements || !formData.selfGoals) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await submitSelfAssessment(selectedReview!._id, formData);
      toast.success('Self assessment submitted successfully');
      setShowModal(false);
      fetchReviews();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending_self: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Self Assessment' },
      pending_manager: { color: 'bg-blue-100 text-blue-800', label: 'Pending Manager Review' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' }
    };
    const c = config[status as keyof typeof config];
    return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${c.color}`}>{c.label}</span>;
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getCycleLabel = (review: PerformanceReview) => {
    if (review.reviewCycle === 'quarterly') {
      return `Q${review.quarter} ${review.year}`;
    }
    return `${review.reviewCycle} ${review.year}`;
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
          <h1 className="text-2xl font-bold text-gray-800">My Performance Reviews</h1>
          <p className="text-gray-600 mt-1">Track your performance evaluations and self-assessments</p>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">No performance reviews found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {getCycleLabel(review)} Review
                    </h3>
                    <p className="text-sm text-gray-500">
                      Reviewer: {review.reviewerId?.name}
                    </p>
                  </div>
                  {getStatusBadge(review.status)}
                </div>

                {review.status === 'pending_self' ? (
                  <button
                    onClick={() => handleOpenModal(review)}
                    className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    Complete Self Assessment
                  </button>
                ) : (
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Your Self Rating</p>
                      <p className="text-lg font-semibold">{getRatingStars(review.selfRating || 0)} ({review.selfRating}/5)</p>
                    </div>
                    {review.status === 'completed' && (
                      <div>
                        <p className="text-sm text-gray-500">Manager Rating</p>
                        <p className="text-lg font-semibold">{getRatingStars(review.managerRating || 0)} ({review.managerRating}/5)</p>
                        <p className="text-sm font-semibold text-primary-600 mt-2">
                          Final Rating: {review.finalRating}/5
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Self Assessment Modal */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Self Assessment</h2>
              <p className="text-sm text-gray-500 mb-4">
                {selectedReview.reviewCycle === 'quarterly' 
                  ? `Q${selectedReview.quarter} ${selectedReview.year}` 
                  : `${selectedReview.reviewCycle} ${selectedReview.year}`} Review
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Self Rating (1-5)
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFormData({ ...formData, selfRating: rating })}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          formData.selfRating === rating
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your key strengths?
                  </label>
                  <textarea
                    value={formData.selfStrengths}
                    onChange={(e) => setFormData({ ...formData, selfStrengths: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="List your strengths..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Areas for improvement
                  </label>
                  <textarea
                    value={formData.selfWeaknesses}
                    onChange={(e) => setFormData({ ...formData, selfWeaknesses: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="What areas need improvement?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key achievements this period
                  </label>
                  <textarea
                    value={formData.selfAchievements}
                    onChange={(e) => setFormData({ ...formData, selfAchievements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="List your achievements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goals for next period
                  </label>
                  <textarea
                    value={formData.selfGoals}
                    onChange={(e) => setFormData({ ...formData, selfGoals: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="What are your future goals?"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MyReviewsPage;