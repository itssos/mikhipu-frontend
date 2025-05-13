import React, { useEffect, useState } from 'react';
import Modal from '../UI/Modal';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import {
  getCourses,
  assignStudentsToCourse,
  removeStudentsFromCourse,
  getStudentsSummaryByCourse
} from '../../api/courses';
import { getStudents } from '../../api/students';
import { toast } from 'react-toastify';

const CourseStudentModal = ({ trigger, courseId }) => {
  const [courses, setCourses] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || null);

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

  // Búsqueda global por fullName o dni
  const loadStudentOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const byName = await getStudents({ name: inputValue });
      const byDni  = await getStudents({ dni: inputValue });
      const combined = [...byName, ...byDni];
      // Eliminar duplicados
      const unique = Array.from(
        new Map(combined.map(s => [s.id, s])).values()
      );
      return unique.map(s => ({
        value: s.id,
        label: `${s.fullName} (${s.dni})`
      }));
    } catch {
      toast.error('Error en búsqueda de estudiantes');
      return [];
    }
  };

  // Cambio de curso
  const handleCourseChange = async (option) => {
    setSelectedCourseId(option.value);
    await loadAssigned(option.value);
  };

  // Asignar estudiantes
  const handleAssign = async (options) => {
    if (!selectedCourseId) {
      toast.error('Seleccione un curso primero');
      return;
    }
    const ids = options.map(o => o.value);
    try {
      await assignStudentsToCourse(selectedCourseId, ids);
      toast.success('Estudiante(s) asignado(s)');
      await loadAssigned(selectedCourseId);
    } catch {
      toast.error('Error al asignar estudiantes');
    }
  };

  // Remover estudiante (payload { studentIds: [id] })
  const handleRemove = async (studentId) => {
    if (!selectedCourseId) {
      toast.error('Curso no seleccionado');
      return;
    }
    try {     
      await removeStudentsFromCourse(selectedCourseId, [studentId]);
      toast.success('Estudiante eliminado del curso');
      await loadAssigned(selectedCourseId);
    } catch {
      toast.error('Error al eliminar estudiante');
    }
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

        {/* Buscador global */}
        <div>
          <label className="block font-medium mb-1">Buscar y asignar estudiante</label>
          <AsyncSelect
            isMulti
            cacheOptions
            loadOptions={loadStudentOptions}
            placeholder="Buscar por nombre o DNI..."
            onChange={handleAssign}
          />
        </div>

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
