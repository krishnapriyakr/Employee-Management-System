import api from './axiosInstance';

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: string;
  salaryRange: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: 'open' | 'closed' | 'on-hold';
  postedDate: string;
  lastDate: string;
  views: number;
  applications: number;
}

export interface Application {
  _id: string;
  jobId: Job;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentCompany?: string;
  experience: string;
  currentSalary?: string;
  expectedSalary?: string;
  noticePeriod: string;
  resumeUrl: string;
  resumeFileName: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  createdAt: string;
}

// ========== Public Routes (No Auth) ==========

// Get all open jobs
export const getPublicJobs = async (): Promise<any> => {
  try {
    const response = await api.get('/recruitment/jobs/public');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
  }
};

// Get job details
export const getPublicJobById = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/recruitment/jobs/public/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch job details');
  }
};

// Apply for job
export const applyForJob = async (jobId: string, formData: FormData): Promise<any> => {
  try {
    const response = await api.post(`/recruitment/jobs/${jobId}/apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit application');
  }
};

// ========== Admin Routes ==========

// Jobs
export const createJob = async (data: any): Promise<any> => {
  try {
    const response = await api.post('/recruitment/jobs', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create job');
  }
};

export const getAllJobs = async (): Promise<any> => {
  try {
    const response = await api.get('/recruitment/jobs');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch jobs');
  }
};

export const getJobById = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/recruitment/jobs/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch job');
  }
};

export const updateJob = async (id: string, data: any): Promise<any> => {
  try {
    const response = await api.put(`/recruitment/jobs/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update job');
  }
};

export const deleteJob = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/recruitment/jobs/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete job');
  }
};

// Applications
export const getAllApplications = async (filters?: { jobId?: string; status?: string }): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (filters?.jobId) params.append('jobId', filters.jobId);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/recruitment/applications?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch applications');
  }
};

export const getApplicationById = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/recruitment/applications/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch application');
  }
};

export const updateApplicationStatus = async (id: string, status: string, comments?: string): Promise<any> => {
  try {
    const response = await api.put(`/recruitment/applications/${id}/status`, { status, comments });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update status');
  }
};

export const scheduleInterview = async (id: string, data: { interviewDate: string; interviewTime: string; interviewType: string }): Promise<any> => {
  try {
    const response = await api.put(`/recruitment/applications/${id}/schedule-interview`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to schedule interview');
  }
};

export const downloadResume = async (id: string): Promise<void> => {
  try {
    const response = await api.get(`/recruitment/applications/${id}/resume`, {
      responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'resume.pdf';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '');
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to download resume');
  }
};

export const getApplicationStats = async (): Promise<any> => {
  try {
    const response = await api.get('/recruitment/applications/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch stats');
  }
};

// Helper functions
export const getEmploymentTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    'contract': 'Contract',
    'internship': 'Internship'
  };
  return labels[type] || type;
};

export const getStatusBadgeColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-green-100 text-green-800',
    interviewed: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800',
    hired: 'bg-emerald-100 text-emerald-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};