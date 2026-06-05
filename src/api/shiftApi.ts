import api from './axiosInstance';

export interface Shift {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  color: string;
}

export interface ShiftAssignment {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
  };
  shiftId: Shift;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'swap_requested';
  overtimeHours: number;
  notes?: string;
}

export interface SwapRequest {
  _id: string;
  assignmentId: ShiftAssignment;
  fromEmployeeId: {
    _id: string;
    name: string;
    email: string;
  };
  toEmployeeId: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  createdAt: string;
}

// ========== Shift Templates ==========

export const getShifts = async (): Promise<any> => {
  try {
    const response = await api.get('/shift/shifts');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch shifts');
  }
};

export const createShift = async (data: any): Promise<any> => {
  try {
    const response = await api.post('/shift/shifts', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create shift');
  }
};

export const updateShift = async (id: string, data: any): Promise<any> => {
  try {
    const response = await api.put(`/shift/shifts/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update shift');
  }
};

export const deleteShift = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/shift/shifts/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete shift');
  }
};

// ========== Shift Assignments ==========

export const assignShift = async (data: {
  employeeId: string;
  shiftId: string;
  date: string;
  overtimeHours?: number;
  notes?: string;
}): Promise<any> => {
  try {
    const response = await api.post('/shift/assign', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to assign shift');
  }
};

export const getMyShifts = async (month?: number, year?: number): Promise<any> => {
  try {
    let url = '/shift/my-shifts';
    if (month !== undefined && year !== undefined) {
      url += `?month=${month}&year=${year}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch shifts');
  }
};

export const getTodaysShifts = async (): Promise<any> => {
  try {
    const response = await api.get('/shift/today');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch today\'s shifts');
  }
};

export const updateShiftStatus = async (id: string, status: string, notes?: string): Promise<any> => {
  try {
    const response = await api.put(`/shift/assignments/${id}/status`, { status, notes });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update shift status');
  }
};

// ========== Swap Requests ==========

export const requestSwap = async (data: {
  assignmentId: string;
  toEmployeeId: string;
  message: string;
}): Promise<any> => {
  try {
    const response = await api.post('/shift/swap/request', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create swap request');
  }
};

export const getMySwapRequests = async (): Promise<any> => {
  try {
    const response = await api.get('/shift/swap/my-requests');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch swap requests');
  }
};

export const respondToSwap = async (id: string, status: string): Promise<any> => {
  try {
    const response = await api.put(`/shift/swap/${id}/respond`, { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to respond to swap request');
  }
};

// ========== Statistics ==========

export const getShiftStats = async (date?: string): Promise<any> => {
  try {
    const url = date ? `/shift/stats?date=${date}` : '/shift/stats';
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch shift stats');
  }
};

export const getMonthlyShiftSummary = async (year: number, month: number): Promise<any> => {
  try {
    const response = await api.get(`/shift/monthly-summary?year=${year}&month=${month}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch monthly summary');
  }
};

export const getAllAssignments = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const response = await api.get(`/shift/assignments?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
  }
};

// Helper: Format time
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};