import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicJobs,type Job } from '../../api/recruitmentApi';
import { toast } from 'react-toastify';
import { 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaClock, 
  FaDollarSign, 
  FaBuilding,
  FaSearch,
  FaFilter
} from 'react-icons/fa';

const JobListingsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getPublicJobs();
      if (response.success) {
        setJobs(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || job.employmentType === filterType;
    return matchesSearch && matchesType;
  });

  const employmentTypes = ['full-time', 'part-time', 'contract', 'internship'];

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-primary-100">Find your dream job and grow your career with us</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, department, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 appearance-none"
              >
                <option value="">All Job Types</option>
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaBriefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No jobs found matching your criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><FaBuilding className="h-3 w-3" /> {job.department}</span>
                      <span className="flex items-center gap-1"><FaMapMarkerAlt className="h-3 w-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><FaClock className="h-3 w-3" /> Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><FaDollarSign className="h-3 w-3" /> {job.salaryRange}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(job.employmentType)}`}>
                      {job.employmentType.toUpperCase()}
                    </span>
                    <Link
                      to={`/careers/${job._id}`}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListingsPage;