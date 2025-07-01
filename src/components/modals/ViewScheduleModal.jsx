import Modal from '../UI/Modal';
import { useEffect, useState } from 'react';
import { getTeacherSchedules } from '../../api/teacherSchedules';

export default function ViewScheduleModal({ teacherId, trigger }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (teacherId) {
      setLoading(true);
      setError(null);
      getTeacherSchedules({ teacherId })
        .then((res) => {
          console.log(res);

          setSchedules(res || []);
        })
        .catch((err) => {
          console.error(err);
          setError('No se pudo cargar el horario.');
        })
        .finally(() => setLoading(false));
    }
  }, [teacherId]);

  return (
    <Modal title="Horarios del Profesor" trigger={trigger} size="lg">
      <div className="schedule-modal-content">
        {loading ? (
          <p className="schedule-note">Cargando horarios...</p>
        ) : error ? (
          <p className="schedule-error">{error}</p>
        ) : schedules.length > 0 ? (
          <ul className="schedule-list">
            {schedules.map((sch, i) => (
              <li key={i} className="schedule-list-item">
                <span className="schedule-day">{sch.dayOfWeek}</span>
                <span className="schedule-time">{sch.startTime}</span>
                <span className="schedule-course">Curso ID: <b>{sch.courseId}</b></span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="schedule-note">No hay horarios asignados.</p>
        )}

        <style>{`
        .schedule-modal-content {
          padding: 12px 2px 2px 2px;
        }
        .schedule-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .schedule-list-item {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #fffbe6;
          border: 1.2px solid #ecd487;
          border-radius: 8px;
          margin-bottom: 8px;
          padding: 10px 14px;
          box-shadow: 0 2px 6px #efd89818;
          font-size: 16px;
        }
        .schedule-day {
          font-weight: bold;
          color: #ad7f1a;
          min-width: 82px;
          display: inline-block;
        }
        .schedule-time {
          color: #765900;
          font-weight: 600;
          min-width: 80px;
        }
        .schedule-course {
          color: #5f4d10;
          font-size: 15px;
        }
        .schedule-note {
          color: #947331;
          font-size: 15px;
          background: #fffbec;
          padding: 10px 0;
          border-radius: 8px;
          text-align: center;
        }
        .schedule-error {
          color: #dc2626;
          font-size: 15px;
          padding: 12px 0;
          background: #fff1f1;
          border-radius: 8px;
          text-align: center;
        }
      `}</style>
      </div>
    </Modal>
  );

}
