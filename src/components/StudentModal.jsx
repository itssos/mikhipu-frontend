// src/components/StudentModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from './UI/Modal';
import { getRepresentatives } from '../api/representatives';
import { getRoles } from '../api/roles';
import {
  createStudent,
  getStudentById,
  updateStudent,
  assignRepresentatives,
  removeRepresentatives,
  getStudentRepresentatives
} from '../api/students';
import { toast } from 'react-toastify';
import Select from 'react-select';
import {
  IdentificationIcon,
  CalendarIcon,
  UserGroupIcon,
  UserIcon,
  AcademicCapIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

/**
 * StudentModal: CRUD para estudiante y su usuario, todo en una llamada.
 * Props:
 *   trigger: ReactNode para abrir modal
 *   studentId?: number para edición
 */
const StudentModal = ({ trigger, studentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [reps, setReps] = useState([]);
  const [studentForm, setStudentForm] = useState({
    person: {
      firstName: '',
      lastName: '',
      dni: '',
      birthDate: '',
      gender: 'MASCULINO',
      address: '',
      phone: '',
      user: {
        username: '',
        email: '',
        password: '',
        role: ''
      }
    },
    grade: '',
    section: 'A',
    schoolLevel: 'PRIMARIA',
    representativeIds: []
  });

  const [selectedReps, setSelectedReps] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([getRoles(), getRepresentatives()])
      .then(async ([rolesData, repsData]) => {
        setRoles(rolesData);
        setReps(repsData);

        if (studentId) {
          const s = await getStudentById(studentId);
          const assigned = await getStudentRepresentatives(studentId);
          setStudentForm({
            person: {
              firstName: s.person.firstName,
              lastName: s.person.lastName,
              dni: s.person.dni,
              birthDate: s.person.birthDate,
              gender: s.person.gender,
              address: s.person.address,
              phone: s.person.phone,
              user: {
                username: s.person.user.username,
                email: s.person.user.email,
                password: '',
                role: s.person.user.role
              }
            },
            grade: s.grade.toString(),
            section: s.section,
            schoolLevel: s.schoolLevel
          });
          setSelectedReps(assigned.map(r => ({
            value: r.id,
            label: r.fullName
          })));
        }
      })
      .catch(err => toast.error(err.message));
  }, [isOpen, studentId]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleChange = (path, value) => {
    setStudentForm(prev => {
      const copy = { ...prev };
      let ref = copy;
      const keys = path.split('.');
      keys.slice(0, -1).forEach(k => { ref = ref[k]; });
      ref[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const handleSave = async () => {
    try {
      const dto = {
        person: studentForm.person,
        grade: Number(studentForm.grade),
        section: studentForm.section,
        schoolLevel: studentForm.schoolLevel
      };

      let student;
      if (studentId) {
        await updateStudent(studentId, dto);
        toast.success('Estudiante actualizado');

        const prev = await getStudentRepresentatives(studentId);
        const prevIds = prev.map(r => r.id);
        const newIds = selectedReps.map(r => r.value);

        const toAdd = newIds.filter(id => !prevIds.includes(id));
        const toRemove = prevIds.filter(id => !newIds.includes(id));

        if (toAdd.length > 0)
          await assignRepresentatives(studentId, toAdd);
        if (toRemove.length > 0)
          await removeRepresentatives(studentId, toRemove);

      } else {
        student = await createStudent({ ...dto, representativeIds: [] });
        toast.success('Estudiante creado');

        if (selectedReps.length > 0)
          await assignRepresentatives(student.id, selectedReps.map(r => r.value));
      }

      close();
    } catch (err) {
      toast.error(err.message);
    }
  };


  return (
    <>
      <Modal
        trigger={<div className='flex justify-center items-center' onClick={open}>{trigger}</div>}
        open={isOpen}
        onClose={close}
        bg='panel-adventure'
        classModal='overflow-y-scroll h-96'
        title={studentId ? 'Editar Estudiante' : 'Crear Estudiante'}
        size="xl"
        actions={[
          { label: 'Cancelar', onClick: close, className: 'btn-adventure-secondary' },
          { label: studentId ? 'Actualizar' : 'Crear', onClick: handleSave, className: 'btn-adventure' }
        ]}
      >
        <div className="adventure-form space-y-7">
          {/* Persona */}
          <div className="adventure-grid-2">
            <div>
              <label className="adventure-label"><IdentificationIcon className="icon-adventure" />Nombre</label>
              <input
                type="text"
                value={studentForm.person.firstName}
                onChange={e => handleChange('person.firstName', e.target.value)}
                className="adventure-input"
              />
            </div>
            <div>
              <label className="adventure-label"><IdentificationIcon className="icon-adventure" />Apellido</label>
              <input
                type="text"
                value={studentForm.person.lastName}
                onChange={e => handleChange('person.lastName', e.target.value)}
                className="adventure-input"
              />
            </div>
            <div>
              <label className="adventure-label"><IdentificationIcon className="icon-adventure" />DNI</label>
              <input
                type="text"
                value={studentForm.person.dni}
                onChange={e => handleChange('person.dni', e.target.value)}
                className="adventure-input"
              />
            </div>
            <div>
              <label className="adventure-label"><CalendarIcon className="icon-adventure" />Fecha Nac.</label>
              <input
                type="date"
                value={studentForm.person.birthDate}
                onChange={e => handleChange('person.birthDate', e.target.value)}
                className="adventure-input"
              />
            </div>
            <div>
              <label className="adventure-label"><UserGroupIcon className="icon-adventure" />Género</label>
              <select
                value={studentForm.person.gender}
                onChange={e => handleChange('person.gender', e.target.value)}
                className="adventure-input"
              >
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
            </div>
            <div className="">
              <label className="adventure-label"><UserIcon className="icon-adventure" />Dirección</label>
              <input
                type="text"
                value={studentForm.person.address}
                onChange={e => handleChange('person.address', e.target.value)}
                className="adventure-input"
              />
            </div>
            <div>
              <label className="adventure-label"><UserIcon className="icon-adventure" />Teléfono</label>
              <input
                type="text"
                value={studentForm.person.phone}
                onChange={e => handleChange('person.phone', e.target.value)}
                className="adventure-input"
              />
            </div>
          </div>

          {/* Usuario */}
          <div className="adventure-grid-2">
            <div>
              <label className="adventure-label"><UserIcon className="icon-adventure" />Usuario</label>
              <input
                type="text"
                value={studentForm.person.user.username}
                onChange={e => handleChange('person.user.username', e.target.value)}
                className="adventure-input"
              />
            </div>
            {!studentId && (
              <div>
                <label className="adventure-label"><PencilIcon className="icon-adventure" />Contraseña</label>
                <input
                  type="password"
                  value={studentForm.person.user.password}
                  onChange={e => handleChange('person.user.password', e.target.value)}
                  className="adventure-input"
                />
              </div>
            )}
            <div>
              <label className="adventure-label"><UserGroupIcon className="icon-adventure" />Rol</label>
              <select
                value={studentForm.person.user.role}
                onChange={e => handleChange('person.user.role', e.target.value)}
                className="adventure-input"
              >
                <option value="">-- Seleccione --</option>
                {roles.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="adventure-label"><IdentificationIcon className="icon-adventure" />Email</label>
              <input
                type="email"
                value={studentForm.person.user.email}
                onChange={e => handleChange('person.user.email', e.target.value)}
                className="adventure-input"
              />
            </div>
          </div>

          {/* Estudiante */}
          <div className="adventure-grid-3">
            <div>
              <label className="adventure-label"><AcademicCapIcon className="icon-adventure" />Grado</label>
              <input
                type="number"
                value={studentForm.grade}
                onChange={e => handleChange('grade', e.target.value)}
                className="adventure-input"
              />
            </div>
            <div>
              <label className="adventure-label"><IdentificationIcon className="icon-adventure" />Sección</label>
              <select
                value={studentForm.section}
                onChange={e => handleChange('section', e.target.value)}
                className="adventure-input"
              >
                {['A', 'B', 'C', 'D', 'E', 'F'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="adventure-label"><AcademicCapIcon className="icon-adventure" />Nivel</label>
              <select
                value={studentForm.schoolLevel}
                onChange={e => handleChange('schoolLevel', e.target.value)}
                className="adventure-input"
              >
                <option value="INICIAL">Inicial</option>
                <option value="PRIMARIA">Primaria</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="adventure-label"><UserGroupIcon className="icon-adventure" />Representantes</label>
              <Select
                isMulti
                options={reps.map(r => ({
                  value: r.id,
                  label: `${r.person.firstName} ${r.person.lastName} (${r.relationship})`
                }))}
                value={selectedReps}
                onChange={setSelectedReps}
                className="w-full"
              />
            </div>
          </div>
        </div>
        <style>{`
        .adventure-form {
          font-family: 'Georgia', serif;
        }
        .adventure-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .adventure-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }
        .adventure-label {
          font-weight: bold;
          margin-bottom: 5px;
          font-family: 'Georgia', serif;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 1em;
        }
        .adventure-input {
          border: 1.5px solid #e4ca85;
          border-radius: 9px;
          padding: 9px 13px;
          font-size: 1em;
          background: #fffef7;
          font-family: 'Georgia', serif;
          box-shadow: 0 1px 6px #efdfba33;
          transition: border-color .18s, box-shadow .18s;
        }
        .adventure-input:focus {
          border-color: #b99329;
          outline: none;
          box-shadow: 0 0 0 2px #edd68c66;
          background: #fffbe8;
        }
        .icon-adventure {
          width: 20px;
          height: 20px;
        }
        .btn-adventure {
          background: linear-gradient(90deg, #edd392 30%, #bba05a 100%);
          color: #5b440e;
          border: none;
          font-family: 'Georgia', serif;
          border-radius: 11px;
          font-weight: bold;
          padding: 9px 21px;
          font-size: 1rem;
          box-shadow: 0 2px 10px #ecd18c33;
          transition: background .18s, color .18s;
        }
        .btn-adventure:hover {
          background: linear-gradient(90deg, #ffe8b8 15%, #b48a34 100%);
          color: #836a24;
        }
        .btn-adventure-secondary {
          background: #f5f3ef;
          color: #85652d;
          border-radius: 10px;
          border: 1.5px solid #dbc27f;
          font-family: 'Georgia', serif;
          font-weight: bold;
          padding: 9px 18px;
          font-size: 1rem;
          transition: background .18s, color .18s;
        }
        .btn-adventure-secondary:hover {
          background: #e9e3d6;
          color: #ad8a42;
        }
        /* --------- RESPONSIVE --------- */
        @media (max-width: 1020px) {
          .adventure-form {
            font-size: 0.98em;
          }
          .adventure-grid-2,
          .adventure-grid-3 {
            gap: 16px;
          }
        }
        @media (max-width: 800px) {
          .adventure-grid-2,
          .adventure-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 14px;
          }
          .col-span-3 {
            grid-column: auto !important;
          }
        }
        @media (max-width: 600px) {
          .adventure-form {
            font-size: 0.96em;
            padding: 0 2px;
          }
          .adventure-label {
            font-size: 0.98em;
            gap: 4px;
          }
          .adventure-input {
            padding: 7px 9px;
            font-size: 0.99em;
          }
          .btn-adventure,
          .btn-adventure-secondary {
            font-size: 0.98em;
            padding: 8px 14px;
          }
          .icon-adventure {
            width: 18px;
            height: 18px;
          }
        }
        @media (max-width: 440px) {
          .adventure-form {
            font-size: 0.95em;
          }
          .adventure-label {
            font-size: 0.93em;
            gap: 2px;
          }
          .adventure-input {
            padding: 6px 7px;
            font-size: 0.95em;
          }
          .btn-adventure,
          .btn-adventure-secondary {
            font-size: 0.92em;
            padding: 7px 8px;
            border-radius: 7px;
          }
          .icon-adventure {
            width: 15px;
            height: 15px;
          }
        }
        /* Ajuste para react-select (Representantes) */
        .adventure-form .css-13cymwt-control,
        .adventure-form .css-t3ipsp-control {
          min-height: 34px !important;
          border-radius: 7px !important;
          font-size: 0.99em !important;
        }
        @media (max-width: 600px) {
          .adventure-form .css-13cymwt-control,
          .adventure-form .css-t3ipsp-control {
            min-height: 28px !important;
            font-size: 0.96em !important;
          }
        }
        @media (max-width: 440px) {
          .adventure-form .css-13cymwt-control,
          .adventure-form .css-t3ipsp-control {
            min-height: 25px !important;
            font-size: 0.93em !important;
          }
        }
      `}</style>
      </Modal>
    </>
  );

};

export default StudentModal;
