import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import { getMyReviews, submitManagerAssessment,type PerformanceReview } from '../../../api/performanceApi';
import { toast } from 'react-toastify';

const ManagerAssessmentPage: React.FC = () => {
  const { id } = useParams();
  const [review, setReview] = useState<PerformanceReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    managerRating: 3,
    managerFeedback: '',
    managerStrengths: '',
    managerWeaknesses: '',
    managerRecommendation: 'retain'
  });

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const response = await getMyReviews(); // Get all and filter
      if (response.success) {
        const found = response.data.find((r: PerformanceReview) => r._id === id);
        setReview(found);
      }
    } catch (error: any) {
      toast.error(error.message);
      navigate('/performance/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.managerFeedback || !formData.managerStrengths || !formData.managerWeaknesses) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setSubmitting(true);
    try {
      await submitManagerAssessment(id!, formData);
      toast.success('Manager assessment submitted successfully');
      navigate('/performance/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
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

  if (!review) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Review not found</p>
        </div>
      </Layout>
    );
  }

  const getCycleLabel = () => {
    if (review.reviewCycle === 'quarterly') {
      return `Q${review.quarter} ${review.year}`;
    }
    return `${review.reviewCycle} ${review.year}`;
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
            <h1 className="text-2xl font-bold text-gray-800">Manager Assessment</h1>
            <p className="text-gray-600 mt-1">
              Reviewing {review.employeeId?.name} - {getCycleLabel()}
            </p>
          </div>

          {/* Self Assessment Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Employee Self Assessment</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Self Rating</p>
                <p className="text-lg font-semibold">{'⭐'.repeat(review.selfRating || 0)} ({review.selfRating}/5)</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Strengths</p>
                <p className="text-gray-700">{review.selfStrengths}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Areas for Improvement</p>
                <p className="text-gray-700">{review.selfWeaknesses}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Achievements</p>
                <p className="text-gray-700">{review.selfAchievements}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Future Goals</p>
                <p className="text-gray-700">{review.selfGoals}</p>
              </div>
            </div>
          </div>

          {/* Manager Assessment Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Manager Assessment</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Rating (1-5) *
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, managerRating: rating })}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        formData.managerRating === rating
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
                  Overall Feedback *
                </label>
                <textarea
                  value={formData.managerFeedback}
                  onChange={(e) => setFormData({ ...formData, managerFeedback: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Provide detailed feedback on employee's performance..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Strengths *
                </label>
                <textarea
                  value={formData.managerStrengths}
                  onChange={(e) => setFormData({ ...formData, managerStrengths: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="What does the employee excel at?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas for Improvement *
                </label>
                <textarea
                  value={formData.managerWeaknesses}
                  onChange={(e) => setFormData({ ...formData, managerWeaknesses: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="What areas need development?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendation *
                </label>
                <select
                  value={formData.managerRecommendation}
                  onChange={(e) => setFormData({ ...formData, managerRecommendation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="promote">Promote</option>
                  <option value="retain">Retain in current role</option>
                  <option value="improvement">Needs Improvement Plan</option>
                  <option value="terminate">Terminate</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/performance/admin/dashboard')}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ManagerAssessmentPage;