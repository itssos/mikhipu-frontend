
import { React, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import TeacherManagement from '../components/TeacherManagement';
import ViewScheduleModal from '../components/modals/ViewScheduleModal';
import ManageScheduleModal from '../components/modals/ManageScheduleModal';
import TeacherScheduleManager from '../components/TeacherScheduleManager';
import CourseTable from '../components/CourseTable';
import StudentQRGeneratorButton from '../components/student/StudentQRGeneratorButton';
import StudentQRScanner from '../components/student/StudentQRScanner';
import AssistanceConfigForm from "../components/assistance/AssistanceConfigForm"

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


      <div className="flex flex-col md:flex-row gap-8 justify-center items-center min-h-screen bg-gray-100 p-8">
        <StudentQRScanner onScan={(val) => console.log("Scanned:", val)} />
        <div>
          <StudentQRGeneratorButton id={12345} />
        </div>
      </div>


      <AssistanceConfigForm></AssistanceConfigForm>


    </div>
  );
};

export default Dashboard;
