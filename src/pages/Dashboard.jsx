
import { React, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import TeacherManagement from '../components/TeacherManagement';
import ViewScheduleModal from '../components/modals/ViewScheduleModal';
import ManageScheduleModal from '../components/modals/ManageScheduleModal';
import TeacherScheduleManager from '../components/TeacherScheduleManager';
import CourseTable from '../components/CourseTable';

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



    </div>
  );
};

export default Dashboard;
