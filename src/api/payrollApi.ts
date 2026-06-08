import api from './axiosInstance';

export interface SalaryStructure {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
  };
  basicSalary: number;
  hra: number;
  da: number;
  ca: number;
  specialAllowance: number;
  bonus: number;
  pf: number;
  professionalTax: number;
  tds: number;
  otherDeductions: number;
  effectiveFrom: string;
  isActive: boolean;
}

export interface Payroll {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
  };
  month: number;
  year: number;
  grossEarnings: {
    basicSalary: number;
    hra: number;
    da: number;
    ca: number;
    specialAllowance: number;
    bonus: number;
    overtimeAmount: number;
    attendanceBonus: number;
    otherEarnings: number;
  };
  deductions: {
    pf: number;
    professionalTax: number;
    tds: number;
    leaveDeductions: number;
    advanceDeduction: number;
    otherDeductions: number;
  };
  netSalary: number;
  attendanceDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  overtimeHours: number;
  status: 'draft' | 'processed' | 'paid';
  processedBy?: string;
  processedDate?: Date;
  processedAt?: Date;
  paymentDate?: string;
  paymentMode?: 'bank' | 'cash' | 'cheque';
  transactionId?: string;
}

export interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  branchName: string;
  accountType: 'savings' | 'current';
  upiId?: string;
  panNumber: string;
  aadharNumber: string;
}

// ========== Salary Structure ==========

export const createSalaryStructure = async (data: any): Promise<any> => {
  try {
    const response = await api.post('/payroll/salary-structure', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create salary structure');
  }
};

export const getSalaryStructures = async (): Promise<any> => {
  try {
    const response = await api.get('/payroll/salary-structures');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch salary structures');
  }
};

export const getEmployeeSalaryStructure = async (employeeId: string): Promise<any> => {
  try {
    const response = await api.get(`/payroll/salary-structure/${employeeId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch salary structure');
  }
};

// ========== Payroll ==========

export const processPayroll = async (employeeId: string, month: number, year: number): Promise<any> => {
  try {
    const response = await api.post('/payroll/process', { employeeId, month, year });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to process payroll');
  }
};

export const processAllPayroll = async (month: number, year: number): Promise<any> => {
  try {
    const response = await api.post('/payroll/process-all', { month, year });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to process payroll');
  }
};

export const getMyPayroll = async (month?: number, year?: number): Promise<any> => {
  try {
    let url = '/payroll/my-payroll';
    if (month !== undefined && year !== undefined) {
      url += `?month=${month}&year=${year}`;
    }
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch payroll');
  }
};

export const getAllPayrolls = async (filters?: {
  month?: number;
  year?: number;
  status?: string;
  employeeId?: string;
}): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (filters?.month) params.append('month', filters.month.toString());
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);
    
    const response = await api.get(`/payroll/all?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch payrolls');
  }
};

export const updatePayrollStatus = async (id: string, status: string, paymentMode?: string, transactionId?: string): Promise<any> => {
  try {
    const response = await api.put(`/payroll/${id}/status`, { status, paymentMode, transactionId });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update payroll status');
  }
};

export const getPayrollStats = async (): Promise<any> => {
  try {
    const response = await api.get('/payroll/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch stats');
  }
};

// ========== Bank Details ==========

export const saveBankDetails = async (data: BankDetails): Promise<any> => {
  try {
    const response = await api.post('/payroll/bank-details', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to save bank details');
  }
};

export const getBankDetails = async (): Promise<any> => {
  try {
    const response = await api.get('/payroll/bank-details');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch bank details');
  }
};

// Helper: Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper: Get month name
export const getMonthName = (month: number): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1];
};