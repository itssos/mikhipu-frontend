import React from 'react';
import Modal from '../UI/Modal';

const ViewEnrollmentsModal = ({ trigger, enrollments }) => {
  return (
    <Modal
      title="Matrículas del Estudiante"
      trigger={trigger}
      size="lg"
      actions={[{ label: 'Cerrar', className: 'bg-gray-200 text-black' }]}
    >
      {enrollments.length > 0 ? (
        <ul className="text-sm space-y-2">
          {enrollments.map(e => (
            <li key={e.id} className="border p-2 rounded">
              <div><strong>Año:</strong> {e.year}</div>
              <div><strong>Estado:</strong> {e.status}</div>
              <div><strong>Matrícula:</strong> S/ {e.enrollmentFee}</div>
              <div><strong>Mensualidad:</strong> S/ {e.monthlyFee}</div>
              <div><strong>Fecha:</strong> {e.enrollmentDate}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No hay matrículas para este estudiante.</p>
      )}
    </Modal>
  );
};

export default ViewEnrollmentsModal;
