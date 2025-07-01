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
      actions={[{ label: 'Cerrar', className: 'btn-adventure-secondary' }]}
    >
      <div className="adventure-form overflow-y-scroll space-y-7">
        {/* Curso */}
        <div>
          <label className="adventure-label mb-1">Curso</label>
          <Select
            options={courses.map(c => ({ value: c.id, label: c.name }))}
            value={
              courses.find(c => c.id === selectedCourseId) && {
                value: selectedCourseId,
                label: courses.find(c => c.id === selectedCourseId).name
              }
            }
            onChange={handleCourseChange}
            className="adventure-select"
          />
        </div>

        {/* Buscador y lista de estudiantes */}
        {selectedCourseId && (
          <div>
            <label className="adventure-label mb-2">
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
                    <div className="adventure-panel w-full">
                      {loading ? (
                        <div className="py-7 text-center adventure-note">Buscando estudiantes...</div>
                      ) : (
                        <>
                          <table className="adventure-table w-full text-sm">
                            <thead>
                              <tr>
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
                                  <td colSpan={6} className="py-4 text-center adventure-note">No hay estudiantes para mostrar</td>
                                </tr>
                              ) : (
                                unassigned.map(student => (
                                  <tr key={student.id}
                                    className={`border-b adventure-row hover:bg-yellow-50 ${selectedToAssign.some(s => s.id === student.id) ? 'bg-yellow-100' : ''}`}>
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
                              className="btn-adventure-secondary"
                            >
                              Anterior
                            </button>
                            {Array.from({ length: totalPages }).map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => onPageChange(idx)}
                                className={`btn-adventure-mini ${filters.page === idx
                                  ? "active"
                                  : ""
                                  }`}
                              >
                                {idx + 1}
                              </button>
                            ))}
                            <button
                              onClick={() => onPageChange(filters.page + 1)}
                              disabled={filters.page >= totalPages - 1}
                              className="btn-adventure-secondary"
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
                    <div className="text-right mt-4">
                      <button
                        onClick={handleAssign}
                        className="btn-adventure"
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
          <h3 className="adventure-label mb-2">Estudiantes asignados</h3>
          <ul className="divide-y border rounded-xl bg-white shadow adventure-list">
            {assigned.length > 0 ? (
              assigned.map(s => (
                <li key={s.id} className="flex justify-between items-center p-2">
                  <span>{s.fullName}</span>
                  <button
                    onClick={() => handleRemove(s.id)}
                    className="text-xs btn-adventure-mini bg-red-200 hover:bg-red-300 text-red-800"
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
      <style>{`
      .adventure-form {
        font-family: 'Georgia', serif;
        height: 70vh;
      }
      .adventure-panel {
        background: #fff9ed;
        border: 1.7px solid #e6d2a5;
        border-radius: 15px;
        padding: 17px 14px;
        margin-bottom: 10px;
        box-shadow: 0 2px 12px #eddec4aa;

      }
      .adventure-label {
        color: #b89325;
        font-weight: bold;
        font-family: 'Georgia', serif;
        font-size: 1.05em;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .adventure-table th, .adventure-table td {
        border-bottom: 1.2px dashed #e0c170;
        padding: 7px 6px;
      }
      .adventure-table th {
        background: #f8ecd7;
        color: #967427;
        font-weight: bold;
        font-size: 0.98em;
      }
      .adventure-table tbody tr {
        transition: background .16s;
      }
      .adventure-table tbody tr.adventure-row:hover {
        background: #f8efcb !important;
      }
      .adventure-table input[type="checkbox"] {
        width: 17px;
        height: 17px;
        accent-color: #bb9e52;
      }
      .btn-adventure, .btn-adventure-secondary, .btn-adventure-mini {
        font-family: 'Georgia', serif;
        border-radius: 10px;
        font-weight: bold;
        transition: background .16s, color .16s;
      }
      .btn-adventure {
        background: linear-gradient(90deg, #ecd18c 10%, #c6a258 90%);
        color: #604a14;
        border: none;
        padding: 9px 20px;
        font-size: 1rem;
        box-shadow: 0 2px 9px #ecd99a44;
      }
      .btn-adventure:hover {
        background: linear-gradient(90deg, #ffe7b4 10%, #b89325 90%);
        color: #7d640c;
      }
      .btn-adventure-secondary {
        background: #f9f6ed;
        color: #8c7a4c;
        border: 1.2px solid #d5be80;
        padding: 9px 19px;
        font-size: 1rem;
      }
      .btn-adventure-secondary:hover {
        background: #f0e5c5;
        color: #b39334;
      }
      .btn-adventure-mini {
        background: #f3e2c0;
        color: #95702a;
        border: 1.1px solid #e1c98a;
        padding: 5px 14px;
        font-size: 0.96em;
        margin: 0 2px;
      }
      .btn-adventure-mini.active, .btn-adventure-mini:active {
        background: #c7a96a;
        color: #fff;
      }
      .adventure-list {
        margin-top: 0.5rem;
      }
      .adventure-list li {
        background: #f9f6ed;
        border-radius: 8px;
        margin: 2px 0;
      }
      .adventure-note {
        font-family: 'Georgia', serif;
        color: #b99329;
        font-style: italic;
        background: #fff9ed;
        border-radius: 8px;
        padding: 8px 0;
      }
    `}</style>
    </Modal>
  );

};

export default CourseStudentModal;
