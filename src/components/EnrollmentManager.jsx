import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getEnrollmentsByStudent } from '../api/enrollments';

import CreateEnrollmentModal from './modals/CreateEnrollmentModal';
import UpdateEnrollmentStatusModal from './modals/UpdateEnrollmentStatusModal';
import ViewEnrollmentsModal from './modals/ViewEnrollmentsModal';
import StudentListFetcher from './student/StudentListFetcher';

export default function EnrollmentManager() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  // Cuando cambia el estudiante seleccionado, recarga matrículas
  useEffect(() => {
    if (!selectedStudent) {
      setEnrollments([]);
      return;
    }
    (async () => {
      try {
        const list = await getEnrollmentsByStudent(selectedStudent.id);
        setEnrollments(list);
      } catch {
        toast.error('Error al cargar matrículas');
      }
    })();
  }, [selectedStudent]);

  // Callback para refrescar desde los modales
  const handleRefresh = () => {
    if (!selectedStudent) return;
    getEnrollmentsByStudent(selectedStudent.id)
      .then(setEnrollments)
      .catch(() => toast.error('Error al recargar matrículas'));
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 py-8 bg-gradient-to-br from-blue-50 via-white to-slate-100 rounded-3xl border border-blue-100 shadow-2xl">
      <h2 className="text-2xl font-extrabold mb-6 text-blue-900 text-center">Gestión de Matrículas</h2>

      {/* Buscador y selector de estudiante */}
      <div className="mb-8">
        <label className="block font-semibold mb-2 text-blue-700 text-lg">Buscar y seleccionar estudiante</label>
        <StudentListFetcher>
          {({ students, filters, loading, error, totalPages, onPageChange }) => (
            <div className="w-full">
              {/* Filtros, tabla y paginación juntos */}
              <div className="border rounded-2xl shadow bg-white/90 overflow-x-auto">
                {loading ? (
                  <div className="text-center py-6">Cargando estudiantes...</div>
                ) : error ? (
                  <div className="text-red-500 py-4 text-center">{error}</div>
                ) : (
                  <>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 text-blue-700">
                          <th className="p-2"></th>
                          <th className="p-2 text-left">Nombre</th>
                          <th className="p-2 text-left">DNI</th>
                          <th className="p-2 text-left">Nivel</th>
                          <th className="p-2 text-left">Grado</th>
                          <th className="p-2 text-left">Sección</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-4 text-gray-400">
                              No hay estudiantes que coincidan.
                            </td>
                          </tr>
                        ) : students.map(student => (
                          <tr
                            key={student.id}
                            className={`border-b hover:bg-blue-50 transition cursor-pointer ${selectedStudent && selectedStudent.id === student.id ? 'bg-blue-100 font-semibold' : ''}`}
                            onClick={() => setSelectedStudent(student)}
                          >
                            <td className="p-2 text-center">
                              <input
                                type="radio"
                                checked={selectedStudent && selectedStudent.id === student.id}
                                readOnly
                              />
                            </td>
                            <td className="p-2">{student.fullName}</td>
                            <td className="p-2">{student.dni}</td>
                            <td className="p-2">{student.schoolLevel}</td>
                            <td className="p-2">{student.grade}</td>
                            <td className="p-2">{student.section}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Paginación */}
                    <div className="flex justify-center items-center gap-2 py-3">
                      <button
                        onClick={() => onPageChange(filters.page - 1)}
                        disabled={filters.page === 0}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => onPageChange(idx)}
                          className={`px-3 py-1 rounded font-bold ${filters.page === idx
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
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* Resumen seleccionado */}
              {selectedStudent && (
                <div className="mt-4 flex flex-col md:flex-row items-center gap-6 border border-blue-100 rounded-2xl bg-white shadow-lg p-4">
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-blue-800 mb-1">
                      {selectedStudent.fullName} <span className="ml-2 text-gray-500 text-base">({selectedStudent.dni})</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-2">
                      <span className="bg-blue-100 rounded px-2 py-1">Nivel: {selectedStudent.schoolLevel}</span>
                      <span className="bg-blue-100 rounded px-2 py-1">Grado: {selectedStudent.grade}</span>
                      <span className="bg-blue-100 rounded px-2 py-1">Sección: {selectedStudent.section}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <b>Matrículas encontradas:</b> {enrollments.length}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <CreateEnrollmentModal
                      trigger={<button className="bg-green-500 hover:bg-green-400 transition-all duration-300 text-white px-4 py-2 rounded-xl shadow">Crear Matrícula</button>}
                      studentId={selectedStudent?.id}
                      onSuccess={handleRefresh}
                    />
                    <UpdateEnrollmentStatusModal
                      trigger={<button className="bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 text-black px-4 py-2 rounded-xl shadow">Actualizar Estado</button>}
                      studentId={selectedStudent?.id}
                      onSuccess={handleRefresh}
                    />
                    <ViewEnrollmentsModal
                      trigger={<button className="bg-blue-500 hover:bg-blue-400 transition-all duration-300 text-white px-4 py-2 rounded-xl shadow">Ver Matrículas</button>}
                      enrollments={enrollments}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </StudentListFetcher>
      </div>

      {/* Sugerencia para el usuario si no hay selección */}
      {!selectedStudent && (
        <div className="my-6 text-center text-gray-600 italic text-sm">
          Selecciona un estudiante para ver y gestionar sus matrículas.
        </div>
      )}

      {/* Vista previa de matrículas en tarjetas si quieres más feedback visual*/}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {enrollments.map(e => (
          <div key={e.id} className="border rounded-xl shadow p-4 bg-white">
            <div className="font-bold text-blue-800">{e.courseName}</div>
            <div className="text-gray-600 text-xs">{e.status}</div>
            <div className="text-gray-400 text-xs">{e.year}</div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
