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
      bg='bg-transparent'
      shadow={false}
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
      <form className="form-adventure space-y-5 overflow-y-scroll" style={{maxHeight: '75vh'}} id="courseCreate">
        <style>{`
    .form-adventure {
      background: #fffbea url('https://www.transparenttextures.com/patterns/wood-pattern.png');
      border: 4.5px solid #574d32;
      border-radius: 24px 24px 36px 36px;
      box-shadow: 0 0 18px #bca97499, 0 2.5px 10px #4a390f33;
      padding: 2.1rem 1.6rem 2.2rem 1.6rem;
      margin-bottom: 2rem;
      font-family: 'Pirata One', 'Press Start 2P', cursive, monospace;
    }
    .label-adventure {
      font-size: 1rem;
      font-weight: 700;
      color: #574d32;
      letter-spacing: 1px;
      margin-bottom: 4px;
      display: block;
      text-shadow: 1px 1px #fff7ad, 0.5px 2px #b9a97e60;
    }
    .input-adventure, .form-adventure select, .form-adventure textarea {
      border-radius: 11px;
      background: #f6efd3;
      border: 2.7px solid #a38a47;
      padding: 10px 15px;
      font-size: 1.1rem;
      color: #433416;
      margin-bottom: 2px;
      box-shadow: 1px 2.5px 8px #cab06e22;
      font-family: inherit;
      transition: border-color 0.14s, box-shadow 0.14s;
      outline: none;
      width: 100%;
      resize: none;
    }
    .input-adventure:focus, .form-adventure select:focus, .form-adventure textarea:focus {
      border-color: #95702a;
      background: #fff9de;
      box-shadow: 0 0 0 2px #d9bc7155;
    }
    .form-adventure hr {
      border: none;
      border-top: 2px dashed #d7bb7a;
      margin: 1.3rem 0 1.2rem 0;
    }
    .form-adventure ul {
      margin-left: 1.2rem;
      margin-top: 0.6rem;
    }
    .form-adventure li {
      color: #856622;
      margin-bottom: 2px;
      font-size: 1rem;
    }
    .form-adventure h3 {
      font-size: 1.08rem;
      font-weight: bold;
      color: #876f24;
      margin-bottom: 0.3rem;
      margin-top: 0.5rem;
      text-shadow: 0 1px #fff8c4;
    }
    .btn-adventure {
      background: linear-gradient(96deg, #e5bc5e 60%, #b18b39 100%);
      color: #442b01;
      border: 2px solid #a0802a;
      border-radius: 14px;
      padding: 9px 22px;
      font-family: inherit;
      font-weight: 800;
      font-size: 1.07rem;
      letter-spacing: 1.5px;
      box-shadow: 1.5px 2px #cab06e, 1px 2px 5px #e4cf93;
      margin-right: 6px;
      transition: background 0.12s, box-shadow 0.12s;
    }
    .btn-adventure:hover, .btn-adventure:focus {
      background: linear-gradient(96deg, #f1cd72 60%, #a67c1e 100%);
      color: #664e17;
      box-shadow: 0 3px 14px #d4b87a99;
    }
    .btn-adventure-secondary {
      background: linear-gradient(95deg, #ece1b5 70%, #a98f3d 100%);
      color: #715f3a;
      border: 2px solid #bca974;
      border-radius: 14px;
      padding: 9px 17px;
      font-weight: 800;
      font-size: 1rem;
      box-shadow: 1.5px 2px #cab06e55;
      transition: background 0.12s, color 0.12s;
    }
    .btn-adventure-secondary:hover {
      background: linear-gradient(97deg, #dfd4a3 75%, #c2a65d 100%);
      color: #b18b39;
    }
    .btn-adventure-icon {
      background: #ffe7aa;
      border: 2px solid #a0802a;
      border-radius: 50%;
      padding: 4px 10px;
      font-weight: 900;
      font-size: 1.1rem;
      box-shadow: 1px 2.5px 8px #cab06e33;
      color: #856622;
      vertical-align: middle;
      transition: background 0.1s, border-color 0.1s;
    }
    .btn-adventure-icon:hover {
      background: #ffe1aa;
      border-color: #95702a;
    }
  `}</style>
        {/* Datos básicos del curso */}
        <div>
          <label className="label-adventure">Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} className="input-adventure" />
        </div>
        <div>
          <label className="label-adventure">Código</label>
          <input name="code" value={form.code} onChange={handleChange} className="input-adventure" />
        </div>
        <div>
          <label className="label-adventure">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-adventure" rows={2} />
        </div>
        <div>
          <label className="label-adventure">Año</label>
          <input name="year" type="number" value={form.year} onChange={handleChange} className="input-adventure" />
        </div>
        <div>
          <label className="label-adventure">Trimestre</label>
          <select name="quarter" value={form.quarter} onChange={handleChange} className="input-adventure">
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
              <h3>Profesores actuales:</h3>
              <ul>
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
              <label className="label-adventure">Código del profesor principal</label>
              <input
                type="text"
                value={mainTeacherCode}
                onChange={(e) => setMainTeacherCode(e.target.value)}
                className="input-adventure"
              />
            </div>
            <div>
              <label className="label-adventure">Códigos de profesores auxiliares (separados por coma)</label>
              <input
                type="text"
                value={auxiliaryTeacherCodes}
                onChange={(e) => setAuxiliaryTeacherCodes(e.target.value)}
                className="input-adventure"
              />
            </div>
            <button
              type="button"
              onClick={handleAssignTeachers}
              className="btn-adventure"
            >
              Asignar Profesores
            </button>
            <div className="mt-4">
              <label className="label-adventure">Eliminar profesores por código (separados por coma)</label>
              <input
                type="text"
                value={removalTeacherCodes}
                onChange={(e) => setRemovalTeacherCodes(e.target.value)}
                className="input-adventure"
              />
              <button
                type="button"
                onClick={handleRemoveTeachers}
                className="btn-adventure-secondary"
                style={{ marginTop: 6 }}
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
