// src/components/TeacherModal.jsx
import React, { useState, useEffect } from 'react';
import Modal from '../UI/Modal';
import { createTeacher, updateTeacher, getTeacherById } from '../../api/teachers';
import { getRoles } from '../../api/roles';
import { toast} from 'react-toastify';
import {
  IdentificationIcon,
  CalendarIcon,
  UserIcon,
  UserGroupIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const TeacherModal = ({ trigger, teacherId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
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
    code: ''
  });

  useEffect(() => {
    if (!isOpen) return;

    getRoles().then(setRoles).catch(err => toast.error(err.message));

    if (teacherId) {
      getTeacherById(teacherId).then(t => {
        setForm({
          person: {
            ...t.person,
            user: {
              ...t.person.user,
              password: '' // clear password field
            }
          },
          code: t.code || ''
        });
      }).catch(err => toast.error(err.message));
    }
  }, [isOpen, teacherId]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleChange = (path, value) => {
    setForm(prev => {
      const updated = { ...prev };
      let ref = updated;
      const keys = path.split('.');
      keys.slice(0, -1).forEach(k => { ref = ref[k]; });
      ref[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      if (teacherId) {
        await updateTeacher(teacherId, form);
        toast.success('Docente actualizado');
      } else {
        await createTeacher(form);
        toast.success('Docente creado');
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
        title={teacherId ? 'Editar Docente' : 'Crear Docente'}
        size="xl"
        actions={[
          { label: 'Cancelar', onClick: close, className: 'bg-gray-200 text-gray-700 px-4 py-2 rounded' },
          { label: teacherId ? 'Actualizar' : 'Crear', onClick: handleSave, className: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700' }
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Nombre" icon={<IdentificationIcon />} value={form.person.firstName} onChange={e => handleChange('person.firstName', e.target.value)} />
            <InputField label="Apellido" icon={<IdentificationIcon />} value={form.person.lastName} onChange={e => handleChange('person.lastName', e.target.value)} />
            <InputField label="DNI" icon={<IdentificationIcon />} value={form.person.dni} onChange={e => handleChange('person.dni', e.target.value)} />
            <InputField label="Fecha Nac." type="date" icon={<CalendarIcon />} value={form.person.birthDate} onChange={e => handleChange('person.birthDate', e.target.value)} />
            <div>
              <label className="flex items-center space-x-2 mb-1"><UserGroupIcon className="w-5 h-5 text-gray-500" /><span>Género</span></label>
              <select className="w-full border p-2 rounded" value={form.person.gender} onChange={e => handleChange('person.gender', e.target.value)}>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
            </div>
            <InputField label="Dirección" icon={<UserIcon />} value={form.person.address} onChange={e => handleChange('person.address', e.target.value)} />
            <InputField label="Teléfono" icon={<UserIcon />} value={form.person.phone} onChange={e => handleChange('person.phone', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Usuario" icon={<UserIcon />} value={form.person.user.username} onChange={e => handleChange('person.user.username', e.target.value)} />
            {!teacherId && (
              <InputField label="Contraseña" type="password" icon={<PencilIcon />} value={form.person.user.password} onChange={e => handleChange('person.user.password', e.target.value)} />
            )}
            <div>
              <label className="flex items-center space-x-2 mb-1"><UserGroupIcon className="w-5 h-5 text-gray-500" /><span>Rol</span></label>
              <select className="w-full border p-2 rounded" value={form.person.user.role} onChange={e => handleChange('person.user.role', e.target.value)}>
                <option value="">-- Seleccione --</option>
                {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <InputField label="Email" type="email" icon={<IdentificationIcon />} value={form.person.user.email} onChange={e => handleChange('person.user.email', e.target.value)} />
          </div>
          <InputField label="Código Docente" icon={<IdentificationIcon />} value={form.code} onChange={e => handleChange('code', e.target.value)} />
        </div>
      </Modal>
    </>
  );
};

const InputField = ({ label, value, onChange, icon, type = 'text' }) => (
  <div>
    <label className="flex items-center space-x-2 mb-1 h-8 w-8">{icon}<span>{label}</span></label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border p-2 rounded"
    />
  </div>
);

export default TeacherModal;
