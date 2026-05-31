import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Employee leave pages
import MyLeavesPage from '../pages/leave/MyLeavesPage';
import ApplyLeavePage from '../pages/leave/ApplyLeavePage';
import LeaveBalancePage from '../pages/leave/LeaveBalancePage';

// Admin leave pages
import LeaveRequestsPage from '../pages/leave/admin/LeaveRequestsPage';
import LeaveStatisticsPage from '../pages/leave/admin/LeaveStatisticsPage';

const LeaveRoutes: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      {/* Employee Routes */}
      <Route path="my-leaves" element={<MyLeavesPage />} />
      <Route path="apply" element={<ApplyLeavePage />} />
      <Route path="balance" element={<LeaveBalancePage />} />
      
      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route path="requests" element={<LeaveRequestsPage />} />
          <Route path="statistics" element={<LeaveStatisticsPage />} />
        </>
      )}
      
      {/* Default redirect */}
      <Route path="*" element={<MyLeavesPage />} />
    </Routes>
  );
};

export default LeaveRoutes;