import React, { useState } from "react";
import {
  getAssistanceRecords,
  editAssistanceRecord
} from "../../api/assistance";
import { toast } from "react-toastify";
import AssistanceFilterFetcher from "./AssistanceFilterFetcher"; // Importa tu fetcher aquí

const ENTRY_STATUS = [
  { value: "", label: "Todos" },
  { value: "PRESENTE", label: "Presente" },
  { value: "TARDANZA", label: "Tardanza" },
  { value: "AUSENTE", label: "Ausente" },
  { value: "NO_MARCADA", label: "No marcada" }
];

const EXIT_STATUS = [
  { value: "", label: "Todos" },
  { value: "SALIDA_REGULAR", label: "Salida regular" },
  { value: "SALIDA_ANTICIPADA", label: "Salida anticipada" },
  { value: "NO_MARCADA", label: "No marcada" }
];

export default function AssistanceRecordsList() {
  // Edición de registro
  const [editing, setEditing] = useState(null);
  const [editEntryStatus, setEditEntryStatus] = useState("");
  const [editExitStatus, setEditExitStatus] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Abre modal de edición
  const handleEdit = (rec) => {
    setEditing(rec);
    setEditEntryStatus(rec.entryStatus);
    setEditExitStatus(rec.exitStatus);
  };

  // Guarda edición
  const handleSaveEdit = async (refetch) => {
    setSavingEdit(true);
    try {
      await editAssistanceRecord(editing.id, {
        entryStatus: editEntryStatus,
        exitStatus: editExitStatus
      });
      toast.success("Registro actualizado");
      setEditing(null);
      refetch();
    } catch {
      toast.error("Error al actualizar");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="asist-records-panel max-w-4xl mx-auto mt-10 mb-8">
      <style>{`
      .asist-records-panel {
        background: #f8f3e0;
        border: 7px solid #c5a96c;
        border-radius: 28px;
        box-shadow: 0 0 32px #0005, 0 2px 18px #e5d9b355;
        font-family: 'Pirata One', cursive, monospace;
        padding: 2.5rem 2rem 1.5rem 2rem;
      }
      .asist-tbl-title {
        font-size: 1.5rem;
        color: #a78437;
        margin-bottom: 1.6rem;
        text-shadow: 0 1.5px #fffdf4, 2px 4px 14px #c1b06e44;
        font-family: 'Pirata One', cursive;
        letter-spacing: 1.1px;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .asist-table {
        border-radius: 16px;
        overflow: scroll;
        box-shadow: 0 2px 14px #e1c89455;
        background: #fdfae9;
        font-family: inherit;
      }
      .asist-table th, .asist-table td {
        font-size: 1rem;
        padding: 12px 10px;
      }
      .asist-table th {
        background: #fff3ce;
        color: #8b7032;
        font-weight: bold;
        border-bottom: 2px solid #e6ddbb;
      }
      .asist-table tr {
        transition: background 0.16s;
      }
      .asist-table tr:hover {
        background: #fbeaa0 !important;
      }
      .asist-table td {
        color: #6c5522;
      }
      .asist-edit-btn {
        background: linear-gradient(90deg, #f4b63e, #e3a720 80%);
        color: #fff6e0;
        border: none;
        border-radius: 12px;
        padding: 6px 17px;
        font-size: 0.93rem;
        font-weight: bold;
        box-shadow: 0 1.5px 7px #e6bb5055;
        cursor: pointer;
        transition: background .13s, box-shadow .12s;
      }
      .asist-edit-btn:hover { background: #dcae3e; color: #fff; }
      .asist-pagination {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        align-items: flex-end;
        margin-top: 1.2rem;
      }
      @media (min-width: 640px) {
        .asist-pagination { flex-direction: row; align-items: center; justify-content: space-between; }
      }
      .asist-modal-bg {
        background: rgba(55, 48, 7, 0.33);
        z-index: 50;
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .asist-modal {
        background: #fffbe7;
        border: 6px solid #c5a96c;
        border-radius: 18px;
        box-shadow: 0 10px 38px #96772a33, 0 4px 20px #ad934788;
        max-width: 370px;
        min-width: 320px;
        width: 97%;
        padding: 2.2rem 2rem 1.4rem 2rem;
        position: relative;
        font-family: inherit;
      }
      .asist-modal-title {
        font-size: 1.25rem;
        color: #886d2a;
        margin-bottom: 1.4rem;
        font-family: 'Pirata One', cursive;
      }
      .asist-modal-btn {
        border: none;
        border-radius: 13px;
        padding: 8px 19px;
        font-weight: bold;
        background: #458be2;
        color: #fffbea;
        font-family: 'Pirata One', cursive;
        margin-left: 8px;
        transition: background .13s;
      }
      .asist-modal-btn:hover { background: #2563eb; }
      .asist-modal-cancel {
        background: #f6f3e7;
        color: #8b7b32;
      }
      .asist-select, .asist-size-select {
        padding: 7px 13px;
        border-radius: 10px;
        border: 2px solid #e9d9a6;
        background: #f8f6ee;
        color: #745b23;
        font-size: 1rem;
        font-family: 'Pirata One', cursive;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        transition: border .13s;
      }
      .asist-select:focus, .asist-size-select:focus {
        border-color: #a78437;
        outline: none;
      }
    `}</style>

      <h2 className="asist-tbl-title">
        <svg width="24" height="24" fill="none" stroke="#a78437" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 3v18h18M3 17l6-6 4 4 8-8" />
        </svg>
        Registros de Asistencia
      </h2>

      <AssistanceFilterFetcher fetchFunction={getAssistanceRecords}>
        {({
          content: records,
          filters,
          loading,
          error,
          totalPages,
          totalElements,
          onPageChange,
          refetch,
        }) => (
          <>
            {/* Tabla */}
            <div className="mb-4 asist-table">
              <table className="">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Apellido</th>
                    <th>Nombre</th>
                    <th>Nivel</th>
                    <th>Grado</th>
                    <th>Sección</th>
                    <th>Estado entrada</th>
                    <th>Estado salida</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-gray-400">
                        <span className="animate-spin inline-block mr-2">&#9696;</span>
                        Cargando...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-8 text-gray-400">
                        Sin resultados.
                      </td>
                    </tr>
                  ) : (
                    records.map(rec => (
                      <tr key={rec.id} className="border-b last:border-b-0">
                        <td>{rec.date}</td>
                        <td>{rec.lastName}</td>
                        <td>{rec.firstName}</td>
                        <td>{rec.schoolLevel || "-"}</td>
                        <td>{rec.grade || "-"}</td>
                        <td>{rec.section || "-"}</td>
                        <td>{rec.entryStatus}</td>
                        <td>{rec.exitStatus}</td>
                        <td className="text-center">
                          <button
                            className="asist-edit-btn"
                            onClick={() => handleEdit(rec)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="asist-pagination w-full flex flex-col sm:flex-row sm:justify-between items-center gap-2 mt-5 mb-2 px-2">
              {/* Texto de cantidad */}
              <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                <span className="text-sm sm:text-base text-yellow-900 text-center">
                  {totalElements > 0 &&
                    `Mostrando ${filters.page * filters.size + 1}-${Math.min((filters.page + 1) * filters.size, totalElements)} de ${totalElements} registros`
                  }
                </span>
              </div>
              {/* Botones y select */}
              <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
                <button
                  className="asist-edit-btn asist-modal-cancel px-2 sm:px-3 py-1 rounded text-sm sm:text-base"
                  onClick={() => onPageChange(filters.page - 1)}
                  disabled={filters.page === 0}
                >
                  Anterior
                </button>
                <span className="text-sm sm:text-base font-bold text-yellow-900 px-1">
                  {(filters.page + 1)} / {totalPages || 1}
                </span>
                <button
                  className="asist-edit-btn px-2 sm:px-3 py-1 rounded text-sm sm:text-base"
                  onClick={() => onPageChange(filters.page + 1)}
                  disabled={filters.page + 1 >= totalPages}
                >
                  Siguiente
                </button>
                <select
                  className="asist-size-select border rounded px-2 py-1 text-sm sm:text-base bg-white ml-2"
                  value={filters.size}
                  onChange={e => onPageChange(0, parseInt(e.target.value))}
                >
                  {[10, 20, 30, 50, 100].map(s => (
                    <option key={s} value={s}>{s} por página</option>
                  ))}
                </select>
              </div>
              {/* CSS para responsividad si alguna clase custom no responde */}
              <style>{`
    @media (max-width: 640px) {
      .asist-pagination {
        font-size: 13px;
        gap: 7px;
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      }
      .asist-pagination select,
      .asist-pagination button {
        font-size: 13px;
        min-width: 65px;
      }
      .asist-pagination span {
        font-size: 13px !important;
      }
    }
  `}</style>
            </div>


            {/* Modal Edición */}
            {editing && (
              <div className="asist-modal-bg">
                <div className="asist-modal">
                  <h3 className="asist-modal-title">Editar registro</h3>
                  <div className="mb-3">
                    <div className="text-sm text-yellow-800 mb-1">
                      Fecha: <b>{editing.date}</b>
                    </div>
                    <div className="text-sm text-yellow-800 mb-1">
                      Estudiante: <b>{editing.studentFullName || editing.studentId}</b>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="asist-label">Estado entrada</label>
                    <select
                      className="asist-select w-full"
                      value={editEntryStatus}
                      onChange={e => setEditEntryStatus(e.target.value)}
                    >
                      {ENTRY_STATUS.filter(e => e.value !== "").map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="asist-label">Estado salida</label>
                    <select
                      className="asist-select w-full"
                      value={editExitStatus}
                      onChange={e => setEditExitStatus(e.target.value)}
                    >
                      {EXIT_STATUS.filter(e => e.value !== "").map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-5">
                    <button
                      className="asist-modal-btn asist-modal-cancel"
                      onClick={() => setEditing(null)}
                      disabled={savingEdit}
                    >
                      Cancelar
                    </button>
                    <button
                      className="asist-modal-btn"
                      onClick={() => handleSaveEdit(refetch)}
                      disabled={savingEdit}
                    >
                      {savingEdit ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </AssistanceFilterFetcher>
    </div>
  );

}
