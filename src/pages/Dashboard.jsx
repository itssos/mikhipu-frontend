
import { React, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import StudentModal from '../components/StudentModal';

const Dashboard = () => {
  const { user, person, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Bienvenido, {person ? `${person.firstName} ${person.lastName}` : "Información personal no disponible"}
      </p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>

      <StudentModal trigger={
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          + Nuevo Estudiante
        </button>
      } studentId={1} />



    </div>
  );
};

export default Dashboard;
