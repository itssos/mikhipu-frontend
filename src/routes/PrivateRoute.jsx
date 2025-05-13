// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * PrivateRoute protege rutas basándose en roles o permisos.
 * @param {React.ReactNode} children - Componentes hijos a renderizar si está autorizado.
 * @param {string[]} [allowedRoles] - Lista de roles permitidos.
 * @param {string[]} [allowedPermissions] - Lista de permisos permitidos.
 */
const PrivateRoute = ({ children, allowedRoles = [], allowedPermissions = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario autenticado, redirige a login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const hasRole = Array.isArray(allowedRoles) && allowedRoles.includes(user.role);
  const hasPermission =
    Array.isArray(allowedPermissions) &&
    Array.isArray(user.permissions) &&
    user.permissions.some(p => allowedPermissions.includes(p));

  // Si se especifica al menos un rol o un permiso, y el usuario no cumple ninguno, no autorizado
  if ((allowedRoles.length > 0 || allowedPermissions.length > 0) && !hasRole && !hasPermission) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
