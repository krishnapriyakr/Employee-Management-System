import api from './axiosInstance';

// Employee Interfaces (like your Farm interface)
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  profileImage?: string;
}

export interface EmploymentInfo {
  employeeId: string;
  department: string;
  position: string;
  salary: number;
  joiningDate: string;
  status: 'active' | 'inactive' | 'on-leave';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface CreatedBy {
  _id: string;
  name: string;
  email: string;
}

export interface Employee {
  _id: string;
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  address: Address;
  emergencyContact: EmergencyContact;
  status: boolean;
  isDeleted: boolean;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  data: Employee;
}

export interface EmployeesResponse {
  success: boolean;
  message: string;
  data: {
    employees: Employee[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalEmployees: number;
    activeEmployees: number;
    departments: { [key: string]: number };
  };
}

// ----------------------
// API Functions
// ----------------------

// Get all employees with pagination and search
export const fetchAllEmployees = async (
  page: number,
  limit: number,
  search: string,
  department: string
): Promise<EmployeesResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (department) params.append('department', department);

    const response = await api.get<EmployeesResponse>(`/employees?${params.toString()}`);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching employees', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch employees');
  }
};

// Get employee by ID
export const fetchEmployeeById = async (id: string): Promise<EmployeeResponse> => {
  try {
    const response = await api.get<EmployeeResponse>(`/employees/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching employee', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch employee');
  }
};

// Add employee
export const addEmployee = async (employeeData: Partial<Employee>): Promise<EmployeeResponse> => {
  try {
    const response = await api.post<EmployeeResponse>('/employees', employeeData);
    return response.data;
  } catch (error: any) {
    console.error('Error adding employee', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to add employee');
  }
};

// Edit employee
export const editEmployee = async (id: string, employeeData: Partial<Employee>): Promise<EmployeeResponse> => {
  try {
    const response = await api.put<EmployeeResponse>(`/employees/${id}`, employeeData);
    return response.data;
  } catch (error: any) {
    console.error('Error editing employee', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to edit employee');
  }
};

// Delete employee
export const deleteEmployee = async (id: string): Promise<EmployeeResponse> => {
  try {
    const response = await api.delete<EmployeeResponse>(`/employees/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting employee', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete employee');
  }
};

// Get dashboard statistics
export const fetchDashboardStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response = await api.get<DashboardStatsResponse>('/employees/stats/dashboard');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching dashboard stats', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
  }
};