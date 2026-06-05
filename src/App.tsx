import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
// Context
import { AuthProvider } from './context/AuthContext';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import MyProfilePage from './pages/profile/MyProfilePage';

// Route Components
import EmployeeRoutes from './routes/EmployeeRoutes';

// Components
import ProtectedRoute from './components/rbac/ProtectedRoute';
import LeaveRoutes from './routes/LeaveRoutes';
import AttendanceRoutes from './routes/AttendanceRoutes';
import PerformanceRoutes from './routes/PerformanceRoutes';
import DocumentsRoutes from './routes/DocumentsRoutes';
import RecruitmentRoutes from './routes/RecruitmentRoutes';
import ShiftRoutes from './routes/ShiftRoutes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Employee Routes (like your farm routes) */}
            <Route
              path="/employees/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <EmployeeRoutes />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/attendance/*"
              element={
                <ProtectedRoute>
                  <AttendanceRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave/*"
              element={
                <ProtectedRoute>
                  <LeaveRoutes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/performance/*"
              element={
                <ProtectedRoute>
                  <PerformanceRoutes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/documents/*"
              element={
                <ProtectedRoute>
                  <DocumentsRoutes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recruitment/*"
              element={
                <ProtectedRoute>
                  <RecruitmentRoutes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/shifts/*"
              element={
                <ProtectedRoute>
                  <ShiftRoutes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MyProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>

          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;