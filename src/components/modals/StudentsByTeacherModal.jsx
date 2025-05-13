import Modal from '../UI/Modal';
import { useState, useEffect } from 'react';
import { getStudentsByTeacher } from '../../api/teachers';

export default function StudentsByTeacherModal({ teacherId, trigger }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teacherId) return;

    setLoading(true);
    setError(null);

    getStudentsByTeacher(teacherId)
      .then((res) => {
        setStudents(res || []);
      })
      .catch((err) => {
        console.error(err);
        setError('No se pudo cargar la lista de estudiantes.');
      })
      .finally(() => setLoading(false));
  }, [teacherId]);

  return (
    <Modal title="Estudiantes del Profesor" trigger={trigger} size="lg">
      {loading ? (
        <p className="text-gray-500">Cargando estudiantes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : students.length > 0 ? (
        <ul className="space-y-2">
          {students.map((student, index) => (
            <li key={index} className="border-b pb-2">
              <strong>{student.person?.firstName} {student.person?.lastName}</strong>
              <div className="text-sm text-gray-600">DNI: {student.person?.dni}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Este profesor no tiene estudiantes asignados.</p>
      )}
    </Modal>
  );
}
