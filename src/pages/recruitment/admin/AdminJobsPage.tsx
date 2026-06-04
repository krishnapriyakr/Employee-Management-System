import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getAllJobs, deleteJob, type Job } from '../../../api/recruitmentApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaDollarSign, 
  FaClock 
} from 'react-icons/fa';

const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getAllJobs();
      if (response.success) {
        setJobs(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      await deleteJob(id);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      'on-hold': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Job Postings</h1>
              <p className="text-gray-600 mt-1">Manage all job openings</p>
            </div>
            <button
              onClick={() => navigate('/recruitment/admin/jobs/create')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <FaPlus className="h-4 w-4" />
              Create Job
            </button>
          </div>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaBriefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No jobs posted yet</p>
            <button
              onClick={() => navigate('/recruitment/admin/jobs/create')}
              className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Create First Job
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                        {job.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><FaBriefcase className="h-3 w-3" /> {job.department}</span>
                      <span className="flex items-center gap-1"><FaMapMarkerAlt className="h-3 w-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><FaDollarSign className="h-3 w-3" /> {job.salaryRange}</span>
                      <span className="flex items-center gap-1"><FaClock className="h-3 w-3" /> {job.employmentType}</span>
                    </div>
                    <div className="flex gap-4 mt-3 text-sm text-gray-500">
                      <span>👁️ {job.views} views</span>
                      <span>📝 {job.applications} applicants</span>
                      <span>📅 Deadline: {new Date(job.lastDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      onClick={() => navigate(`/recruitment/admin/applications?jobId=${job._id}`)}
                      className="text-blue-600 hover:text-blue-800 p-2"
                      title="View Applications"
                    >
                      <FaEye className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => navigate(`/recruitment/admin/jobs/edit/${job._id}`)}
                      className="text-green-600 hover:text-green-800 p-2"
                      title="Edit Job"
                    >
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(job._id, job.title)}
                      className="text-red-600 hover:text-red-800 p-2"
                      title="Delete Job"
                    >
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminJobsPage;