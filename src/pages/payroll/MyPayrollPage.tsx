import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { getMyPayroll, formatCurrency, getMonthName, type Payroll } from '../../api/payrollApi';
import { toast } from 'react-toastify';
import { FaRupeeSign, FaCalendarAlt, FaDownload, FaChartLine } from 'react-icons/fa';

const MyPayrollPage: React.FC = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchPayrolls();
  }, [selectedYear]);

  const fetchPayrolls = async () => {
    try {
      setLoading(true);
      const response = await getMyPayroll(undefined, selectedYear);
      if (response.success) {
        setPayrolls(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      processed: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const years = [2023, 2024, 2025, 2026];

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
          <h1 className="text-2xl font-bold text-gray-800">My Payroll</h1>
          <p className="text-gray-600 mt-1">View your salary details and payment history</p>
        </div>

        {/* Year Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Select Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Payroll List */}
        {payrolls.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaRupeeSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No payroll records found for {selectedYear}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payrolls.map((payroll) => (
              <div key={payroll._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {getMonthName(payroll.month)} {payroll.year}
                      </h2>
                         <p className="text-sm text-gray-500">Processed on: {payroll?.processedAt ? new Date(payroll.processedAt).toLocaleDateString() : '-'}</p>
                     </div>
                    <div className="flex items-center gap-3 mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(payroll.status)}`}>
                        {payroll.status.toUpperCase()}
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(payroll.netSalary)}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Working Days</p>
                      <p className="text-lg font-semibold">{payroll.attendanceDays}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Present</p>
                      <p className="text-lg font-semibold text-green-600">{payroll.presentDays}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Absent</p>
                      <p className="text-lg font-semibold text-red-600">{payroll.absentDays}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Leave Taken</p>
                      <p className="text-lg font-semibold text-orange-600">{payroll.leaveDays}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Overtime (hrs)</p>
                      <p className="text-lg font-semibold text-blue-600">{payroll.overtimeHours}</p>
                    </div>
                  </div>

                  {/* Earnings & Deductions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaChartLine className="h-4 w-4 text-green-500" />
                        Earnings
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>Basic Salary</span><span>{formatCurrency(payroll.grossEarnings.basicSalary)}</span></div>
                        <div className="flex justify-between"><span>HRA</span><span>{formatCurrency(payroll.grossEarnings.hra)}</span></div>
                        <div className="flex justify-between"><span>DA</span><span>{formatCurrency(payroll.grossEarnings.da)}</span></div>
                        <div className="flex justify-between"><span>CA</span><span>{formatCurrency(payroll.grossEarnings.ca)}</span></div>
                        <div className="flex justify-between"><span>Special Allowance</span><span>{formatCurrency(payroll.grossEarnings.specialAllowance)}</span></div>
                        <div className="flex justify-between"><span>Bonus</span><span>{formatCurrency(payroll.grossEarnings.bonus)}</span></div>
                        <div className="flex justify-between"><span>Overtime Amount</span><span>{formatCurrency(payroll.grossEarnings.overtimeAmount)}</span></div>
                        <div className="flex justify-between"><span>Attendance Bonus</span><span>{formatCurrency(payroll.grossEarnings.attendanceBonus)}</span></div>
                        <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                          <span>Total Earnings</span>
                          <span>{formatCurrency(Object.values(payroll.grossEarnings).reduce((a, b) => a + b, 0))}</span>
                        </div>
                      </div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaChartLine className="h-4 w-4 text-red-500" />
                        Deductions
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>PF</span><span>{formatCurrency(payroll.deductions.pf)}</span></div>
                        <div className="flex justify-between"><span>Professional Tax</span><span>{formatCurrency(payroll.deductions.professionalTax)}</span></div>
                        <div className="flex justify-between"><span>TDS</span><span>{formatCurrency(payroll.deductions.tds)}</span></div>
                        <div className="flex justify-between"><span>Leave Deductions</span><span>{formatCurrency(payroll.deductions.leaveDeductions)}</span></div>
                        <div className="flex justify-between"><span>Other Deductions</span><span>{formatCurrency(payroll.deductions.otherDeductions)}</span></div>
                        <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                          <span>Total Deductions</span>
                          <span>{formatCurrency(Object.values(payroll.deductions).reduce((a, b) => a + b, 0))}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {payroll.paymentDate && (
                    <div className="mt-4 text-sm text-gray-500 border-t pt-3">
                      <p>💳 Payment Date: {new Date(payroll.paymentDate).toLocaleDateString()}</p>
                      {payroll.transactionId && <p>📝 Transaction ID: {payroll.transactionId}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyPayrollPage;