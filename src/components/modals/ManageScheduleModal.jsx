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
      <form className="schedule-form-adventure">
        <div>
          <label className="label-adventure">ID del Curso</label>
          <input
            type="number"
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
            className="input-adventure"
          />
        </div>
        <div>
          <label className="label-adventure">Día de la semana</label>
          <select
            name="dayOfWeek"
            value={form.dayOfWeek}
            onChange={handleChange}
            className="input-adventure"
          >
            {[
              { value: 'MONDAY', label: 'Lunes' },
              { value: 'TUESDAY', label: 'Martes' },
              { value: 'WEDNESDAY', label: 'Miércoles' },
              { value: 'THURSDAY', label: 'Jueves' },
              { value: 'FRIDAY', label: 'Viernes' },
              { value: 'SATURDAY', label: 'Sábado' },
              { value: 'SUNDAY', label: 'Domingo' },
            ].map((day) => (
              <option key={day.value} value={day.value}>{day.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-adventure">Hora de inicio (HH:mm)</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="input-adventure"
          />
        </div>
        <style>{`
        .schedule-form-adventure {
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: #fffbe6;
          border-radius: 16px;
          padding: 18px 14px;
          border: 1.2px solid #ecd487;
          margin-bottom: 10px;
        }
        .input-adventure {
          width: 100%;
          border: 1.2px solid #ecd487;
          background: #fffcf2;
          border-radius: 10px;
          padding: 8px 12px;
          font-size: 15px;
          box-shadow: 0 1.5px 6px #efd89820;
          margin-top: 3px;
          transition: border .2s;
        }
        .input-adventure:focus {
          outline: none;
          border-color: #d4a436;
          background: #fff9df;
        }
        .label-adventure {
          font-size: 14px;
          font-weight: 600;
          color: #947331;
          margin-bottom: 3px;
          display: block;
        }
      `}</style>
      </form>

      <div className="flex gap-2 mt-4">
        <button onClick={handleAssign} className="btn-adventure">
          Asignar
        </button>
        <button onClick={handleDelete} className="btn-adventure-secondary">
          Eliminar
        </button>
      </div>
      <style>{`
      .btn-adventure {
        background: linear-gradient(90deg, #f9d13c, #ffefb0 70%);
        color: #715504;
        font-weight: bold;
        border: 1.5px solid #ecd487;
        border-radius: 10px;
        padding: 8px 18px;
        box-shadow: 0 1.5px 6px #efd8983a;
        cursor: pointer;
        transition: background .18s, box-shadow .18s;
      }
      .btn-adventure:hover {
        background: linear-gradient(90deg, #f7b80c, #fff8df 70%);
        box-shadow: 0 4px 12px #efd89833;
        color: #604e01;
      }
      .btn-adventure-secondary {
        background: #ffeaea;
        color: #a13232;
        font-weight: bold;
        border: 1.5px solid #e0a3a3;
        border-radius: 10px;
        padding: 8px 18px;
        box-shadow: 0 1.5px 6px #f2c0c0a2;
        cursor: pointer;
        transition: background .18s, box-shadow .18s;
      }
      .btn-adventure-secondary:hover {
        background: #ffd3d3;
        color: #900c0c;
        box-shadow: 0 4px 12px #d1868681;
      }
    `}</style>
    </Modal>
  );

}
