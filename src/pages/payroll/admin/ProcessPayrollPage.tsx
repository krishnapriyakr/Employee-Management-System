import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { processPayroll, processAllPayroll, getAllPayrolls, updatePayrollStatus, getPayrollStats, formatCurrency, getMonthName, type Payroll } from '../../../api/payrollApi';
import { fetchAllEmployees,type Employee } from '../../../api/employeeApi';
import { toast } from 'react-toastify';
import { FaCalculator, FaUsers, FaCheckCircle, FaMoneyBillWave, FaRupeeSign } from 'react-icons/fa';

const ProcessPayrollPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [employeesRes, payrollsRes, statsRes] = await Promise.all([
        fetchAllEmployees(1, 100, '', ''),
        getAllPayrolls({ month: selectedMonth, year: selectedYear }),
        getPayrollStats()
      ]);
      
      if (employeesRes.success) setEmployees(employeesRes.data.employees);
      if (payrollsRes.success) setPayrolls(payrollsRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessSingle = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    setProcessing(true);
    try {
      await processPayroll(selectedEmployee, selectedMonth, selectedYear);
      toast.success('Payroll processed successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleProcessAll = async () => {
    if (!window.confirm(`Process payroll for all employees for ${getMonthName(selectedMonth)} ${selectedYear}?`)) return;
    
    setProcessing(true);
    try {
      await processAllPayroll(selectedMonth, selectedYear);
      toast.success('Payroll processed for all employees');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await updatePayrollStatus(id, 'paid', 'bank', `TRX${Date.now()}`);
      toast.success('Payroll marked as paid');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
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

  const totalPayrollAmount = payrolls.reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <h1 className="text-2xl font-bold text-gray-800">Process Payroll</h1>
          <p className="text-gray-600 mt-1">Calculate and manage employee salaries</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-600">Total Processed</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalProcessed}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-700">{stats.totalPaid}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-600">Total Amount Disbursed</p>
              <p className="text-2xl font-bold text-purple-700">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        )}

        {/* Month/Year Selector */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                {months.map(month => (
                  <option key={month} value={month}>{getMonthName(month)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
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
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Single Employee (Optional)</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.personalInfo.firstName} {emp.personalInfo.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleProcessSingle}
            disabled={processing || !selectedEmployee}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaCalculator className="h-4 w-4" />
            Process Selected Employee
          </button>
          <button
            onClick={handleProcessAll}
            disabled={processing}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaUsers className="h-4 w-4" />
            Process All Employees
          </button>
        </div>

        {/* Payroll Summary */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-indigo-100">Total Payroll for {getMonthName(selectedMonth)} {selectedYear}</p>
              <p className="text-3xl font-bold">{formatCurrency(totalPayrollAmount)}</p>
            </div>
            <FaMoneyBillWave className="h-12 w-12 text-indigo-200" />
          </div>
          <p className="text-indigo-100 text-sm mt-2">{payrolls.length} employees processed</p>
        </div>

        {/* Payroll List */}
        {payrolls.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaRupeeSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No payroll records found for this period</p>
            <p className="text-sm text-gray-400 mt-1">Click "Process All Employees" to generate payroll</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Basic Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrolls.map((payroll) => (
                    <tr key={payroll._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{payroll.employeeId?.name}</div>
                        <div className="text-xs text-gray-500">{payroll.employeeId?.email}</div>
                       </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatCurrency(payroll.grossEarnings.basicSalary)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">{formatCurrency(payroll.netSalary)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payroll.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                          payroll.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {payroll.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payroll.status === 'processed' && (
                          <button
                            onClick={() => handleMarkAsPaid(payroll._id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium flex items-center gap-1"
                          >
                            <FaCheckCircle className="h-3 w-3" />
                            Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProcessPayrollPage;