import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getEnrollmentsByStudent } from '../api/enrollments';

import CreateEnrollmentModal from './modals/CreateEnrollmentModal';
import UpdateEnrollmentStatusModal from './modals/UpdateEnrollmentStatusModal';
import ViewEnrollmentsModal from './modals/ViewEnrollmentsModal';
import StudentListFetcher from './student/StudentListFetcher';

export default function EnrollmentManager() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  // Cuando cambia el estudiante seleccionado, recarga matrículas
  useEffect(() => {
    if (!selectedStudent) {
      setEnrollments([]);
      return;
    }
    (async () => {
      try {
        const list = await getEnrollmentsByStudent(selectedStudent.id);
        setEnrollments(list);
      } catch {
        toast.error('Error al cargar matrículas');
      }
    })();
  }, [selectedStudent]);

  // Callback para refrescar desde los modales
  const handleRefresh = () => {
    if (!selectedStudent) return;
    getEnrollmentsByStudent(selectedStudent.id)
      .then(setEnrollments)
      .catch(() => toast.error('Error al recargar matrículas'));
  };

  return (
  <div className="adventure-matricula-main">
    <h2 className="adventure-title">Gestión de Matrículas</h2>

    {/* Buscador y selector de estudiante */}
    <div className="mb-8">
      <label className="block font-semibold mb-2 adventure-label-matricula">Buscar y seleccionar estudiante</label>
      <StudentListFetcher>
        {({ students, filters, loading, error, totalPages, onPageChange }) => (
          <div className="w-full">
            {/* Tabla estilo adventure */}
            <div className="adventure-table-box">
              {loading ? (
                <div className="text-center py-6 adventure-note">Cargando estudiantes...</div>
              ) : error ? (
                <div className="text-red-500 py-4 text-center adventure-note">{error}</div>
              ) : (
                <>
                  <table className="adventure-table w-full text-sm">
                    <thead>
                      <tr>
                        <th className="p-2"></th>
                        <th className="p-2 text-left">Nombre</th>
                        <th className="p-2 text-left">DNI</th>
                        <th className="p-2 text-left">Nivel</th>
                        <th className="p-2 text-left">Grado</th>
                        <th className="p-2 text-left">Sección</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4 adventure-note">
                            No hay estudiantes que coincidan.
                          </td>
                        </tr>
                      ) : students.map(student => (
                        <tr
                          key={student.id}
                          className={`adventure-table-row ${selectedStudent && selectedStudent.id === student.id ? 'adventure-table-row-selected' : ''}`}
                          onClick={() => setSelectedStudent(student)}
                        >
                          <td className="p-2 text-center">
                            <input
                              type="radio"
                              checked={selectedStudent && selectedStudent.id === student.id}
                              readOnly
                            />
                          </td>
                          <td className="p-2">{student.fullName}</td>
                          <td className="p-2">{student.dni}</td>
                          <td className="p-2">{student.schoolLevel}</td>
                          <td className="p-2">{student.grade}</td>
                          <td className="p-2">{student.section}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Paginación */}
                  <div className="adventure-pagination">
                    <button
                      onClick={() => onPageChange(filters.page - 1)}
                      disabled={filters.page === 0}
                      className="btn-adventure-secondary"
                    >
                      Anterior
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => onPageChange(idx)}
                        className={`btn-adventure-page ${filters.page === idx ? 'active' : ''}`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => onPageChange(filters.page + 1)}
                      disabled={filters.page >= totalPages - 1}
                      className="btn-adventure-secondary"
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              )}
            </div>
            {/* Resumen seleccionado */}
            {selectedStudent && (
              <div className="adventure-student-card">
                <div className="adventure-student-info">
                  <div className="adventure-student-title">
                    {selectedStudent.fullName} <span className="adventure-student-dni">({selectedStudent.dni})</span>
                  </div>
                  <div className="adventure-student-tags">
                    <span>Nivel: {selectedStudent.schoolLevel}</span>
                    <span>Grado: {selectedStudent.grade}</span>
                    <span>Sección: {selectedStudent.section}</span>
                  </div>
                  <div className="adventure-student-matricula-count">
                    <b>Matrículas encontradas:</b> {enrollments.length}
                  </div>
                </div>
                <div className="adventure-student-actions">
                  <CreateEnrollmentModal
                    trigger={<button className="btn-adventure">Crear Matrícula</button>}
                    studentId={selectedStudent?.id}
                    onSuccess={handleRefresh}
                  />
                  <UpdateEnrollmentStatusModal
                    trigger={<button className="btn-adventure-warning">Actualizar Estado</button>}
                    studentId={selectedStudent?.id}
                    onSuccess={handleRefresh}
                  />
                  <ViewEnrollmentsModal
                    trigger={<button className="btn-adventure-secondary">Ver Matrículas</button>}
                    enrollments={enrollments}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </StudentListFetcher>
    </div>

    {/* Sugerencia para el usuario si no hay selección */}
    {!selectedStudent && (
      <div className="my-6 text-center text-gray-600 italic text-sm">
        Selecciona un estudiante para ver y gestionar sus matrículas.
      </div>
    )}

    {/* Tarjetas matrícula */}
    <div className="adventure-matricula-cards">
      {enrollments.map(e => (
        <div key={e.id} className="adventure-card-matricula">
          <div className="adventure-card-title">{e.courseName}</div>
          <div className="adventure-card-status">{e.status}</div>
          <div className="adventure-card-year">{e.year}</div>
        </div>
      ))}
    </div>

    {/* Adventure Styles */}
    <style>{`
      .adventure-matricula-main {
        max-width: 1100px;
        margin: 45px auto 0 auto;
        padding: 36px 22px 28px 22px;
        background: linear-gradient(120deg, #f7ecd3 55%, #f7f5eb 100%);
        border-radius: 38px;
        border: 2.5px solid #dfbb74;
        box-shadow: 0 6px 32px #e1c17633;
      }
      .adventure-title-matricula {
        text-align: center;
        font-size: 2rem;
        font-weight: bold;
        color: #b98022;
        letter-spacing: 2px;
        margin-bottom: 2rem;
        text-shadow: 0 2px 10px #e6cf9340;
        font-family: 'Treasure Map Deadhand', 'serif', 'Georgia';
      }
      .adventure-label-matricula {
        color: #8e6b1e;
        font-size: 1.17rem;
      }
      .adventure-table-box {
        border-radius: 17px;
        background: #fffbe9;
        border: 1.5px solid #e2c980;
        box-shadow: 0 2px 16px #d6b05518;
        overflow-x: auto;
      }
      .adventure-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0 3px;
      }
      .adventure-table th, .adventure-table td {
        border-bottom: 1.1px dashed #e0cb97;
        padding: 0.7em 0.7em;
      }
      .adventure-table th {
        background: #f0e3ba;
        color: #886319;
        font-size: 1rem;
        font-weight: 700;
      }
      .adventure-table-row {
        background: #fffcf1;
        cursor: pointer;
        transition: background 0.18s, font-weight 0.18s;
      }
      .adventure-table-row:hover {
        background: #f5edcd;
      }
      .adventure-table-row-selected {
        background: #fde9a6 !important;
        font-weight: bold;
        color: #b88a0f;
        border-left: 3.5px solid #c6a032;
      }
      .adventure-note {
        color: #b59345;
        font-style: italic;
        font-size: 1.1rem;
      }
      .adventure-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 8px;
        padding: 1em 0 0.7em 0;
      }
      .btn-adventure, .btn-adventure-secondary, .btn-adventure-warning, .btn-adventure-page {
        font-family: 'Georgia', serif;
        font-weight: bold;
        border-radius: 10px;
        border: 1.5px solid #debb7c;
        transition: background .18s, color .18s, box-shadow .18s;
        padding: 9px 18px;
        box-shadow: 0 1.5px 7px #e6cf934c;
        font-size: 1rem;
      }
      .btn-adventure {
        background: linear-gradient(90deg, #ffe39f 0%, #f7c769 100%);
        color: #7d611d;
      }
      .btn-adventure:hover {
        background: #ffe7bb;
        color: #b88020;
        box-shadow: 0 0 0 2px #ffe8b1;
      }
      .btn-adventure-secondary {
        background: #f5f3ef;
        color: #85652d;
        border-color: #dbc27f;
      }
      .btn-adventure-secondary:hover {
        background: #e9e3d6;
        color: #ad8a42;
      }
      .btn-adventure-warning {
        background: linear-gradient(90deg, #ffe993 0%, #f7c24d 100%);
        color: #6d5208;
        border-color: #e3bc59;
      }
      .btn-adventure-warning:hover {
        background: #fff3c6;
        color: #ba9b33;
      }
      .btn-adventure-page {
        background: #fdf6e8;
        color: #a38025;
        min-width: 36px;
        border-radius: 8px;
      }
      .btn-adventure-page.active {
        background: #ffd063;
        color: #fff;
        border-color: #ffd063;
        box-shadow: 0 0 0 2px #ffe19477;
      }
      .adventure-student-card {
        display: flex;
        flex-direction: column;
        gap: 20px;
        margin-top: 1.5em;
        background: #fffcf3;
        border: 1.5px solid #e4ca85;
        border-radius: 18px;
        box-shadow: 0 2px 14px #f0e1ac40;
        padding: 24px 22px;
        align-items: stretch;
      }
      @media (min-width: 768px) {
        .adventure-student-card {
          flex-direction: row;
          align-items: center;
        }
      }
      .adventure-student-info {
        flex: 1;
      }
      .adventure-student-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #b2851b;
      }
      .adventure-student-dni {
        color: #a6a6a6;
        font-size: 1.05em;
      }
      .adventure-student-tags {
        display: flex;
        gap: 10px;
        margin-bottom: 6px;
        flex-wrap: wrap;
      }
      .adventure-student-tags span {
        background: #f7e6bb;
        color: #867032;
        border-radius: 7px;
        padding: 2px 11px;
        font-size: 0.97em;
      }
      .adventure-student-matricula-count {
        color: #948235;
        font-size: 0.93em;
      }
      .adventure-student-actions {
        display: flex;
        gap: 13px;
        flex-wrap: wrap;
      }
      .adventure-matricula-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 20px;
        margin-top: 32px;
      }
      .adventure-card-matricula {
        background: #fffbe3;
        border-radius: 17px;
        border: 1.6px solid #e6c178;
        box-shadow: 0 2px 14px #e6cf9342;
        padding: 20px 17px 15px 17px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        min-height: 120px;
        transition: box-shadow 0.18s, transform 0.17s;
      }
      .adventure-card-matricula:hover {
        box-shadow: 0 6px 22px #e1c1763a;
        transform: translateY(-4px) scale(1.01);
      }
      .adventure-card-title {
        color: #b2851b;
        font-size: 1.14rem;
        font-weight: 600;
      }
      .adventure-card-status {
        background: #ffe59c;
        color: #8c6e2c;
        border-radius: 7px;
        padding: 2.5px 13px;
        margin: 7px 0 2px 0;
        font-size: 0.98em;
        font-weight: 500;
      }
      .adventure-card-year {
        color: #bba76d;
        font-size: 0.94em;
      }
    `}</style>
  </div>
);

}
