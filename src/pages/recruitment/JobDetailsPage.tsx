import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicJobById, type Job, applyForJob } from '../../api/recruitmentApi';
import { toast } from 'react-toastify';
import { 
  FaBriefcase, FaMapMarkerAlt, FaClock, FaDollarSign, FaBuilding, 
  FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaUpload, FaFileAlt,
  FaUser, FaEnvelope, FaPhone, FaLinkedin, FaGithub, FaGlobe
} from 'react-icons/fa';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentCompany: '',
    experience: '',
    currentSalary: '',
    expectedSalary: '',
    noticePeriod: '',
    coverLetter: '',
    portfolioUrl: '',
    linkedInUrl: '',
    githubUrl: ''
  });
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await getPublicJobById(id!);
      if (response.success) {
        setJob(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
      navigate('/careers');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resume) {
      toast.error('Please upload your resume');
      return;
    }

    setSubmitting(true);
    
    try {
      const submitData = new FormData();
      submitData.append('resume', resume);
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('experience', formData.experience);
      submitData.append('noticePeriod', formData.noticePeriod);
      if (formData.currentCompany) submitData.append('currentCompany', formData.currentCompany);
      if (formData.currentSalary) submitData.append('currentSalary', formData.currentSalary);
      if (formData.expectedSalary) submitData.append('expectedSalary', formData.expectedSalary);
      if (formData.coverLetter) submitData.append('coverLetter', formData.coverLetter);
      if (formData.portfolioUrl) submitData.append('portfolioUrl', formData.portfolioUrl);
      if (formData.linkedInUrl) submitData.append('linkedInUrl', formData.linkedInUrl);
      if (formData.githubUrl) submitData.append('githubUrl', formData.githubUrl);
      
      const response = await applyForJob(id!, submitData);
      if (response.success) {
        toast.success('Application submitted successfully!');
        navigate('/careers');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-orange-100 text-orange-800',
      'internship': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><FaBuilding className="h-3 w-3" /> {job.department}</span>
                <span className="flex items-center gap-1"><FaMapMarkerAlt className="h-3 w-3" /> {job.location}</span>
                <span className="flex items-center gap-1"><FaDollarSign className="h-3 w-3" /> {job.salaryRange}</span>
                <span className="flex items-center gap-1"><FaClock className="h-3 w-3" /> Experience: {job.experience}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(job.employmentType)}`}>
              {job.employmentType.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 pt-4 border-t">
            <span>📅 Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
            <span>⏰ Last Date: {new Date(job.lastDate).toLocaleDateString()}</span>
            <span>👁️ {job.views} views</span>
            <span>📝 {job.applications} applicants</span>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Description</h2>
          <p className="text-gray-600 mb-6">{job.description}</p>

          <h3 className="font-semibold text-gray-800 mb-2">Requirements:</h3>
          <ul className="list-disc list-inside space-y-1 mb-6">
            {job.requirements?.map((req, idx) => (
              <li key={idx} className="text-gray-600">{req}</li>
            ))}
          </ul>

          <h3 className="font-semibold text-gray-800 mb-2">Responsibilities:</h3>
          <ul className="list-disc list-inside space-y-1 mb-6">
            {job.responsibilities?.map((resp, idx) => (
              <li key={idx} className="text-gray-600">{resp}</li>
            ))}
          </ul>

          <h3 className="font-semibold text-gray-800 mb-2">Benefits:</h3>
          <ul className="list-disc list-inside space-y-1">
            {job.benefits?.map((benefit, idx) => (
              <li key={idx} className="text-gray-600">{benefit}</li>
            ))}
          </ul>
        </div>

        {/* Apply Button / Form */}
        {!showForm ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">Ready to join our team?</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Apply Now
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Application Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                  <input
                    type="text"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Experience *</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select experience</option>
                    <option value="Fresher">Fresher (0 years)</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-8 years">5-8 years</option>
                    <option value="8+ years">8+ years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Salary (LPA)</label>
                  <input
                    type="text"
                    name="currentSalary"
                    value={formData.currentSalary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Salary (LPA)</label>
                  <input
                    type="text"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period *</label>
                <select
                  name="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select notice period</option>
                  <option value="Immediate">Immediate</option>
                  <option value="15 days">15 days</option>
                  <option value="30 days">30 days</option>
                  <option value="45 days">45 days</option>
                  <option value="60 days">60 days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume/CV * (PDF, DOC, DOCX, Max 5MB)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                  <FaUpload className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Tell us why you're a great fit for this position..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedInUrl"
                    value={formData.linkedInUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPage;