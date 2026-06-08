import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MyPayrollPage from '../pages/payroll/MyPayrollPage';
import BankDetailsPage from '../pages/payroll/BankDetailsPage';
import SalaryStructurePage from '../pages/payroll/admin/SalaryStructurePage';
import ProcessPayrollPage from '../pages/payroll/admin/ProcessPayrollPage';

const PayrollRoutes: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      {/* Employee Routes */}
      <Route path="my-payroll" element={<MyPayrollPage />} />
      <Route path="bank-details" element={<BankDetailsPage />} />
      
      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route path="salary-structures" element={<SalaryStructurePage />} />
          <Route path="process" element={<ProcessPayrollPage />} />
        </>
      )}
    </Routes>
  );
};

export default PayrollRoutes;