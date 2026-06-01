import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MyAttendancePage from '../pages/attendance/MyAttendancePage';

const AttendanceRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main attendance page */}
      <Route path="my-attendance" element={<MyAttendancePage />} />
      <Route path="*" element={<MyAttendancePage />} />
    </Routes>
  );
};

export default AttendanceRoutes;