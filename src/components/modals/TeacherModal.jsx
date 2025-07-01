import React, { useState, useEffect } from 'react';
import Modal from '../UI/Modal';
import { createTeacher, updateTeacher, getTeacherById } from '../../api/teachers';
import { getRoles } from '../../api/roles';
import { toast } from 'react-toastify';
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
          { label: 'Cancelar', onClick: close, className: 'btn-adventure-secondary' },
          { label: teacherId ? 'Actualizar' : 'Crear', onClick: handleSave, className: 'btn-adventure' }
        ]}
      >
        <div className="adventure-panel-modal">
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Nombre" icon={<IdentificationIcon />} value={form.person.firstName} onChange={e => handleChange('person.firstName', e.target.value)} />
            <InputField label="Apellido" icon={<IdentificationIcon />} value={form.person.lastName} onChange={e => handleChange('person.lastName', e.target.value)} />
            <InputField label="DNI" icon={<IdentificationIcon />} value={form.person.dni} onChange={e => handleChange('person.dni', e.target.value)} />
            <InputField label="Fecha Nac." type="date" icon={<CalendarIcon />} value={form.person.birthDate} onChange={e => handleChange('person.birthDate', e.target.value)} />
            <div>
              <label className="adventure-label"><UserGroupIcon className="w-5 h-5 text-gray-500" /><span>Género</span></label>
              <select className="adventure-input" value={form.person.gender} onChange={e => handleChange('person.gender', e.target.value)}>
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
              <label className="adventure-label"><UserGroupIcon className="w-5 h-5 text-gray-500" /><span>Rol</span></label>
              <select className="adventure-input" value={form.person.user.role} onChange={e => handleChange('person.user.role', e.target.value)}>
                <option value="">-- Seleccione --</option>
                {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
            </div>
            <InputField label="Email" type="email" icon={<IdentificationIcon />} value={form.person.user.email} onChange={e => handleChange('person.user.email', e.target.value)} />
          </div>
          <InputField label="Código Docente" icon={<IdentificationIcon />} value={form.code} onChange={e => handleChange('code', e.target.value)} />
        </div>
        <style>{`
          .adventure-panel-modal {
            background: #fffbe6;
            border-radius: 20px;
            border: 1.5px solid #ebcb88;
            box-shadow: 0 2px 14px #e6cf9340;
            padding: 28px 20px;
            margin-top: 7px;
          }
          .adventure-input {
            width: 100%;
            padding: 8px 12px;
            border: 1.2px solid #e2c980;
            border-radius: 10px;
            background: #fffcf2;
            font-size: 15px;
            color: #7d611d;
            outline: none;
            transition: border-color .2s, box-shadow .2s;
          }
          .adventure-input:focus {
            border-color: #d6ab41;
            box-shadow: 0 0 0 2px #ffe9b1;
          }
          .adventure-label {
            display: flex;
            align-items: center;
            gap: 7px;
            color: #9c7c1d;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
          }
        `}</style>
      </Modal>
    </>
  );
};

const InputField = ({ label, value, onChange, icon, type = 'text' }) => (
  <div>
    <label className="adventure-label"><small>{icon}</small><span>{label}</span></label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="adventure-input"
    />
  </div>
);

export default TeacherModal;
