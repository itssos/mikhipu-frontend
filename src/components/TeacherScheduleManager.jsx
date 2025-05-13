import { useState } from 'react';
import ViewScheduleModal from './modals/ViewScheduleModal';
import ManageScheduleModal from './modals/ManageScheduleModal';
import StudentsByTeacherModal from './modals/StudentsByTeacherModal';

export default function TeacherScheduleManager() {
  const [teacherId, setTeacherId] = useState('');
  const [validId, setValidId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = parseInt(teacherId, 10);
    if (!isNaN(id) && id > 0) {
      setValidId(id);
    } else {
      alert('Ingresa un ID de profesor válido');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <label className="text-sm font-medium">ID del Profesor:</label>
        <input
          type="number"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="border p-1 rounded w-32"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cargar
        </button>
      </form>

      {validId && (
        <div className="flex gap-4">
          <ViewScheduleModal
            teacherId={validId}
            trigger={
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Ver Horarios
              </button>
            }
          />
          <ManageScheduleModal
            teacherId={validId}
            trigger={
              <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Gestionar Horarios
              </button>
            }
          />
          <StudentsByTeacherModal
            teacherId={validId}
            trigger={<button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Ver Estudiantes</button>}
          />

        </div>
      )}
    </div>
  );
}
