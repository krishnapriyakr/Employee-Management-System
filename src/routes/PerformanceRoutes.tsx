import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MyReviewsPage from '../pages/performance/MyReviewsPage';
import MyGoalsPage from '../pages/performance/MyGoalsPage';
import AdminPerformanceDashboard from '../pages/performance/admin/AdminPerformanceDashboard';
import CreateReviewPage from '../pages/performance/admin/CreateReviewPage';
import ManagerAssessmentPage from '../pages/performance/admin/ManagerAssessmentPage';

const PerformanceRoutes: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      {/* Employee Routes */}
      <Route path="my-reviews" element={<MyReviewsPage />} />
      <Route path="my-goals" element={<MyGoalsPage />} />
      
      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route path="admin/dashboard" element={<AdminPerformanceDashboard />} />
          <Route path="reviews/create" element={<CreateReviewPage />} />
          <Route path="reviews/:id/manager" element={<ManagerAssessmentPage />} />
        </>
      )}
      
      {/* Default redirect */}
      <Route path="*" element={<MyReviewsPage />} />
    </Routes>
  );
};

export default PerformanceRoutes;