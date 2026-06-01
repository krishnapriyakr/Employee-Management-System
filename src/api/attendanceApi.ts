import api from './axiosInstance';

export interface AttendanceRecord {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
  };
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  totalHours?: number;
  status: 'present' | 'late' | 'half-day' | 'absent';
  isLate: boolean;
  lateMinutes?: number;
  notes?: string;
}

// Employee: Check In
export const checkIn = async (location?: string): Promise<any> => {
  try {
    const response = await api.post('/attendance/check-in', { location });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to check in');
  }
};

// Employee: Check Out
export const checkOut = async (): Promise<any> => {
  try {
    const response = await api.post('/attendance/check-out');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to check out');
  }
};

// Employee: Get today's status
export const getTodayStatus = async (): Promise<any> => {
  try {
    const response = await api.get('/attendance/today-status');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch status');
  }
};

// Employee: Get my attendance
export const getMyAttendance = async (month?: number, year?: number): Promise<any> => {
  try {
    let url = '/attendance/my-attendance';
    if (month !== undefined && year !== undefined) {
      url += `?month=${month}&year=${year}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch attendance');
  }
};

// Admin: Get all attendance
export const getAllAttendance = async (
  page: number = 1,
  limit: number = 20,
  filters?: {
    employeeId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }
): Promise<any> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.status) params.append('status', filters.status);
    
    const response = await api.get(`/attendance/all?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch attendance');
  }
};

// Admin: Manual entry
export const manualAttendanceEntry = async (data: {
  employeeId: string;
  checkInTime: string;
  checkOutTime?: string;
  notes?: string;
}): Promise<any> => {
  try {
    const response = await api.post('/attendance/manual-entry', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to record attendance');
  }
};

// Admin: Update attendance
export const updateAttendance = async (id: string, data: any): Promise<any> => {
  try {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update attendance');
  }
};

// Admin: Dashboard stats
export const getAttendanceStats = async (): Promise<any> => {
  try {
    const response = await api.get('/attendance/stats/dashboard');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch stats');
  }
};