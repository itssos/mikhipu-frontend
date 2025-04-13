
import React from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, person, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Bienvenido, {person ? `${person.firstName} ${person.lastName}` : "Información personal no disponible"}
      </p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Roles: {user.roles.join(', ')}</p>
      <button onClick={handleLogout}>Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;
