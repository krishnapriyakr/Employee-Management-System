import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MyDocumentsPage from '../pages/documents/MyDocumentsPage';
import EmployeeDocumentsPage from '../pages/documents/admin/EmployeeDocumentsPage';
import DocumentLibraryPage from '../pages/documents/admin/DocumentLibraryPage';

const DocumentsRoutes: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      {/* Employee Routes */}
      <Route path="my" element={<MyDocumentsPage />} />
      
      {/* Admin Routes */}
      {isAdmin && (
        <>
          <Route path="employee/:employeeId" element={<EmployeeDocumentsPage />} />
          <Route path="library" element={<DocumentLibraryPage />} />
        </>
      )}
      
      {/* Default redirect */}
      <Route path="*" element={<MyDocumentsPage />} />
    </Routes>
  );
};

export default DocumentsRoutes;