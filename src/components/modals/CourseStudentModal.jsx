import React, { useEffect, useState } from 'react';
import Modal from '../UI/Modal';
import Select from 'react-select';
import {
  getCourses,
  assignStudentsToCourse,
  removeStudentsFromCourse,
  getStudentsSummaryByCourse
} from '../../api/courses';
import { toast } from 'react-toastify';
import StudentListFetcher from '../student/StudentListFetcher';

const CourseStudentModal = ({ trigger, courseId }) => {
  const [courses, setCourses] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || null);
  const [selectedToAssign, setSelectedToAssign] = useState([]);

  // Carga inicial de cursos y asignados si hay courseId
  useEffect(() => {
    getCourses()
      .then(list => setCourses(list))
      .catch(() => toast.error('No se pudieron cargar los cursos'));

    if (courseId) loadAssigned(courseId);
  }, [courseId]);

  // Trae los estudiantes asignados al curso
  const loadAssigned = async (id) => {
    try {
      const list = await getStudentsSummaryByCourse(id);
      setAssigned(list);
    } catch {
      toast.error('Error al cargar estudiantes asignados');
    }
  };

  // Cambio de curso
  const handleCourseChange = async (option) => {
    setSelectedCourseId(option.value);
    setSelectedToAssign([]);
    await loadAssigned(option.value);
  };

  // Asignar estudiantes
  const handleAssign = async () => {
    if (!selectedCourseId) {
      toast.error('Seleccione un curso primero');
      return;
    }
    if (!selectedToAssign.length) {
      toast.info('Seleccione uno o más estudiantes');
      return;
    }
    const ids = selectedToAssign.map(s => s.id);
    try {
      await assignStudentsToCourse(selectedCourseId, ids);
      toast.success('Estudiante(s) asignado(s)');
      setSelectedToAssign([]);
      await loadAssigned(selectedCourseId);
    } catch {
      toast.error('Error al asignar estudiantes');
    }
  };

  // Remover estudiante
  const handleRemove = async (studentId) => {

    console.log([studentId]);
    
    if (!selectedCourseId) {
      toast.error('Curso no seleccionado');
      return;
    }
    try {
      await removeStudentsFromCourse(selectedCourseId, [studentId]);
      toast.success('Estudiante eliminado del curso');
      await loadAssigned(selectedCourseId);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Filtrar estudiantes no asignados para mostrar solo los que NO están ya asignados
  const filterUnassigned = (students) => {
    const assignedIds = new Set(assigned.map(a => a.id));
    return students.filter(s => !assignedIds.has(s.id));
  };

  return (
    <Modal
      title="Gestión de Estudiantes en Curso"
      trigger={trigger}
      size="xl"
      actions={[{ label: 'Cerrar', className: 'bg-gray-300 text-black' }]}
    >
      <div className="space-y-6">
        {/* Curso */}
        <div>
          <label className="block font-medium mb-1">Curso</label>
          <Select
            options={courses.map(c => ({ value: c.id, label: c.name }))}
            value={
              courses.find(c => c.id === selectedCourseId) && {
                value: selectedCourseId,
                label: courses.find(c => c.id === selectedCourseId).name
              }
            }
            onChange={handleCourseChange}
          />
        </div>

        {/* Buscador y lista de estudiantes (StudentListFetcher) */}
        {selectedCourseId && (
          <div>
            <label className="block font-medium mb-2">
              Buscar y seleccionar estudiante para asignar
            </label>
            <StudentListFetcher>
              {({
                students,
                loading,
                error,
                filters,
                totalPages,
                totalElements,
                onPageChange,
                refetch,
              }) => {
                const unassigned = filterUnassigned(students);

                return (
                  <>
                    {/* Filtros y tabla paginada */}
                    <div className="w-full border rounded-xl shadow-lg bg-white/95">
                      {loading ? (
                        <div className="py-6 text-center">Buscando estudiantes...</div>
                      ) : (
                        <>
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th></th>
                                <th className="p-2 text-left">Nombre</th>
                                <th className="p-2 text-left">DNI</th>
                                <th className="p-2 text-left">Nivel</th>
                                <th className="p-2 text-left">Grado</th>
                                <th className="p-2 text-left">Sección</th>
                              </tr>
                            </thead>
                            <tbody>
                              {unassigned.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="py-4 text-center text-gray-400">No hay estudiantes para mostrar</td>
                                </tr>
                              ) : (
                                unassigned.map(student => (
                                  <tr key={student.id}
                                    className={`border-b hover:bg-blue-50 ${selectedToAssign.some(s => s.id === student.id) ? 'bg-blue-100' : ''}`}>
                                    <td className="p-2">
                                      <input
                                        type="checkbox"
                                        checked={selectedToAssign.some(s => s.id === student.id)}
                                        onChange={() => {
                                          setSelectedToAssign(sel => {
                                            if (sel.some(s => s.id === student.id)) {
                                              return sel.filter(s => s.id !== student.id);
                                            } else {
                                              return [...sel, student];
                                            }
                                          });
                                        }}
                                      />
                                    </td>
                                    <td className="p-2">{student.fullName}</td>
                                    <td className="p-2">{student.dni}</td>
                                    <td className="p-2">{student.schoolLevel}</td>
                                    <td className="p-2">{student.grade}</td>
                                    <td className="p-2">{student.section}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                          {/* Paginación */}
                          <div className="flex justify-center items-center gap-2 py-2">
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
                            <span className="text-xs ml-2 text-gray-500">
                              {totalElements} resultados
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    {/* Botón asignar */}
                    <div className="text-right mt-3">
                      <button
                        onClick={handleAssign}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
                        disabled={selectedToAssign.length === 0}
                      >
                        Asignar estudiante{selectedToAssign.length > 1 ? "s" : ""}
                      </button>
                    </div>
                  </>
                );
              }}
            </StudentListFetcher>
          </div>
        )}

        {/* Listado asignados */}
        <div>
          <h3 className="font-semibold mb-2">Estudiantes asignados</h3>
          <ul className="divide-y border rounded">
            {assigned.length > 0 ? (
              assigned.map(s => (
                <li key={s.id} className="flex justify-between items-center p-2">
                  <span>{s.fullName}</span>
                  <button
                    onClick={() => handleRemove(s.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Quitar
                  </button>
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500 text-sm">
                No hay estudiantes asignados
              </li>
            )}
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default CourseStudentModal;
