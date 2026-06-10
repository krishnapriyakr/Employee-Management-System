import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { exportPayrollExcel, exportPayrollPDF } from '../../api/exportApi';
import { toast } from 'react-toastify';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';

const PayrollReportPage: React.FC = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const years = [2023, 2024, 2025, 2026];

  const handleExportExcel = () => {
    exportPayrollExcel(month, year);
    toast.success('Download started...');
  };

  const handleExportPDF = () => {
    exportPayrollPDF(month, year);
    toast.success('Download started...');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <h1 className="text-2xl font-bold text-gray-800">Payroll Report</h1>
          <p className="text-gray-600 mt-1">Export payroll data to Excel or PDF</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                {months.map((m, idx) => (
                  <option key={idx} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleExportExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <FaFileExcel /> Export to Excel
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <FaFilePdf /> Export to PDF
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PayrollReportPage;