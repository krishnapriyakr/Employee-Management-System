import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobListingsPage from '../pages/recruitment/JobListingsPage';
import JobDetailsPage from '../pages/recruitment/JobDetailsPage';
import AdminJobsPage from '../pages/recruitment/admin/AdminJobsPage';
import CreateJobPage from '../pages/recruitment/admin/CreateJobPage';
import EditJobPage from '../pages/recruitment/admin/EditJobPage';
import AdminApplicationsPage from '../pages/recruitment/admin/AdminApplicationsPage';

const RecruitmentRoutes: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      {/* Public Routes - No Auth Required */}
      <Route path="careers" element={<JobListingsPage />} />
      <Route path="careers/:id" element={<JobDetailsPage />} />
      
      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route path="admin/jobs" element={<AdminJobsPage />} />
          <Route path="admin/jobs/create" element={<CreateJobPage />} />
          <Route path="admin/jobs/edit/:id" element={<EditJobPage />} />
          <Route path="admin/applications" element={<AdminApplicationsPage />} />
        </>
      )}
      
      {/* Default redirect for recruitment */}
      <Route path="*" element={<JobListingsPage />} />
    </Routes>
  );
};

export default RecruitmentRoutes;