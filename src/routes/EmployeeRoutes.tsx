import React from 'react';
import { Route, Routes } from 'react-router-dom';

// Import employee pages
import EmployeeListPage from '../pages/employees/EmployeeListPage';
import AddEmployeePage from '../pages/employees/AddEmployeePage';
import EditEmployeePage from '../pages/employees/EditEmployeePage';
import EmployeeDetailsPage from '../pages/employees/EmployeeDetailsPage';

const EmployeeRoutes: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<EmployeeListPage />} />
        <Route path="view/:id/*" element={<EmployeeDetailsPage />} />
        <Route path="edit/:id/*" element={<EditEmployeePage />} />
        <Route path="add/*" element={<AddEmployeePage />} />
      </Routes>
    </div>
  );
};

export default EmployeeRoutes;