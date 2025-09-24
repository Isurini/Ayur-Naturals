import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import PatientDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

//  New imports for Feedback system
import UserFeedbackPage from './pages/UserFeedbackPage';
import AdminFeedbackPage from './pages/AdminFeedbackPage';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/*  Feedback system routes */}
          <Route
            path="/feedback"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserFeedbackPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/feedbacks"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminFeedbackPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
