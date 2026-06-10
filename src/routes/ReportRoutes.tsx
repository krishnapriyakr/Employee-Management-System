import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AttendanceReportPage from '../pages/reports/AttendanceReportPage';
import LeaveReportPage from '../pages/reports/LeaveReportPage';
import PayrollReportPage from '../pages/reports/PayrollReportPage';

const ReportRoutes: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <Routes>
      <Route path="attendance" element={<AttendanceReportPage />} />
      <Route path="leave" element={<LeaveReportPage />} />
      <Route path="payroll" element={<PayrollReportPage />} />
    </Routes>
  );
};

export default ReportRoutes;