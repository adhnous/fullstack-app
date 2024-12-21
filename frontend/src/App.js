import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import JoinOptions from './JoinOptions';
import AdminLogin from './AdminLogin';
import TrainerRegister from './TrainerRegister';
import TraineeRegister from './TraineeRegister';
import AdminDashboard from './AdminDashboard';
import TrainerDashboard from './TrainerDashboard';
import TraineePage from './TraineePage';

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    // You can add more sophisticated token validation if needed
    return !!token;
  };

  const ProtectedRoute = ({ element: Component, allowedRoles }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/admin-login" />;
    }

    const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }

    return <Component />;
  };

  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/options" element={<JoinOptions />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/trainer-register" element={<TrainerRegister />} />
        <Route path="/trainee-register" element={<TraineeRegister />} />

        {/* Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute element={AdminDashboard} allowedRoles={['admin']} />
          }
        />
        <Route
          path="/trainer-dashboard"
          element={
            <ProtectedRoute
              element={TrainerDashboard}
              allowedRoles={['trainer']}
            />
          }
        />
        <Route
          path="/trainee-dashboard"
          element={
            <ProtectedRoute
              element={TraineePage}
              allowedRoles={['trainee']}
            />
          }
        />

        {/* Fallback Route for 404 */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
