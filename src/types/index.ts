// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'employee';
}

// Employee related types
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

export interface CreateEmployeeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    profileImage?: string;
  };
  employmentInfo: {
    department: string;
    position: string;
    salary: number;
    joiningDate: string;
    status: 'active' | 'inactive' | 'on-leave';
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface UpdateEmployeeData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    profileImage?: string;
  };
  employmentInfo?: {
    department?: string;
    position?: string;
    salary?: number;
    joiningDate?: string;
    status?: 'active' | 'inactive' | 'on-leave';
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
}