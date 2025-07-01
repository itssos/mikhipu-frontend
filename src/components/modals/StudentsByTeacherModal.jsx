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
      <div className="students-panel-adventure">
        {loading ? (
          <p className="text-gray-500 adventure-label">Cargando estudiantes...</p>
        ) : error ? (
          <p className="text-red-600 adventure-label">{error}</p>
        ) : students.length > 0 ? (
          <ul className="adventure-list">
            {students.map((student, index) => (
              <li key={index} className="student-card-adventure">
                <div>
                  <strong className="student-name-adventure">
                    {student.person?.firstName} {student.person?.lastName}
                  </strong>
                  <div className="adventure-label">
                    DNI: <span className="adventure-dni">{student.person?.dni}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 adventure-label">Este profesor no tiene estudiantes asignados.</p>
        )}
      </div>
      <style>{`
      .students-panel-adventure {
        background: #fffbe6;
        border-radius: 18px;
        border: 1.2px solid #ecd487;
        padding: 24px 18px;
        min-width: 280px;
        min-height: 90px;
      }
      .adventure-list {
        margin: 0;
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .student-card-adventure {
        background: #fffcf2;
        border-radius: 12px;
        border: 1px dashed #e3bc6a;
        box-shadow: 0 1.5px 6px #efd89824;
        padding: 13px 15px;
        font-size: 16px;
        transition: background .18s;
        display: flex;
        align-items: flex-start;
      }
      .student-card-adventure:hover {
        background: #fff7ce;
      }
      .student-name-adventure {
        font-weight: 700;
        color: #94680d;
      }
      .adventure-label {
        font-size: 14px;
        color: #947331;
        margin-top: 2px;
      }
      .adventure-dni {
        color: #9c7926;
        font-weight: 500;
      }
    `}</style>
    </Modal>
  );

}
