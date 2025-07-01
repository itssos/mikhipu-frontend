import React from 'react';
import Modal from '../UI/Modal';

const ViewEnrollmentsModal = ({ trigger, enrollments }) => {
  return (
    <Modal
      title="Matrículas del Estudiante"
      trigger={trigger}
      size="lg"
      actions={[{ label: 'Cerrar', className: 'btn-adventure-secondary' }]}
    >
      {enrollments.length > 0 ? (
        <ul className="adventure-enroll-list space-y-3">
          {enrollments.map(e => (
            <li key={e.id} className="adventure-enroll-card">
              <div><span className="adventure-enroll-label">Año:</span> <span className="adventure-enroll-value">{e.year}</span></div>
              <div><span className="adventure-enroll-label">Estado:</span> <span className="adventure-enroll-value">{e.status}</span></div>
              <div><span className="adventure-enroll-label">Matrícula:</span> <span className="adventure-enroll-value">S/ {e.enrollmentFee}</span></div>
              <div><span className="adventure-enroll-label">Mensualidad:</span> <span className="adventure-enroll-value">S/ {e.monthlyFee}</span></div>
              <div><span className="adventure-enroll-label">Fecha:</span> <span className="adventure-enroll-value">{e.enrollmentDate}</span></div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="adventure-no-enroll">No hay matrículas para este estudiante.</p>
      )}
      <style>{`
      .adventure-enroll-list {
        padding: 0;
        margin: 0;
      }
      .adventure-enroll-card {
        background: #fffbe6;
        border: 1.7px solid #e4ca85;
        border-radius: 14px;
        box-shadow: 0 1px 7px #e6cf9355;
        padding: 17px 18px 12px 18px;
        font-family: 'Georgia', serif;
        font-size: 1.07em;
        color: #7c661c;
        transition: box-shadow .17s;
      }
      .adventure-enroll-card:hover {
        box-shadow: 0 2px 14px #e1b85188;
      }
      .adventure-enroll-label {
        font-weight: bold;
        color: #ae8508;
        font-family: 'Georgia', serif;
        margin-right: 5px;
      }
      .adventure-enroll-value {
        color: #8e7015;
        font-family: 'Georgia', serif;
        letter-spacing: 0.2px;
      }
      .adventure-no-enroll {
        color: #c2a24a;
        font-style: italic;
        background: #f9f5e4;
        border-radius: 10px;
        padding: 20px 10px;
        font-family: 'Georgia', serif;
        text-align: center;
        margin: 20px 0 6px 0;
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

export default ViewEnrollmentsModal;
