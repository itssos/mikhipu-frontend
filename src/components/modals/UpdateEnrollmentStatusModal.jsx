import React, { useState } from 'react';
import Modal from '../UI/Modal';
import { updateEnrollmentStatus } from '../../api/enrollments';
import { toast } from 'react-toastify';

const UpdateEnrollmentStatusModal = ({ trigger, studentId, onSuccess }) => {
  const [form, setForm] = useState({
    year: '',
    status: 'RETIRADO'
  });

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    try {
      const data = {
        studentId,
        year: form.year,
        status: form.status
      };
      await updateEnrollmentStatus(data);
      toast.success('Estado actualizado');
      onSuccess?.();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Modal
      title="Actualizar Estado de Matrícula"
      trigger={trigger}
      size="sm"
      actions={[
        { label: 'Cancelar', className: 'bg-gray-200 text-black' },
        { label: 'Actualizar', onClick: handleSave }
      ]}
    >
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Año"
          value={form.year}
          onChange={e => handleChange('year', e.target.value)}
          className="w-full border p-2 rounded"
        />
        <select
          value={form.status}
          onChange={e => handleChange('status', e.target.value)}
          className="w-full border p-2 rounded"
        >
          {['MATRICULADO', 'RETIRADO', 'ANULADO', 'FINALIZADO'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </Modal>
  );
};

export default UpdateEnrollmentStatusModal;
