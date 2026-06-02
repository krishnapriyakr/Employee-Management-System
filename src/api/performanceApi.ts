import api from './axiosInstance';

export interface PerformanceReview {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
  };
  reviewerId: {
    _id: string;
    name: string;
    email: string;
  };
  reviewCycle: 'quarterly' | 'annual' | 'probation';
  quarter?: number;
  year: number;
  selfRating?: number;
  selfStrengths?: string;
  selfWeaknesses?: string;
  selfAchievements?: string;
  selfGoals?: string;
  selfSubmittedAt?: string;
  managerRating?: number;
  managerFeedback?: string;
  managerStrengths?: string;
  managerWeaknesses?: string;
  managerRecommendation?: 'promote' | 'retain' | 'improvement' | 'terminate';
  managerReviewedAt?: string;
  status: 'pending_self' | 'pending_manager' | 'completed';
  finalRating?: number;
  createdAt: string;
}

export interface Goal {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  category: 'technical' | 'soft_skills' | 'leadership' | 'project' | 'behavioral';
  startDate: string;
  endDate: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

// ========== Performance Reviews ==========

// Get my reviews (Employee)
export const getMyReviews = async (): Promise<any> => {
  try {
    const response = await api.get('/performance/reviews/my');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

// Submit self assessment (Employee)
export const submitSelfAssessment = async (reviewId: string, data: {
  selfRating: number;
  selfStrengths: string;
  selfWeaknesses: string;
  selfAchievements: string;
  selfGoals: string;
}): Promise<any> => {
  try {
    const response = await api.put(`/performance/reviews/${reviewId}/self`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit assessment');
  }
};

// Get all reviews (Admin only)
export const getAllReviews = async (filters?: {
  employeeId?: string;
  status?: string;
  year?: number;
  reviewCycle?: string;
}): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.reviewCycle) params.append('reviewCycle', filters.reviewCycle);
    
    const response = await api.get(`/performance/reviews/all?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
  }
};

// Get pending reviews (Admin only)
export const getPendingReviews = async (): Promise<any> => {
  try {
    const response = await api.get('/performance/reviews/pending');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch pending reviews');
  }
};

// Create review (Admin only)
export const createReview = async (data: {
  employeeId: string;
  reviewCycle: string;
  quarter?: number;
  year: number;
}): Promise<any> => {
  try {
    const response = await api.post('/performance/reviews', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create review');
  }
};

// Submit manager assessment (Admin only)
export const submitManagerAssessment = async (reviewId: string, data: {
  managerRating: number;
  managerFeedback: string;
  managerStrengths: string;
  managerWeaknesses: string;
  managerRecommendation: string;
}): Promise<any> => {
  try {
    const response = await api.put(`/performance/reviews/${reviewId}/manager`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit manager assessment');
  }
};

// Get performance stats (Admin only)
export const getPerformanceStats = async (): Promise<any> => {
  try {
    const response = await api.get('/performance/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch stats');
  }
};

// ========== Goals ==========

// Get my goals (Employee)
export const getMyGoals = async (): Promise<any> => {
  try {
    const response = await api.get('/performance/goals/my');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch goals');
  }
};

// Update goal progress (Employee)
export const updateGoalProgress = async (goalId: string, progress: number): Promise<any> => {
  try {
    const response = await api.put(`/performance/goals/${goalId}/progress`, { progress });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update progress');
  }
};

// Get all goals (Admin only)
export const getAllGoals = async (filters?: {
  employeeId?: string;
  status?: string;
  category?: string;
}): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    
    const response = await api.get(`/performance/goals/all?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch goals');
  }
};

// Create goal (Admin only)
export const createGoal = async (data: {
  employeeId: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  priority: string;
}): Promise<any> => {
  try {
    const response = await api.post('/performance/goals', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create goal');
  }
};

// Delete goal (Admin only)
export const deleteGoal = async (goalId: string): Promise<any> => {
  try {
    const response = await api.delete(`/performance/goals/${goalId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete goal');
  }
};