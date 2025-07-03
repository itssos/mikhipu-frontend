import { useEffect, useState } from 'react';
import {
  getCourses,
  deleteCourse,
  getCourseById,
  getTeachersOfCourse,
  getStudentsSummaryByCourse,
} from '../api/courses';
import CourseModal from './modals/CourseModal';
import DeleteButton from './UI/DeleteButton';
import EditButton from './UI/EditButton';
import Modal from './UI/Modal';
import ChatRoom from './chat/ChatRoom';
import useCan from '../hooks/useCan';
import useRol from '../hooks/useRol';

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [reload, setReload] = useState(false);
  const [teacherMap, setTeacherMap] = useState({});
  const [studentsData, setStudentsData] = useState({});
  const [loadingStudents, setLoadingStudents] = useState({});

  const canCreate = useCan('CREATE_COURSE');
  const canUpdate = useCan('UPDATE_COURSE');
  const canDelete = useCan('DELETE_COURSE');
  const isStudent = useRol(['ESTUDIANTE']);
  const isTeacher = useRol(['DOCENTE']);

  // Cargar cursos y profesores
  const fetchCourses = async () => {
    try {
      const res = await getCourses();
      const coursesData = res || [];
      setCourses(coursesData);

      const teacherPromises = coursesData.map((c) =>
        getTeachersOfCourse(c.id).then((res) => [c.id, res || []])
      );

      const results = await Promise.all(teacherPromises);
      const map = Object.fromEntries(results);
      setTeacherMap(map);
    } catch (err) {
      console.error('Error cargando cursos o profesores:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [reload]);

  // Manejar la carga de estudiantes solo al abrir modal de cada curso
  const handleOpenStudentsModal = async (courseId) => {
    document.getElementById(`trigger-estudiantes-${courseId}`).click();
    if (studentsData[courseId]) return;
    setLoadingStudents((prev) => ({ ...prev, [courseId]: true }));
    try {
      const res = await getStudentsSummaryByCourse(courseId);
      setStudentsData((prev) => ({ ...prev, [courseId]: res }));
    } catch {
      setStudentsData((prev) => ({ ...prev, [courseId]: [] }));
    } finally {
      setLoadingStudents((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      await deleteCourse(id);
      setReload(!reload);
    }
  };

  const handleEdit = async (id) => {
    const res = await getCourseById(id);
    setSelectedCourse(res);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="adventure-title ">Administración de Cursos</h1>
      <div className="flex justify-end mb-7">
        {canCreate && (
          <CourseModal
            trigger={<button className="btn-adventure">Nuevo Curso</button>}
            onSuccess={() => setReload(!reload)}
          />
        )}
      </div>
      <div className="panel-adventure" style={{ overflowX: 'auto' }}>
        <table className="table-adventure">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Código</th>
              <th>Año</th>
              <th>Trimestre</th>
              <th>Profesores</th>
              {isTeacher && (
                <th>Estudiantes</th>
              )}
              {isStudent && (
                <th>Chat Profesor</th>
              )}
              <th>Chat Curso</th>
              {(canUpdate || canDelete) && (
                <th>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.year}</td>
                <td>{course.quarter}</td>
                <td>
                  {(teacherMap[course.id] || []).map((t) => (
                    <div key={t.id}>
                      <b>{t.role}</b>: {t.fullName} ({t.code})
                    </div>
                  ))}
                </td>
                {/* Botón Estudiantes */}
                {isTeacher && (
                  <td>
                    {/* Trigger invisible para Modal */}
                    <Modal
                      bg="bg-transparent"
                      shadow={false}
                      size="xl"
                      trigger={
                        <button
                          style={{ display: 'none' }}
                          id={`trigger-estudiantes-${course.id}`}
                          tabIndex={-1}
                        >
                          Ver estudiantes
                        </button>
                      }
                    >
                      {loadingStudents[course.id] ? (
                        <div className="py-10 text-center">Cargando estudiantes...</div>
                      ) : (
                        <div style={{ minWidth: 370 }}>
                          {(studentsData[course.id]?.length ?? 0) === 0 ? (
                            <div className="note-adventure text-center">
                              No hay estudiantes en este curso.
                            </div>
                          ) : (
                            studentsData[course.id].map((student) => (
                              <div
                                key={student.id}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  borderBottom: '1.2px dashed #95702a',
                                  padding: '11px 0',
                                  gap: 4
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: 700 }}>{student.fullName}</div>
                                  <div style={{ fontSize: 13, color: '#876f24', marginTop: 2 }}>
                                    DNI: {student.dni} · Grado: {student.grade} · Sección: {student.section} · {student.schoolLevel}
                                  </div>
                                </div>
                                {/* Modal de chat individual */}
                                <Modal
                                  size="xl"
                                  bg="bg-transparent"
                                  shadow={false}
                                  trigger={
                                    <button className="btn-adventure">
                                      Chat
                                    </button>
                                  }
                                >
                                  <ChatRoom toUserId={student.userId} />
                                </Modal>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </Modal>
                    {/* Botón visible que dispara el trigger invisible */}
                    <button
                      className="btn-adventure-secondary"
                      style={{ marginTop: 3 }}
                      onClick={() => handleOpenStudentsModal(course.id)}
                    >
                      Ver estudiantes
                    </button>
                  </td>
                )}
                {/* Chat directo a profesor */}
                {isStudent && (
                  <td>
                    {(teacherMap[course.id] || []).map((t) => (
                      <Modal
                        key={t.id}
                        bg="bg-transparent"
                        shadow={false}
                        trigger={
                          <button className="btn-adventure">
                            Chat
                          </button>
                        }
                        size="xl"
                      >
                        <ChatRoom toUserId={t.userId} />
                      </Modal>
                    ))}
                  </td>
                )}
                {/* Chat grupal del curso */}
                <td>
                  <Modal
                    bg="bg-transparent"
                    shadow={false}
                    trigger={
                      <button className="btn-adventure">Chat</button>
                    }
                    size="xl"
                  >
                    <ChatRoom courseId={course.id} />
                  </Modal>
                </td>
                {/* Acciones */}
                {(canUpdate || canDelete) && (
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {canUpdate && (
                      <CourseModal
                        course={course}
                        trigger={<button className="btn-adventure-icon" style={{ fontSize: 16 }}>✏️</button>}
                        onSuccess={() => setReload(!reload)}
                      />
                    )}
                    {canDelete && (
                      <button
                        className="btn-adventure-secondary"
                        style={{ marginLeft: 4 }}
                        onClick={() => handleDelete(course.id)}
                      >🗑️</button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
