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
        trigger={<div onClick={open}>{trigger}</div>}
        open={isOpen}
        onClose={close}
        title={studentId ? 'Editar Estudiante' : 'Crear Estudiante'}
        size="xl"
        actions={[
          { label: 'Cancelar', onClick: close, className: 'bg-gray-200 text-gray-700 px-4 py-2 rounded' },
          { label: studentId ? 'Actualizar' : 'Crear', onClick: handleSave, className: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700' }
        ]}
      >
        <div className="space-y-6">
          {/* Persona */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <IdentificationIcon className="w-5 h-5 text-gray-500" />
                <span>Nombre</span>
              </label>
              <input
                type="text"
                value={studentForm.person.firstName}
                onChange={e => handleChange('person.firstName', e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <IdentificationIcon className="w-5 h-5 text-gray-500" />
                <span>Apellido</span>
              </label>
              <input
                type="text"
                value={studentForm.person.lastName}
                onChange={e => handleChange('person.lastName', e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 mb-1">
                <IdentificationIcon className="w-5 h-5 text-gray-500" />
                <span>DNI</span>
              </label>
              <input
                type="text"
                value={studentForm.person.dni}
                onChange={e => handleChange('person.dni', e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <CalendarIcon className="w-5 h-5 text-gray-500" />
                <span>Fecha Nac.</span>
              </label>
              <input
                type="date"
                value={studentForm.person.birthDate}
                onChange={e => handleChange('person.birthDate', e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <UserGroupIcon className="w-5 h-5 text-gray-500" />
                <span>Género</span>
              </label>
              <select
                value={studentForm.person.gender}
                onChange={e => handleChange('person.gender', e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="flex items-center space-x-2 mb-1">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <span>Dirección</span>
              </label>
              <input
                type="text"
                value={studentForm.person.address}
                onChange={e => handleChange('person.address', e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <span>Teléfono</span>
              </label>
              <input
                type="text"
                value={studentForm.person.phone}
                onChange={e => handleChange('person.phone', e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Usuario */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <UserIcon className="w-5 h-5 text-gray-500" />
                <span>Usuario</span>
              </label>
              <input
                type="text"
                value={studentForm.person.user.username}
                onChange={e => handleChange('person.user.username', e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            {!studentId && (
              <div>
                <label className="flex items-center space-x-2 mb-1">
                  <PencilIcon className="w-5 h-5 text-gray-500" />
                  <span>Contraseña</span>
                </label>
                <input
                  type="password"
                  value={studentForm.person.user.password}
                  onChange={e => handleChange('person.user.password', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            )}
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <UserGroupIcon className="w-5 h-5 text-gray-500" />
                <span>Rol</span>
              </label>
              <select
                value={studentForm.person.user.role}
                onChange={e => handleChange('person.user.role', e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="">-- Seleccione --</option>
                {roles.map(r => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <IdentificationIcon className="w-5 h-5 text-gray-500" />
                <span>Email</span>
              </label>
              <input
                type="email"
                value={studentForm.person.user.email}
                onChange={e => handleChange('person.user.email', e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Estudiante */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <AcademicCapIcon className="w-5 h-5 text-gray-500" />
                <span>Grado</span>
              </label>
              <input
                type="number"
                value={studentForm.grade}
                onChange={e => handleChange('grade', e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <IdentificationIcon className="w-5 h-5 text-gray-500" />
                <span>Sección</span>
              </label>
              <select
                value={studentForm.section}
                onChange={e => handleChange('section', e.target.value)}
                className="w-full border p-2 rounded"
              >
                {['A', 'B', 'C', 'D', 'E', 'F'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2 mb-1">
                <AcademicCapIcon className="w-5 h-5 text-gray-500" />
                <span>Nivel</span>
              </label>
              <select
                value={studentForm.schoolLevel}
                onChange={e => handleChange('schoolLevel', e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="INICIAL">Inicial</option>
                <option value="PRIMARIA">Primaria</option>
              </select>
            </div>
            <div className="col-span-3">
              <label className="flex items-center space-x-2 mb-1">
                <UserGroupIcon className="w-5 h-5 text-gray-500" />
                <span>Representantes</span>
              </label>
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
      </Modal>
    </>
  );
};

export default StudentModal;
