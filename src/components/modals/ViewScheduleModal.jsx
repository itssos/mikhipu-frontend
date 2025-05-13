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
      {loading ? (
        <p className="text-gray-500">Cargando horarios...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : schedules.length > 0 ? (
        <ul className="space-y-2">
          {schedules.map((sch, i) => (
            <li key={i}>
              <strong>{sch.dayOfWeek}</strong>: {sch.startTime} - Curso ID: {sch.courseId}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No hay horarios asignados.</p>
      )}
    </Modal>
  );
}
