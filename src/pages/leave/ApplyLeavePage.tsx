import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { applyForLeave, getMyLeaveBalance, type LeaveBalance } from '../../api/leaveApi';

const ApplyLeavePage: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [formData, setFormData] = useState({
    type: 'annual',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setLoadingBalance(true);
      const response = await getMyLeaveBalance();
      if (response.success) {
        setBalance(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch leave balance');
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const days = calculateDays();
    
    if (days <= 0) {
      toast.error('Invalid date range');
      return;
    }

    if (formData.type !== 'unpaid') {
      const availableDays = balance?.[formData.type as keyof LeaveBalance] as number || 0;
      if (days > availableDays) {
        toast.error(`Insufficient ${formData.type} leave balance. Available: ${availableDays} days`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await applyForLeave(formData);
      if (response.success) {
        toast.success('Leave request submitted successfully!');
        navigate('/leave/my-leaves');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBalanceInfo = () => {
    if (formData.type === 'unpaid') return null;
    const available = balance?.[formData.type as keyof LeaveBalance] as number || 0;
    const days = calculateDays();
    const remaining = available - days;
    
    return (
      <div className="mt-2 text-sm">
        <span className="text-gray-600">Available balance: </span>
        <span className="font-semibold text-indigo-600">{available} days</span>
        {days > 0 && (
          <>
            <span className="text-gray-600 ml-2">→ After this request: </span>
            <span className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {remaining} days
            </span>
          </>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
            <h1 className="text-2xl font-bold text-gray-800">Apply for Leave</h1>
            <p className="text-gray-600 mt-1">Submit a new leave request</p>
          </div>

          {/* Leave Balance Cards */}
          {!loadingBalance && balance && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-sm text-blue-600 font-medium">Annual Leave</div>
                <div className="text-2xl font-bold text-blue-700">{balance.annual} days</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-sm text-green-600 font-medium">Sick Leave</div>
                <div className="text-2xl font-bold text-green-700">{balance.sick} days</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="text-sm text-purple-600 font-medium">Casual Leave</div>
                <div className="text-2xl font-bold text-purple-700">{balance.casual} days</div>
              </div>
            </div>
          )}

          {/* Application Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
                {getBalanceInfo()}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              {formData.startDate && formData.endDate && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-600">Total days: </span>
                  <span className="font-semibold text-primary-600">{calculateDays()} day(s)</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leave *
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/leave/my-leaves')}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
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

export default ApplyLeavePage;