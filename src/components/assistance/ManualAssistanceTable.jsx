import React, { useState } from "react";
import { toast } from "react-toastify";
import { registerAssistanceEntry, registerAssistanceExit } from "../../api/assistance";
import StudentListFetcher from "../student/StudentListFetcher";
import { CheckCircleIcon, XCircleIcon, ArrowRightCircleIcon, ArrowLeftCircleIcon } from "@heroicons/react/24/solid";

const STATUS_COLORS = {
  PRESENTE: "bg-green-200 text-green-900",
  TARDANZA: "bg-yellow-200 text-yellow-900",
  AUSENTE: "bg-red-200 text-red-900",
  SALIDA_REGULAR: "bg-blue-200 text-blue-900",
  SALIDA_ANTICIPADA: "bg-pink-200 text-pink-900",
  null: "bg-gray-100 text-gray-500"
};

function StatusBadge({ status }) {
  if (!status) return <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-500">-</span>;
  const color = STATUS_COLORS[status] || "bg-gray-200 text-gray-700";
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${color}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function ManualAssistanceTable() {
  // Estado para mostrar el resultado por estudiante
  const [lastMark, setLastMark] = useState({}); // { [studentId]: { type: 'entry' | 'exit', data: AssistanceRecordResponseDTO } }

  // Función para marcar asistencia
  const handleMark = async (student, type) => {
    try {
      let res;
      if (type === "entry") {
        res = await registerAssistanceEntry({ studentId: student.id });
        toast.success(`Entrada registrada para ${student.fullName}`);
      } else {
        res = await registerAssistanceExit({ studentId: student.id });
        toast.success(`Salida registrada para ${student.fullName}`);
      }
      setLastMark((prev) => ({
        ...prev,
        [student.id]: { type, data: res }
      }));
    } catch (err) {
      toast.error("Error al marcar asistencia: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="manual-asist-root max-w-6xl mx-auto px-4 py-8">
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Pirata+One&display=swap');
      .manual-asist-root {
        font-family: 'Pirata One', cursive, monospace;
      }
      .manual-asist-title {
        font-size: 2rem;
        font-weight: 800;
        color: #184ea3;
        text-align: center;
        margin-bottom: 2.2rem;
        text-shadow: 1px 2px #fff8ec, 2px 5px 12px #a7bcf530;
      }
      .manual-asist-card {
        border-radius: 30px;
        border: 6px solid #d5c287;
        background: linear-gradient(123deg, #fffce9 65%, #e2e8f0 100%);
        box-shadow: 0 0 40px #f6e7aa88, 0 2px 16px #4669ac13;
        padding: 2.6rem 1.7rem 2.2rem 1.7rem;
      }
      .manual-asist-table {
        width: 100%;
        border-spacing: 0;
        border-collapse: separate;
        border-radius: 24px;
        overflow: hidden;
        background: #fffefb;
        font-family: inherit;
      }
      .manual-asist-table th, .manual-asist-table td {
        font-size: 1.05rem;
        padding: 13px 10px;
        vertical-align: middle;
      }
      .manual-asist-table th {
        background: #f8eebf;
        color: #174173;
        border-bottom: 2px solid #e8e3be;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
      }
      .manual-asist-table tr {
        transition: background 0.14s;
      }
      .manual-asist-table tr:hover {
        background: #e6f0fe !important;
      }
      .manual-asist-btn {
        font-family: inherit;
        border: none;
        border-radius: 11px;
        font-weight: 700;
        box-shadow: 0 2px 9px #e4e4e433;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1rem;
        transition: background 0.14s, color 0.1s, box-shadow 0.11s;
        outline: none;
      }
      .manual-asist-btn.entry {
        background: linear-gradient(90deg, #32b660, #22c55e 80%);
        color: #fffbea;
        padding: 7px 16px;
      }
      .manual-asist-btn.entry:hover { background: #17a84c; }
      .manual-asist-btn.exit {
        background: linear-gradient(90deg, #2563eb, #387ff3 80%);
        color: #fffbea;
        padding: 7px 16px;
      }
      .manual-asist-btn.exit:hover { background: #174ea6; }
      .manual-asist-badge {
        border-radius: 8px;
        background: #ffe7b7;
        color: #d97706;
        font-weight: 600;
        padding: 2px 12px;
        font-size: 0.90rem;
        display: inline-block;
        margin-top: 2px;
      }
      .manual-asist-last-action {
        color: #6b7280;
        font-size: 0.94rem;
      }
      .manual-asist-last-action .edit-label {
        color: #e11d48;
        font-weight: bold;
        margin-left: 5px;
      }
      .manual-asist-pagin {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 0.55rem;
        margin-top: 1.7rem;
      }
      .manual-asist-pagin button {
        border-radius: 10px;
        border: none;
        font-family: inherit;
        font-weight: bold;
        padding: 7px 17px;
        font-size: 1rem;
        background: #e2e8f0;
        color: #174173;
        transition: background 0.13s, color 0.1s;
      }
      .manual-asist-pagin button[disabled] {
        opacity: 0.55;
        cursor: not-allowed;
      }
      .manual-asist-pagin button.active,
      .manual-asist-pagin button:focus {
        background: #2563eb;
        color: #fff;
      }
    `}</style>

      <h2 className="manual-asist-title">
        Asistencia Manual de Estudiantes
      </h2>

      <div className="manual-asist-card">
        <StudentListFetcher>
          {({ students, filters, loading, error, totalPages, onPageChange }) => (
            <>
              <div className="w-full overflow-x-auto rounded-2xl shadow border mb-4 bg-white/95">
                {loading ? (
                  <div className="text-center py-6 text-lg animate-pulse text-blue-700">Cargando estudiantes...</div>
                ) : error ? (
                  <div className="text-red-500 py-6 text-center">{error}</div>
                ) : (
                  <table className="manual-asist-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th className="text-left">Nombre</th>
                        <th className="text-left">DNI</th>
                        <th className="text-left">Nivel</th>
                        <th className="text-left">Grado</th>
                        <th className="text-left">Sección</th>
                        <th className="text-center">Entrada</th>
                        <th className="text-center">Salida</th>
                        <th className="text-center">Última acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-4 text-gray-400">
                            No hay estudiantes que coincidan con los filtros.
                          </td>
                        </tr>
                      ) : students.map((student) => {
                        const mark = lastMark[student.id];
                        const record = mark?.data;

                        return (
                          <tr key={student.id}>
                            <td className="text-center">
                              <CheckCircleIcon className="w-6 h-6 text-blue-300" />
                            </td>
                            <td className="font-semibold">{student.fullName}</td>
                            <td>{student.dni}</td>
                            <td>{student.schoolLevel}</td>
                            <td>{student.grade}</td>
                            <td>{student.section}</td>
                            <td className="text-center">
                              <button
                                className="manual-asist-btn entry"
                                onClick={() => handleMark(student, "entry")}
                              >
                                <ArrowRightCircleIcon className="w-5 h-5" />
                                Entrada
                              </button>
                              {mark?.type === "entry" && record?.entryStatus && (
                                <div className="manual-asist-badge">
                                  <StatusBadge status={record.entryStatus} />
                                </div>
                              )}
                            </td>
                            <td className="text-center">
                              <button
                                className="manual-asist-btn exit"
                                onClick={() => handleMark(student, "exit")}
                              >
                                <ArrowLeftCircleIcon className="w-5 h-5" />
                                Salida
                              </button>
                              {mark?.type === "exit" && record?.exitStatus && (
                                <div className="manual-asist-badge">
                                  <StatusBadge status={record.exitStatus} />
                                </div>
                              )}
                            </td>
                            <td className="text-center">
                              {mark ? (
                                <div className="flex flex-col items-center gap-1 manual-asist-last-action">
                                  <span>
                                    {mark.type === "entry"
                                      ? `Entrada: ${record?.entryMarkedAt?.replace("T", " ")?.substring(0, 16) || "-"}`
                                      : `Salida: ${record?.exitMarkedAt?.replace("T", " ")?.substring(0, 16) || "-"}`}
                                  </span>
                                  {record?.edited && (
                                    <span className="edit-label">Editado Manual</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-xs">Sin marcar</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
              {/* Paginación */}
              <div className="manual-asist-pagin">
                <button
                  onClick={() => onPageChange(filters.page - 1)}
                  disabled={filters.page === 0}
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPageChange(idx)}
                    className={filters.page === idx ? "active" : ""}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(filters.page + 1)}
                  disabled={filters.page >= totalPages - 1}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </StudentListFetcher>
      </div>
    </div>
  );

}
