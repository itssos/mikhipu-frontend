
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Verifica si el usuario tiene alguno de los roles permitidos
  if (allowedRoles && (!user.roles || !user.roles.some(role => allowedRoles.includes(role)))) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
};

export default PrivateRoute;
