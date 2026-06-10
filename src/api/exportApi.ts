import api from './axiosInstance';

// Export Employees to Excel
export const exportEmployeesExcel = (): void => {
  const token = localStorage.getItem('token');
  window.open(`http://localhost:5000/api/export/employees/excel?token=${token}`, '_blank');
};

// Export Employees to PDF
export const exportEmployeesPDF = (): void => {
  const token = localStorage.getItem('token');
  window.open(`http://localhost:5000/api/export/employees/pdf?token=${token}`, '_blank');
};

// Export Attendance to Excel
export const exportAttendanceExcel = (startDate?: string, endDate?: string, employeeId?: string): void => {
  const token = localStorage.getItem('token');
  let url = `http://localhost:5000/api/export/attendance/excel?token=${token}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  if (employeeId) url += `&employeeId=${employeeId}`;
  window.open(url, '_blank');
};

// Export Leave to Excel
export const exportLeaveExcel = (status?: string, startDate?: string, endDate?: string): void => {
  const token = localStorage.getItem('token');
  let url = `http://localhost:5000/api/export/leave/excel?token=${token}`;
  if (status) url += `&status=${status}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  window.open(url, '_blank');
};

// Export Payroll to Excel
export const exportPayrollExcel = (month?: number, year?: number): void => {
  const token = localStorage.getItem('token');
  let url = `http://localhost:5000/api/export/payroll/excel?token=${token}`;
  if (month) url += `&month=${month}`;
  if (year) url += `&year=${year}`;
  window.open(url, '_blank');
};

// Export Payroll to PDF
export const exportPayrollPDF = (month: number, year: number): void => {
  const token = localStorage.getItem('token');
  window.open(`http://localhost:5000/api/export/payroll/pdf?token=${token}&month=${month}&year=${year}`, '_blank');
};