import Modal from '../UI/Modal';
import { useState } from 'react';
import { assignTeacherSchedule, deleteTeacherSchedule } from '../../api/teacherSchedules';

export default function ManageScheduleModal({ teacherId, trigger }) {
  const [form, setForm] = useState({
    courseId: '',
    dayOfWeek: 'MONDAY',
    startTime: '08:00',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssign = async () => {
    await assignTeacherSchedule({ teacherId, ...form });
    alert('Horario asignado correctamente');
  };

  const handleDelete = async () => {
    await deleteTeacherSchedule({ teacherId, ...form });
    alert('Horario eliminado correctamente');
  };

  return (
    <Modal title="Administrar Horarios" trigger={trigger} size="md">
      <form className="space-y-4">
        <div>
          <label className="block text-sm">ID del Curso</label>
          <input
            type="number"
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            className="w-full border rounded p-1"
          />
        </div>
        <div>
          <label className="block text-sm">Día de la semana</label>
          <select name="dayOfWeek" value={form.dayOfWeek} onChange={handleChange} className="w-full border rounded p-1">
            {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm">Hora de inicio (HH:mm)</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full border rounded p-1"
          />
        </div>
      </form>

      <div className="flex gap-2 mt-4">
        <button onClick={handleAssign} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Asignar
        </button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Eliminar
        </button>
      </div>
    </Modal>
  );
}
