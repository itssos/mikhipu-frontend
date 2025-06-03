
import { React, useState } from 'react';
import { getAssistanceRecords } from "../api/assistance"
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AssistanceFilterFetcher from "../components/assistance/AssistanceFilterFetcher"

const Dashboard = () => {
  const { user, person, logout } = useAuth();
  const navigate = useNavigate();

  // Cambio de página
  const goToPage = (newPage) => {
    handleSearch(null, newPage);
  };

  // Cambio de tamaño
  const handleSizeChange = (e) => {
    setSize(Number(e.target.value));
    handleSearch(null, 0, Number(e.target.value));
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Bienvenido, {person ? `${person.firstName} ${person.lastName}` : "Información personal no disponible"}
      </p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>

      <AssistanceFilterFetcher fetchFunction={getAssistanceRecords}>
        {({ content, filters, loading, error, totalPages, onPageChange, totalElements }) => (
          <>

            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow mb-4">
              <table className="min-w-full bg-white">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Fecha</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Apellido</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Nombre</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Nivel</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Grado</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Sección</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Estado entrada</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Estado salida</th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-400">
                        <span className="animate-spin inline-block mr-2">&#9696;</span>
                        Cargando...
                      </td>
                    </tr>
                  ) : content.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-400">
                        Sin resultados.
                      </td>
                    </tr>
                  ) : (
                    content.map(rec => (
                      <tr key={rec.id} className="border-b last:border-b-0 hover:bg-blue-50/30">
                        <td className="px-3 py-2 text-sm">{rec.date}</td>
                        <td className="px-3 py-2 text-sm">{rec.lastName}</td>
                        <td className="px-3 py-2 text-sm">{rec.firstName}</td>
                        <td className="px-3 py-2 text-sm">{rec.schoolLevel || "-"}</td>
                        <td className="px-3 py-2 text-sm">{rec.grade || "-"}</td>
                        <td className="px-3 py-2 text-sm">{rec.section || "-"}</td>
                        <td className="px-3 py-2 text-sm">{rec.entryStatus}</td>
                        <td className="px-3 py-2 text-sm">{rec.exitStatus}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-xl shadow text-xs font-bold"
                            onClick={() => handleEdit(rec)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex flex-wrap justify-center items-center mt-6 gap-2">
              <button
                onClick={() => onPageChange(filters.page - 1)}
                disabled={filters.page === 0}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onPageChange(idx)}
                  className={`px-3 py-1 rounded-lg font-bold ${filters.page === idx
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-blue-50"
                    }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => onPageChange(filters.page + 1)}
                disabled={filters.page >= totalPages - 1}
                className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Siguiente
              </button>
              <span className="text-sm ml-2 text-gray-500">
                {totalElements} resultados
              </span>
            </div>

          </>

        )}
      </AssistanceFilterFetcher>


    </div>
  );
};

export default Dashboard;
