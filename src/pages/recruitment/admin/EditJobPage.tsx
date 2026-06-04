import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getAllJobs, updateJob,type Job } from '../../../api/recruitmentApi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';

const EditJobPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employmentType: 'full-time',
    experience: '',
    salaryRange: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    benefits: [''],
    status: 'open',
    lastDate: ''
  });

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await getAllJobs();
      if (response.success) {
        const job = response.data.find((j: Job) => j._id === id);
        if (job) {
          setFormData({
            title: job.title,
            department: job.department,
            location: job.location,
            employmentType: job.employmentType,
            experience: job.experience,
            salaryRange: job.salaryRange,
            description: job.description,
            requirements: job.requirements?.length ? job.requirements : [''],
            responsibilities: job.responsibilities?.length ? job.responsibilities : [''],
            benefits: job.benefits?.length ? job.benefits : [''],
            status: job.status,
            lastDate: job.lastDate ? job.lastDate.split('T')[0] : ''
          });
        }
      }
    } catch (error: any) {
      toast.error(error.message);
      navigate('/recruitment/admin/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleArrayChange = (index: number, field: string, value: string) => {
    const newArray = [...(formData[field as keyof typeof formData] as string[])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: string) => {
    setFormData({
      ...formData,
      [field]: [...(formData[field as keyof typeof formData] as string[]), '']
    });
  };

  const removeArrayField = (index: number, field: string) => {
    const newArray = [...(formData[field as keyof typeof formData] as string[])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredData = {
      ...formData,
      requirements: formData.requirements.filter(r => r.trim()),
      responsibilities: formData.responsibilities.filter(r => r.trim()),
      benefits: formData.benefits.filter(b => b.trim())
    };
    
    setSubmitting(true);
    try {
      await updateJob(id!, filteredData);
      toast.success('Job updated successfully');
      navigate('/recruitment/admin/jobs');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const employmentTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
    { value: 'on-hold', label: 'On Hold' }
  ];

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
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
            <h1 className="text-2xl font-bold text-gray-800">Edit Job</h1>
            <p className="text-gray-600 mt-1">Update job posting details</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    {employmentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required *</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 2-4 years"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range *</label>
                  <input
                    type="text"
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    required
                    placeholder="e.g., ₹5L - ₹8L PA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Date to Apply *</label>
                  <input
                    type="date"
                    name="lastDate"
                    value={formData.lastDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                {formData.requirements.map((req, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayChange(idx, 'requirements', e.target.value)}
                      placeholder={`Requirement ${idx + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(idx, 'requirements')}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('requirements')}
                  className="text-primary-500 hover:text-primary-700 text-sm flex items-center gap-1 mt-2"
                >
                  <FaPlus className="h-4 w-4" /> Add Requirement
                </button>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                {formData.responsibilities.map((resp, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => handleArrayChange(idx, 'responsibilities', e.target.value)}
                      placeholder={`Responsibility ${idx + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(idx, 'responsibilities')}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('responsibilities')}
                  className="text-primary-500 hover:text-primary-700 text-sm flex items-center gap-1 mt-2"
                >
                  <FaPlus className="h-4 w-4" /> Add Responsibility
                </button>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                {formData.benefits.map((ben, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={ben}
                      onChange={(e) => handleArrayChange(idx, 'benefits', e.target.value)}
                      placeholder={`Benefit ${idx + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(idx, 'benefits')}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField('benefits')}
                  className="text-primary-500 hover:text-primary-700 text-sm flex items-center gap-1 mt-2"
                >
                  <FaPlus className="h-4 w-4" /> Add Benefit
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/recruitment/admin/jobs')}
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

export default EditJobPage;