import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getAllApplications, getApplicationStats, updateApplicationStatus, downloadResume, Application } from '../../../api/recruitmentApi';
import { getAllJobs,type Job } from '../../../api/recruitmentApi';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaEye, FaDownload, FaCheckCircle, FaTimesCircle, FaClock, 
  FaUserCheck, FaUserTimes, FaFileAlt, FaBriefcase
} from 'react-icons/fa';

const AdminApplicationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(searchParams.get('jobId') || '');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedJob, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsRes, statsRes, jobsRes] = await Promise.all([
        getAllApplications({ jobId: selectedJob || undefined, status: statusFilter || undefined }),
        getApplicationStats(),
        getAllJobs()
      ]);
      
      if (appsRes.success) setApplications(appsRes.data);
      if (statsRes.success) setStats(statsRes.data);
      if (jobsRes.success) setJobs(jobsRes.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateApplicationStatus(id, status);
      toast.success(`Application ${status} successfully`);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDownloadResume = async (id: string) => {
    try {
      await downloadResume(id);
      toast.success('Download started');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-purple-100 text-purple-800',
      interviewed: 'bg-indigo-100 text-indigo-800',
      hired: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <h1 className="text-2xl font-bold text-gray-800">Job Applications</h1>
          <p className="text-gray-600 mt-1">Review and manage candidate applications</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-purple-600">Shortlisted</p>
              <p className="text-2xl font-bold text-purple-700">{stats.shortlisted}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-600">Hired</p>
              <p className="text-2xl font-bold text-green-700">{stats.hired}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Job</label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Jobs</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>{job.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaBriefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No applications found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.firstName} {app.lastName}</div>
                          <div className="text-xs text-gray-500">{app.email}</div>
                          <div className="text-xs text-gray-500">{app.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{app.jobId?.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{app.experience}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadResume(app._id)}
                            className="text-primary-600 hover:text-primary-800"
                            title="Download Resume"
                          >
                            <FaDownload className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
                            className="text-green-600 hover:text-green-800"
                            title="Shortlist"
                          >
                            <FaUserCheck className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                            title="Reject"
                          >
                            <FaUserTimes className="h-5 w-5" />
                          </button>
                        </div>
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

export default AdminApplicationsPage;