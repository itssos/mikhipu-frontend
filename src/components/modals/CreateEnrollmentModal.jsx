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
        { label: 'Cancelar', className: 'btn-adventure-secondary' },
        { label: 'Guardar', onClick: handleSave, className: 'btn-adventure' }
      ]}
    >
      <div className="adventure-create-matricula space-y-4">
        <div>
          <label className="adventure-label">Año</label>
          <input
            type="text"
            placeholder="Año"
            value={form.year}
            onChange={e => handleChange('year', e.target.value)}
            className="adventure-input"
          />
        </div>
        <div>
          <label className="adventure-label">Cuota de matrícula</label>
          <input
            type="number"
            placeholder="Cuota de matrícula"
            value={form.enrollmentFee}
            onChange={e => handleChange('enrollmentFee', e.target.value)}
            className="adventure-input"
          />
        </div>
        <div>
          <label className="adventure-label">Cuota mensual</label>
          <input
            type="number"
            placeholder="Cuota mensual"
            value={form.monthlyFee}
            onChange={e => handleChange('monthlyFee', e.target.value)}
            className="adventure-input"
          />
        </div>
        <div>
          <label className="adventure-label">Estado</label>
          <select
            value={form.status}
            onChange={e => handleChange('status', e.target.value)}
            className="adventure-input"
          >
            {['MATRICULADO', 'RETIRADO', 'ANULADO', 'FINALIZADO'].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="adventure-label">Fecha de matrícula</label>
          <input
            type="date"
            placeholder="Fecha de matrícula"
            value={form.enrollmentDate}
            onChange={e => handleChange('enrollmentDate', e.target.value)}
            className="adventure-input"
          />
        </div>
      </div>
      <style>{`
      .adventure-create-matricula {
        background: #fffbe6;
        border-radius: 16px;
        border: 1.5px solid #e4ca85;
        padding: 16px 18px 10px 18px;
        box-shadow: 0 1.5px 8px #edd08033;
      }
      .adventure-label {
        color: #a47a18;
        font-size: 1.04em;
        font-weight: 600;
        margin-bottom: 2px;
        display: block;
        letter-spacing: .5px;
      }
      .adventure-input {
        width: 100%;
        padding: 10px 14px;
        border-radius: 10px;
        border: 1.5px solid #dfbb74;
        background: #fffdf6;
        font-size: 1em;
        color: #a0873c;
        margin-top: 3px;
        margin-bottom: 0px;
        outline: none;
        box-shadow: 0 1px 4px #e6cf9355;
        transition: border 0.18s, box-shadow 0.18s;
      }
      .adventure-input:focus {
        border-color: #b88a0f;
        box-shadow: 0 0 0 2px #ffe39f80;
        background: #fff9e1;
      }
      .btn-adventure {
        background: linear-gradient(90deg, #ffe39f 0%, #f7c769 100%);
        color: #7d611d;
        font-family: 'Georgia', serif;
        font-weight: bold;
        border-radius: 10px;
        border: 1.5px solid #debb7c;
        padding: 9px 18px;
        box-shadow: 0 1.5px 7px #e6cf934c;
        font-size: 1rem;
        transition: background .18s, color .18s, box-shadow .18s;
      }
      .btn-adventure:hover {
        background: #ffe7bb;
        color: #b88020;
        box-shadow: 0 0 0 2px #ffe8b1;
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
    `}</style>
    </Modal>
  );

};

export default CreateEnrollmentModal;
