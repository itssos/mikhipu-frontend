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
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg max-w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Registros de Asistencia</h2>
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
            {/* Tabla de resultados */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow mb-4">
              <table className="min-w-full bg-white">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Fecha</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Apellido</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Nombre</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Nivel</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Grado</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Sección</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Estado entrada</th>
                    <th className="px-3 py-2 text-left text-sm font-bold text-gray-700">Estado salida</th>
                    <th className="px-3 py-2 text-center text-sm font-bold text-gray-700">Acciones</th>
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
                      <tr key={rec.id} className="border-b last:border-b-0 hover:bg-blue-50/30">
                        <td className="px-3 py-2 text-sm">{rec.date}</td>
                        <td className="px-3 py-2 text-sm">{rec.lastName}</td>
                        <td className="px-3 py-2 text-sm">{rec.firstName}</td>
                        <td className="px-3 py-2 text-sm">{rec.schoolLevel || "-"}</td>
                        <td className="px-3 py-2 text-sm">{rec.grade || "-"}</td>
                        <td className="px-3 py-2 text-sm">{rec.section || "-"}</td>
                        <td className="px-3 py-2 text-sm">{rec.entryStatus}</td>
                        <td className="px-3 py-2 text-sm">{rec.exitStatus}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-xl shadow text-xs font-bold"
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
            {/* Paginación */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <span className="text-sm text-gray-600">
                  {totalElements > 0 &&
                    `Mostrando ${filters.page * filters.size + 1}-${Math.min((filters.page + 1) * filters.size, totalElements)} de ${totalElements} registros`
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold disabled:opacity-50"
                  onClick={() => onPageChange(filters.page - 1)}
                  disabled={filters.page === 0}
                >Anterior</button>
                <span className="text-sm font-bold">{(filters.page + 1)} / {totalPages || 1}</span>
                <button
                  className="px-3 py-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold disabled:opacity-50"
                  onClick={() => onPageChange(filters.page + 1)}
                  disabled={filters.page + 1 >= totalPages}
                >Siguiente</button>
                <select
                  className="ml-3 px-2 py-1 rounded-xl border border-gray-200 text-sm"
                  value={filters.size}
                  onChange={e => onPageChange(0, parseInt(e.target.value))}
                >
                  {[10, 20, 30, 50, 100].map(s => (
                    <option key={s} value={s}>{s} por página</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Modal de edición */}
            {editing && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
                  <h3 className="text-lg font-bold mb-4 text-gray-700">Editar registro</h3>
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">Fecha: <b>{editing.date}</b></div>
                    <div className="text-sm text-gray-600 mb-1">Estudiante: <b>{editing.studentFullName || editing.studentId}</b></div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm mb-1">Estado entrada</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow"
                      value={editEntryStatus}
                      onChange={e => setEditEntryStatus(e.target.value)}
                    >
                      {ENTRY_STATUS.filter(e => e.value !== "").map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm mb-1">Estado salida</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl shadow"
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
                      className="px-4 py-2 bg-gray-100 rounded-xl text-gray-600 font-bold hover:bg-gray-200"
                      onClick={() => setEditing(null)}
                      disabled={savingEdit}
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600"
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
