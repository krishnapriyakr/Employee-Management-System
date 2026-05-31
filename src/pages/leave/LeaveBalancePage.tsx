import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { getMyLeaveBalance, type LeaveBalance } from '../../api/leaveApi';
import { toast } from 'react-toastify';

const LeaveBalancePage: React.FC = () => {
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      const response = await getMyLeaveBalance();
      if (response.success) {
        setBalance(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch leave balance');
    } finally {
      setIsLoading(false);
    }
  };

  const getYearProgress = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    const progress = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100;
    return Math.round(progress);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <h1 className="text-2xl font-bold text-gray-800">Leave Balance</h1>
          <p className="text-gray-600 mt-1">Track your leave entitlement for {new Date().getFullYear()}</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : balance ? (
          <>
            {/* Year Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Year Progress</span>
                <span>{getYearProgress()}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getYearProgress()}%` }}
                />
              </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Annual Leave</p>
                    <p className="text-3xl font-bold mt-2">{balance.annual} days</p>
                  </div>
                  <div className="text-4xl">🏖️</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Sick Leave</p>
                    <p className="text-3xl font-bold mt-2">{balance.sick} days</p>
                  </div>
                  <div className="text-4xl">🤒</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Casual Leave</p>
                    <p className="text-3xl font-bold mt-2">{balance.casual} days</p>
                  </div>
                  <div className="text-4xl">🎉</div>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">📋 Annual Leave Policy</h3>
                <p className="text-sm text-yellow-700">
                  All employees are entitled to 12 days of annual leave per year.
                  Unused leave is carried forward to the next year.
                </p>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Pro Tips</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Apply for leave at least 3 days in advance</li>
                  <li>• Sick leave requires doctor's note for 3+ days</li>
                  <li>• Check your balance before applying</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">Unable to load leave balance</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeaveBalancePage;