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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-extrabold mb-6 text-blue-900 text-center">
        Asistencia Manual de Estudiantes
      </h2>

      <div className="rounded-3xl border border-blue-100 bg-gradient-to-tr from-blue-50 via-white to-slate-100 shadow-2xl py-6 px-3">
        <StudentListFetcher>
          {({ students, filters, loading, error, totalPages, onPageChange }) => (
            <>
              <div className="w-full overflow-x-auto rounded-xl shadow bg-white/90 border mb-4">
                {loading ? (
                  <div className="text-center py-6 text-lg animate-pulse">Cargando estudiantes...</div>
                ) : error ? (
                  <div className="text-red-500 py-6 text-center">{error}</div>
                ) : (
                  <table className="w-full border-separate border-spacing-y-1">
                    <thead>
                      <tr className="bg-blue-50 text-blue-700 text-sm uppercase">
                        <th className="p-2 rounded-tl-xl"></th>
                        <th className="p-2 text-left">Nombre</th>
                        <th className="p-2 text-left">DNI</th>
                        <th className="p-2 text-left">Nivel</th>
                        <th className="p-2 text-left">Grado</th>
                        <th className="p-2 text-left">Sección</th>
                        <th className="p-2 text-center">Entrada</th>
                        <th className="p-2 text-center">Salida</th>
                        <th className="p-2 rounded-tr-xl text-center">Última acción</th>
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
                          <tr key={student.id} className="hover:bg-blue-50 border-b transition">
                            <td className="p-2 text-center">
                              <CheckCircleIcon className="w-6 h-6 text-blue-300" />
                            </td>
                            <td className="p-2 font-semibold">{student.fullName}</td>
                            <td className="p-2">{student.dni}</td>
                            <td className="p-2">{student.schoolLevel}</td>
                            <td className="p-2">{student.grade}</td>
                            <td className="p-2">{student.section}</td>
                            <td className="p-2 text-center">
                              <button
                                className="bg-green-500 hover:bg-green-400 transition text-white px-3 py-1 rounded-lg flex items-center gap-1 shadow"
                                onClick={() => handleMark(student, "entry")}
                              >
                                <ArrowRightCircleIcon className="w-5 h-5" />
                                Entrada
                              </button>
                              {/* Mostrar badge de estado de entrada si se acaba de marcar */}
                              {mark?.type === "entry" && record?.entryStatus && (
                                <div className="mt-1">
                                  <StatusBadge status={record.entryStatus} />
                                </div>
                              )}
                            </td>
                            <td className="p-2 text-center">
                              <button
                                className="bg-blue-600 hover:bg-blue-500 transition text-white px-3 py-1 rounded-lg flex items-center gap-1 shadow"
                                onClick={() => handleMark(student, "exit")}
                              >
                                <ArrowLeftCircleIcon className="w-5 h-5" />
                                Salida
                              </button>
                              {/* Mostrar badge de estado de salida si se acaba de marcar */}
                              {mark?.type === "exit" && record?.exitStatus && (
                                <div className="mt-1">
                                  <StatusBadge status={record.exitStatus} />
                                </div>
                              )}
                            </td>
                            <td className="p-2 text-center">
                              {mark ? (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="text-xs text-gray-500">
                                    {mark.type === "entry"
                                      ? `Entrada: ${record?.entryMarkedAt?.replace("T", " ")?.substring(0, 16) || "-"}`
                                      : `Salida: ${record?.exitMarkedAt?.replace("T", " ")?.substring(0, 16) || "-"}`}
                                  </span>
                                  {record?.edited && (
                                    <span className="text-xs text-pink-600 font-bold">Editado Manual</span>
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
              <div className="flex flex-wrap justify-center items-center mt-2 gap-2">
                <button
                  onClick={() => onPageChange(filters.page - 1)}
                  disabled={filters.page === 0}
                  className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => onPageChange(idx)}
                    className={`px-3 py-1 rounded-lg font-bold ${filters.page === idx
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-blue-50"
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(filters.page + 1)}
                  disabled={filters.page >= totalPages - 1}
                  className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
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
