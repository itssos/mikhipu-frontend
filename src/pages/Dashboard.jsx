import React from 'react';
import useAuth from '../hooks/useAuth';
import EvaluationManager from '../components/EvaluationManager';

const Dashboard = () => {
  const { user, person, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="block px-4 py-2 rounded hover:bg-blue-100 font-medium">Dashboard</a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-blue-100">Reportes</a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-blue-100">Asistencia</a>
          {/* Más links aquí */}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-8">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm text-gray-600">
                {person
                  ? `${person.firstName} ${person.lastName}`
                  : "Sin información personal"}
              </p>
              <p className="text-xs text-gray-400">{user.username}</p>
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${person ? `${person.firstName}+${person.lastName}` : user.username}`}
              alt="Avatar"
              className="w-10 h-10 rounded-full bg-gray-200"
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8">
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded shadow p-6 flex flex-col items-start">
              <span className="text-gray-500 text-sm">Asistencias</span>
              <span className="text-2xl font-bold">123</span>
              <span className="text-green-500 text-xs mt-2">+10 esta semana</span>
            </div>
            <div className="bg-white rounded shadow p-6 flex flex-col items-start">
              <span className="text-gray-500 text-sm">Usuarios</span>
              <span className="text-2xl font-bold">50</span>
              <span className="text-blue-500 text-xs mt-2">+2 nuevos</span>
            </div>
            <div className="bg-white rounded shadow p-6 flex flex-col items-start">
              <span className="text-gray-500 text-sm">Alertas</span>
              <span className="text-2xl font-bold">5</span>
              <span className="text-red-500 text-xs mt-2">1 crítica</span>
            </div>
          </div> */}
          {/* Aquí puedes poner más componentes, gráficos, tablas, etc */}
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Resumen</h2>
            <p className="text-gray-700">Maqueta de gráficos, reportes o cualquier otro contenido relevante.</p>
            <img src="https://pinguinodigital.com/wp-content/uploads/2020/05/Qu%C3%A9-es-dashboard-2.png" alt="" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
