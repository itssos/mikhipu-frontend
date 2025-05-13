import React, { useState } from 'react';
import Modal from '../UI/Modal';
import { createEnrollment } from '../../api/enrollments';
import { toast } from 'react-toastify';

const CreateEnrollmentModal = ({ trigger, studentId, onSuccess }) => {
  const [form, setForm] = useState({
    year: '',
    enrollmentFee: '',
    monthlyFee: '',
    status: 'MATRICULADO',
    enrollmentDate: ''
  });

  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    try {
      const data = {
        studentId,
        year: form.year,
        enrollmentFee: Number(form.enrollmentFee),
        monthlyFee: Number(form.monthlyFee),
        status: form.status,
        enrollmentDate: form.enrollmentDate
      };
      await createEnrollment(data);
      toast.success('Matrícula creada');
      onSuccess?.();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Modal
      title="Crear Matrícula"
      trigger={trigger}
      size="md"
      actions={[
        { label: 'Cancelar', className: 'bg-gray-200 text-black' },
        { label: 'Guardar', onClick: handleSave }
      ]}
    >
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Año"
          value={form.year}
          onChange={e => handleChange('year', e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          placeholder="Cuota de matrícula"
          value={form.enrollmentFee}
          onChange={e => handleChange('enrollmentFee', e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          placeholder="Cuota mensual"
          value={form.monthlyFee}
          onChange={e => handleChange('monthlyFee', e.target.value)}
          className="w-full border rounded p-2"
        />
        <select
          value={form.status}
          onChange={e => handleChange('status', e.target.value)}
          className="w-full border p-2 rounded"
        >
          {['MATRICULADO', 'RETIRADO', 'ANULADO', 'FINALIZADO'].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Fecha de matrícula"
          value={form.enrollmentDate}
          onChange={e => handleChange('enrollmentDate', e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>
    </Modal>
  );
};

export default CreateEnrollmentModal;
