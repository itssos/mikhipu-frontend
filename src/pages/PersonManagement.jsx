import { useState } from "react";
import { ShieldCheckIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { deleteStudent } from "../api/students";
import ExcelUploadModal from "../components/ExcelUploadModal";
import RoleCrudModal from "../components/RoleCrudModal";
import EditButton from "../components/UI/EditButton";
import AddPersonButton from "../components/UI/AddPersonButton";
import DeleteButton from "../components/UI/DeleteButton";
import CourseStudentModal from "../components/modals/CourseStudentModal";
import StudentModal from "../components/StudentModal";
import StudentQRGeneratorButton from "../components/student/StudentQRGeneratorButton";
import StudentListFetcher from "../components/student/StudentListFetcher";

export default function PersonManagement() {
  // Acciones y modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [showExcelModal, setShowExcelModal] = useState(false);

  // Modal de eliminación
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (refetch) => {
    if (!deleteId) return;
    setActionLoading(true);
    setGlobalError("");
    try {
      await deleteStudent(deleteId);
      setActionMessage("Persona eliminada con éxito.");
      setTimeout(() => setActionMessage(""), 2000);
      setShowDeleteModal(false);
      refetch(); // Refresca lista
    } catch (err) {
      setGlobalError(err.message);
    }
    setActionLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center tracking-tight">
        Administración de Estudiantes
      </h1>

      {globalError && (
        <div className="text-red-500 mb-4 text-center font-semibold animate-pulse">
          {globalError}
        </div>
      )}
      {actionMessage && (
        <div className="text-green-600 mb-4 text-center font-semibold animate-fade-in">
          {actionMessage}
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap justify-end mb-4 gap-2">
        <RoleCrudModal
          trigger={
            <button className="hover:scale-110 cursor-pointer shadow transition-all duration-300 p-2 w-10 h-10 rounded-full bg-white border">
              <ShieldCheckIcon className="h-6 w-6 text-gray-500" />
            </button>
          }
        />
        <CourseStudentModal
          trigger={
            <button className="hover:scale-110 cursor-pointer shadow transition-all duration-300 p-2 w-10 h-10 rounded-full bg-white border">
              <BookOpenIcon className="h-6 w-6 text-gray-500" />
            </button>
          }
        />
        <StudentModal trigger={<AddPersonButton />} />
        <button
          onClick={() => setShowExcelModal(true)}
          className="hover:scale-110 cursor-pointer shadow transition-all duration-300 p-2 w-10 h-10 rounded-full bg-white border"
        >
          {/* Icono Excel */}
          <svg width={24} height={24} fill="none" viewBox="0 0 32 32">
            <path d="M3.194,8.85H15.132a1.193,1.193,0,0,1,1.194,1.191V21.959a1.193,1.193,0,0,1-1.194,1.191H3.194A1.192,1.192,0,0,1,2,21.959V10.041A1.192,1.192,0,0,1,3.194,8.85Z" fill="#18884f" />
            <path d="M5.7,19.873l2.511-3.884-2.3-3.862H7.758L9.013,14.6c.116.234.2.408.238.524h.017c.082-.188.169-.369.26-.546l1.342-2.447h1.7l-2.359,3.84,2.419,3.905H10.821l-1.45-2.711A2.355,2.355,0,0,1,9.2,16.8H9.176a1.688,1.688,0,0,1-.168.351L7.515,19.873Z" fill="#fff" />
          </svg>
        </button>
      </div>

      {/* Listado con filtros y tabla */}
      <StudentListFetcher>
        {({
          students,
          loading,
          error,
          filters,
          totalPages,
          totalElements,
          onPageChange,
          refetch,
        }) => (
          <>
            {error && <div className="text-red-500 mb-4 text-center font-semibold animate-pulse">{error}</div>}
            <div className="w-full overflow-x-auto rounded-2xl shadow-xl bg-white/90">
              {loading ? (
                <div className="text-center py-12 text-lg animate-pulse">Cargando estudiantes...</div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No hay estudiantes para mostrar.</div>
              ) : (
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                      <th className="py-3 px-2 text-left rounded-tl-2xl">ID</th>
                      <th className="py-3 px-2 text-left">Nombre</th>
                      <th className="py-3 px-2 text-left">DNI</th>
                      <th className="py-3 px-2 text-left">Nivel Escolar</th>
                      <th className="py-3 px-2 text-left">Grado</th>
                      <th className="py-3 px-2 text-left">Sección</th>
                      <th className="py-3 px-2 text-center rounded-tr-2xl">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((person) => (
                      <tr
                        key={person.id}
                        className="text-gray-800 bg-white hover:bg-gray-50 transition-colors border-b"
                      >
                        <td className="py-2 px-2">{person.id}</td>
                        <td className="py-2 px-2 font-medium">{person.fullName}</td>
                        <td className="py-2 px-2">{person.dni || "-"}</td>
                        <td className="py-2 px-2">{person.schoolLevel || "-"}</td>
                        <td className="py-2 px-2">{person.grade || "-"}</td>
                        <td className="py-2 px-2">{person.section || "-"}</td>
                        <td className="py-2 px-2 text-center">
                          <div className="flex gap-1 justify-center items-center">
                            <StudentModal
                              trigger={<EditButton className="w-7 h-7" />}
                              studentId={person.id}
                            />
                            <DeleteButton
                              className="w-7 h-7"
                              onClick={() => openDeleteModal(person.id)}
                            />
                            <StudentQRGeneratorButton id={person.id} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Paginación */}
            <div className="flex flex-wrap justify-center items-center mt-6 gap-2">
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
              <span className="text-sm ml-2 text-gray-500">
                {totalElements} resultados
              </span>
            </div>
            {/* Modal de Eliminación */}
            {showDeleteModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
                <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm mx-4 text-center">
                  <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
                  <p className="mb-4">¿Estás seguro de eliminar esta persona?</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 rounded border"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(refetch)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                    >
                      {actionLoading ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </StudentListFetcher>

      {/* Modal de Excel Upload */}
      {showExcelModal && (
        <ExcelUploadModal
          isOpen={showExcelModal}
          onClose={() => setShowExcelModal(false)}
          onUploadSuccess={() => window.location.reload()}
        />
      )}

      {/* Estilos para inputs (puedes mover esto a tu CSS global si prefieres) */}
      <style>{`
        .input-filter {
          @apply px-3 py-2 border rounded-xl bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition;
        }
      `}</style>
    </div>
  );
}
