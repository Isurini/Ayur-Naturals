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
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Feedback system
import UserFeedbackPage from './pages/UserFeedbackPage';
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import StaffDashboard from './pages/StaffDashboard';
import FeedbackDashboard from './pages/FeedbackDashboard';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div style={{ minHeight: '80vh' }}>
        <Routes>
          {/* Auth routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Admin routes */}
          <Route path="/admin/users" element={<UserDashboard />} />
          <Route path="/admin/staff" element={<StaffDashboard />} />
          <Route path="/admin/feedback" element={<FeedbackDashboard />} />
          <Route
            path="/admin/feedbacks"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminFeedbackPage />
              </ProtectedRoute>
            }
          />

          {/* User routes */}
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
          <Route
            path="/feedback"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserFeedbackPage />
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
