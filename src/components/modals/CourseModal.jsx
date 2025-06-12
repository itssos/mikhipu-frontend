import Modal from '../UI/Modal';
import { useState, useEffect } from 'react';
import {
  createCourse,
  updateCourse,
  assignTeachersToCourse,
  removeTeachersFromCourse,
  getTeachersOfCourse
} from '../../api/courses';

export default function CourseModal({ trigger, course = null, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    year: '',
    quarter: 'PRIMER',
  });

  const [mainTeacherCode, setMainTeacherCode] = useState('');
  const [auxiliaryTeacherCodes, setAuxiliaryTeacherCodes] = useState('');
  const [removalTeacherCodes, setRemovalTeacherCodes] = useState('');
  const [assignedTeachers, setAssignedTeachers] = useState([]);

  useEffect(() => {
    if (course?.id) {
      getTeachersOfCourse(course.id)
        .then((res) => setAssignedTeachers(res || []))
        .catch(() => setAssignedTeachers([]));
    }
  }, [course?.id]);

  useEffect(() => {
    if (course) {
      setForm({
        name: course.name || '',
        code: course.code || '',
        description: course.description || '',
        year: course.year || '',
        quarter: course.quarter || 'PRIMER',
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (course?.id) {
        await updateCourse(course.id, form);
      } else {
        await createCourse(form);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error. Revisa la consola.');
    }
  };

  const handleAssignTeachers = async () => {
    if (!course?.id) return alert('Guarda primero el curso antes de asignar profesores.');
    try {
      await assignTeachersToCourse(course.id, {
        mainTeacherCode,
        auxiliaryTeacherCodes: auxiliaryTeacherCodes.split(',').map((code) => code.trim()).filter(Boolean),
      });
      alert('Profesores asignados correctamente.');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert('Error al asignar profesores.');
    }
  };

  const handleRemoveTeachers = async () => {
    if (!course?.id) return alert('Guarda primero el curso antes de eliminar profesores.');
    try {
      await removeTeachersFromCourse(course.id, {
        teacherCodes: removalTeacherCodes.split(',').map((code) => code.trim()).filter(Boolean),
      });
      alert('Profesores eliminados correctamente.');
      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar profesores.');
    }
  };

  return (
    <Modal
      title={course ? 'Editar Curso' : 'Nuevo Curso'}
      trigger={trigger}
      size="lg"
      actions={[
        {
          label: 'Guardar',
          onClick: handleSubmit,
        },
        {
          label: 'Cancelar',
          className: 'bg-gray-300 text-black hover:bg-gray-400',
          closeOnClick: true,
        },
      ]}
    >
      <form className="space-y-4" id="courseCreate">
        {/* Datos básicos del curso */}
        <div>
          <label className="block text-sm">Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded p-1" />
        </div>
        <div>
          <label className="block text-sm">Código</label>
          <input name="code" value={form.code} onChange={handleChange} className="w-full border rounded p-1" />
        </div>
        <div>
          <label className="block text-sm">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded p-1" />
        </div>
        <div>
          <label className="block text-sm">Año</label>
          <input name="year" type="number" value={form.year} onChange={handleChange} className="w-full border rounded p-1" />
        </div>
        <div>
          <label className="block text-sm">Trimestre</label>
          <select name="quarter" value={form.quarter} onChange={handleChange} className="w-full border rounded p-1">
            {['PRIMER', 'SEGUNDO', 'TERCER', 'VERANO'].map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        {/* Asignación de profesores */}
        {course?.id && (
          <>
            <hr />
            <div>
              <h3 className="font-semibold text-sm mb-2">Profesores actuales:</h3>
              <ul className="text-sm mb-4 space-y-1">
                {assignedTeachers.map((t) => (
                  <li key={t.id}>
                    <strong>{t.role}</strong>: {t.fullName} ({t.code})
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {course?.id && (
          <>
            <hr />
            <div>
              <label className="block text-sm font-medium mb-1">Código del profesor principal</label>
              <input
                type="text"
                value={mainTeacherCode}
                onChange={(e) => setMainTeacherCode(e.target.value)}
                className="w-full border rounded p-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Códigos de profesores auxiliares (separados por coma)</label>
              <input
                type="text"
                value={auxiliaryTeacherCodes}
                onChange={(e) => setAuxiliaryTeacherCodes(e.target.value)}
                className="w-full border rounded p-1"
              />
            </div>

            <button
              type="button"
              onClick={handleAssignTeachers}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
            >
              Asignar Profesores
            </button>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Eliminar profesores por código (separados por coma)</label>
              <input
                type="text"
                value={removalTeacherCodes}
                onChange={(e) => setRemovalTeacherCodes(e.target.value)}
                className="w-full border rounded p-1"
              />
              <button
                type="button"
                onClick={handleRemoveTeachers}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-2"
              >
                Eliminar Profesores
              </button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
