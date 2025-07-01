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
    <div className="adventure-tools">
      <form onSubmit={handleSubmit} className="adventure-row">
        <label className="adventure-label">ID del Profesor:</label>
        <input
          type="number"
          value={teacherId}
          onChange={e => setTeacherId(e.target.value)}
          className="input-adventure w-36"
          placeholder="Ej: 12"
        />
        <button
          type="submit"
          className="btn-adventure"
          style={{ minWidth: 90 }}
        >
          Cargar
        </button>
      </form>

      {validId && (
        <div className="adventure-btn-row">
          <ViewScheduleModal
            teacherId={validId}
            trigger={
              <button className="btn-adventure" style={{ background: "#a3f085", borderColor: "#4ea84e" }}>
                Ver Horarios
              </button>
            }
          />
          <ManageScheduleModal
            teacherId={validId}
            trigger={
              <button className="btn-adventure" style={{ background: "#a5b4fc", borderColor: "#6366f1" }}>
                Gestionar Horarios
              </button>
            }
          />
          <StudentsByTeacherModal
            teacherId={validId}
            trigger={
              <button className="btn-adventure" style={{ background: "#e9b7fd", borderColor: "#a21caf" }}>
                Ver Estudiantes
              </button>
            }
          />
        </div>
      )}

      <style>{`
      .adventure-tools {
        background: #fffbe6;
        border-radius: 18px;
        box-shadow: 0 6px 24px #efd89877;
        padding: 36px 22px;
        margin: 24px auto 0 auto;
        max-width: 510px;
        min-width: 320px;
      }
      .adventure-row {
        display: flex;
        align-items: center;
        gap: 18px;
        margin-bottom: 14px;
      }
      .adventure-label {
        font-family: inherit;
        font-size: 15px;
        font-weight: bold;
        color: #876f24;
      }
      .input-adventure {
        font-family: inherit;
        border-radius: 9px;
        border: 2px solid #b99c4c;
        padding: 8px 12px;
        font-size: 15px;
        box-shadow: 1px 2px #e8dfb555;
        outline: none;
        transition: border-color .14s;
        background: #fff;
      }
      .input-adventure:focus {
        border-color: #95702a;
        background: #f7f0d0;
      }
      .btn-adventure {
        font-family: inherit;
        font-weight: 700;
        border-radius: 9px;
        padding: 8px 22px;
        font-size: 15px;
        border: 2.2px solid #95702a;
        background: #ffe08b;
        color: #6e540b;
        box-shadow: 1px 2px #e8dfb5;
        cursor: pointer;
        transition: all .14s;
      }
      .btn-adventure:hover {
        background: #fff4ca;
        color: #3a2900;
        border-color: #bfa157;
        box-shadow: 1px 3px 8px #ffe4a622;
      }
      .adventure-btn-row {
        display: flex;
        gap: 18px;
        flex-wrap: wrap;
        margin-top: 14px;
        justify-content: flex-start;
      }
      @media (max-width: 530px) {
        .adventure-tools {
          padding: 22px 6px;
        }
        .adventure-row, .adventure-btn-row {
          flex-direction: column;
          align-items: stretch;
          gap: 11px;
        }
      }
    `}</style>
    </div>
  );

}
