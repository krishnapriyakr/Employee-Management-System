import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MyShiftsPage from '../pages/shift/MyShiftsPage';
import ShiftCalendarPage from '../pages/shift/admin/ShiftCalendarPage';
import AssignShiftPage from '../pages/shift/admin/AssignShiftPage';
import SwapRequestsPage from '../pages/shift/SwapRequestsPage';
import ShiftTemplatesPage from '../pages/shift/admin/ShiftTemplatesPage';

const ShiftRoutes: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      {/* Employee Routes */}
      <Route path="my-shifts" element={<MyShiftsPage />} />
      <Route path="swaps" element={<SwapRequestsPage />} />
      
      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route path="calendar" element={<ShiftCalendarPage />} />
          <Route path="templates" element={<ShiftTemplatesPage />} />
          <Route path="assign" element={<AssignShiftPage />} />
        </>
      )}
      
      {/* Default redirect */}
      <Route path="*" element={<MyShiftsPage />} />
    </Routes>
  );
};

export default ShiftRoutes;