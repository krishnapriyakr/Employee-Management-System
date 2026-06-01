import api from './axiosInstance';

export interface LeaveRequest {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
  };
  type: 'sick' | 'casual' | 'annual' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  _id: string;
  employeeId: string;
  annual: number;
  sick: number;
  casual: number;
  year: number;
}

export interface LeaveStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byType: {
    sick: number;
    casual: number;
    annual: number;
    unpaid: number;
  };
}

// Apply for leave
export const applyForLeave = async (data: {
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}): Promise<any> => {
  try {
    const response = await api.post('/leave/apply', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to apply for leave');
  }
};

// Get my leave requests
export const getMyLeaves = async (): Promise<any> => {
  try {
    const response = await api.get('/leave/my-leaves');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch leaves');
  }
};

// Get my leave balance
export const getMyLeaveBalance = async (): Promise<any> => {
  try {
    const response = await api.get('/leave/my-balance');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch balance');
  }
};

// Admin: Get all pending requests
export const getPendingRequests = async (): Promise<any> => {
  try {
    const response = await api.get('/leave/pending');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pending requests');
  }
};

// Admin: Get all leave requests
export const getAllLeaveRequests = async (filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const url = `/leave/all${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch leave requests');
  }
};

// Admin: Get leave statistics
export const getLeaveStatistics = async (): Promise<any> => {
  try {
    const response = await api.get('/leave/statistics');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch statistics');
  }
};

// Admin: Approve leave request
export const approveLeave = async (id: string, comments?: string): Promise<any> => {
  try {
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid leave request ID');
    }
    
    const response = await api.put(`/leave/${id}/approve`, { comments });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to approve leave');
  }
};

// Admin: Reject leave request
export const rejectLeave = async (id: string, comments: string): Promise<any> => {
  try {
    const response = await api.put(`/leave/${id}/reject`, { comments });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to reject leave');
  }
};