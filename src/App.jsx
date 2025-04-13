
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/loginPage';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import NotAuthorized from './pages/NotAuthorized';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRoles={['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'APODERADO']}>
                <Dashboard />
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
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
