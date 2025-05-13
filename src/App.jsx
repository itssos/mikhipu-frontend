
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import NotAuthorized from './pages/error/NotAuthorized';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPassword';
import ResetPasswordPage from './pages/auth/ResetPassword';
import NotFound from './pages/error/NotFound';
import Layout from './components/Layout';
import PersonManagement from './pages/PersonManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'APODERADO']}>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR']}>
                <AdminPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/persons"
            element={
              <PrivateRoute allowedPermissions={['GET_PERSONS']}>
                <Layout>
                  <PersonManagement />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="*" element={
            <PrivateRoute allowedRoles={['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'APODERADO']}>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
