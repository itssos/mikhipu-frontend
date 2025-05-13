import React, { useState, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { getStudents } from '../api/students';
import { getEnrollmentsByStudent } from '../api/enrollments';
import { toast } from 'react-toastify';

import CreateEnrollmentModal from './modals/CreateEnrollmentModal';
import UpdateEnrollmentStatusModal from './modals/UpdateEnrollmentStatusModal';
import ViewEnrollmentsModal from './modals/ViewEnrollmentsModal';

export default function EnrollmentManager() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  // Carga de opciones para el AsyncSelect de estudiantes
  const loadStudentOptions = async (inputValue) => {
    if (!inputValue) return [];
    try {
      const [byName, byDni] = await Promise.all([
        getStudents({ name: inputValue }),
        getStudents({ dni: inputValue })
      ]);
      const combined = [...byName, ...byDni];
      const unique = Array.from(
        new Map(combined.map(s => [s.id, s])).values()
      );
      return unique.map(s => ({
        value: s.id,
        label: `${s.fullName} (${s.dni})`
      }));
    } catch {
      toast.error('Error al buscar estudiantes');
      return [];
    }
  };

  // Cuando cambia el estudiante seleccionado, recarga matrículas
  useEffect(() => {
    if (!selectedStudent) {
      setEnrollments([]);
      return;
    }
    (async () => {
      try {
        const list = await getEnrollmentsByStudent(selectedStudent.value);
        setEnrollments(list);
      } catch {
        toast.error('Error al cargar matrículas');
      }
    })();
  }, [selectedStudent]);

  // Callback para pasar a los modales
  const handleRefresh = () => {
    if (!selectedStudent) return;
    getEnrollmentsByStudent(selectedStudent.value)
      .then(setEnrollments)
      .catch(() => toast.error('Error al recargar matrículas'));
  };

  return (
    <div className="space-y-6 p-4">
      {/* Buscador global de Estudiante */}
      <div>
        <label className="block font-medium mb-1">Seleccionar Estudiante</label>
        <AsyncSelect
          cacheOptions
          loadOptions={loadStudentOptions}
          onChange={setSelectedStudent}
          placeholder="Buscar por nombre o DNI..."
        />
      </div>

      {/* Botones / Modales */}
      <div className="flex space-x-4 w-full">
        <CreateEnrollmentModal
          trigger={<button className="bg-green-500 hover:bg-green-400 transition-all duration-300 text-white px-4 py-2 rounded cursor-pointer">Crear Matrícula</button>}
          studentId={selectedStudent?.value}
          onSuccess={handleRefresh}
        />

        <UpdateEnrollmentStatusModal
          trigger={<button className="bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 text-black px-4 py-2 rounded cursor-pointer">Actualizar Estado</button>}
          studentId={selectedStudent?.value}
          onSuccess={handleRefresh}
        />

        <ViewEnrollmentsModal
          trigger={<button className="bg-blue-500 hover:bg-blue-400 transition-all duration-300 text-white px-4 py-2 rounded cursor-pointer">Ver Matrículas</button>}
          enrollments={enrollments}
        />
      </div>
    </div>
  );
}
