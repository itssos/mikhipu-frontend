import { useEffect, useState } from 'react';
import {
  getCourses,
  deleteCourse,
  getCourseById,
  getTeachersOfCourse
} from '../api/courses';
import CourseModal from './modals/CourseModal';
import DeleteButton from './UI/DeleteButton';
import EditButton from './UI/EditButton';

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [reload, setReload] = useState(false);
  const [teacherMap, setTeacherMap] = useState({});

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

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este curso?')) {
      await deleteCourse(id);
      setReload(!reload);
    }
  };

  const handleEdit = async (id) => {
    const res = await getCourseById(id);
    setSelectedCourse(res.data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Administración de Cursos</h1>
      <div className="flex justify-end mb-4">
        <CourseModal
          trigger={<button className="bg-blue-600 text-white px-4 py-2 rounded">Nuevo Curso</button>}
          onSuccess={() => setReload(!reload)}
        />
      </div>

      <div className="w-full overflow-auto rounded-2xl shadow-md shadow-black">
        <table className="w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Código</th>
              <th className="py-2 px-4 border-b">Año</th>
              <th className="py-2 px-4 border-b">Trimestre</th>
              <th className="py-2 px-4 border-b">Profesores</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="text-center">
                <td className="py-2 px-4 border-b">{course.name}</td>
                <td className="py-2 px-4 border-b">{course.code}</td>
                <td className="py-2 px-4 border-b">{course.year}</td>
                <td className="py-2 px-4 border-b">{course.quarter}</td>
                <td className="py-2 px-4 border-b text text-left">
                  {(teacherMap[course.id] || []).map((t) => (
                    <div key={t.id}>
                      <strong>{t.role}</strong>: {t.fullName} ({t.code})
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4 border-b space-x-2">
                  <CourseModal
                    course={course}
                    trigger={<EditButton className="w-8 h-8 p-1" />}
                    onSuccess={() => setReload(!reload)}
                  />
                  <DeleteButton className="w-8 h-8 p-1" onClick={() => handleDelete(course.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
