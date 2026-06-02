import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { createReview, getAllGoals } from '../../../api/performanceApi';
import { fetchAllEmployees, type Employee } from '../../../api/employeeApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateReviewPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    employeeId: '',
    reviewCycle: 'quarterly',
    quarter: 1,
    year: new Date().getFullYear()
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetchAllEmployees(1, 100, '', '');
      if (response.success) {
        setEmployees(response.data.employees);
      }
    } catch (error: any) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId) {
      toast.error('Please select an employee');
      return;
    }
    
    setSubmitting(true);
    try {
      await createReview(formData);
      toast.success('Performance review created successfully');
      navigate('/performance/admin/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
            <h1 className="text-2xl font-bold text-gray-800">Create Performance Review</h1>
            <p className="text-gray-600 mt-1">Initiate a new performance review cycle for an employee</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Employee *
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                  disabled={loading}
                >
                  <option value="">Select an employee...</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.personalInfo.firstName} {emp.personalInfo.lastName} - {emp.employmentInfo.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Cycle *
                </label>
                <select
                  value={formData.reviewCycle}
                  onChange={(e) => setFormData({ ...formData, reviewCycle: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="quarterly">Quarterly Review</option>
                  <option value="annual">Annual Review</option>
                  <option value="probation">Probation Review</option>
                </select>
              </div>

              {formData.reviewCycle === 'quarterly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quarter *
                  </label>
                  <select
                    value={formData.quarter}
                    onChange={(e) => setFormData({ ...formData, quarter: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value={1}>Q1 (Jan - Mar)</option>
                    <option value={2}>Q2 (Apr - Jun)</option>
                    <option value={3}>Q3 (Jul - Sep)</option>
                    <option value={4}>Q4 (Oct - Dec)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  min={2020}
                  max={2030}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Review'}
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

export default CreateReviewPage;