import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { exportLeaveExcel } from '../../api/exportApi';
import { toast } from 'react-toastify';
import { FaFileExcel } from 'react-icons/fa';

const LeaveReportPage: React.FC = () => {
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleExportExcel = () => {
    exportLeaveExcel(status || undefined, startDate || undefined, endDate || undefined);
    toast.success('Download started...');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <h1 className="text-2xl font-bold text-gray-800">Leave Report</h1>
          <p className="text-gray-600 mt-1">Export leave data to Excel</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <button
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <FaFileExcel /> Export to Excel
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default LeaveReportPage;