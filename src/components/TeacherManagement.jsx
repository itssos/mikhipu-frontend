// src/pages/TeacherManagement.jsx
import { useEffect, useState } from "react";
import { getTeachers, deleteTeacher } from "../api/teachers";
import DeleteButton from "./UI/DeleteButton";
import AddPersonButton from "./UI/AddPersonButton";
import TeacherModal from "./modals/TeacherModal";
import EditButton from "./UI/EditButton";

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const fetchTeachers = async () => {
    setLoading(true);
    setGlobalError("");
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      setGlobalError(err.message);
    }
    setLoading(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    setGlobalError("");
    try {
      await deleteTeacher(deleteId);
      setActionMessage("Persona eliminada con éxito.");
      setTimeout(() => setActionMessage(""), 2000);
      setShowDeleteModal(false);
      await fetchTeachers();
    } catch (err) {
      setGlobalError(err.message);
    }
    setActionLoading(false);
  };

  // --- Modal de Eliminación ---
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Administración de Docentes</h1>
      {globalError && <div className="text-red-500 mb-4 text-center">{globalError}</div>}
      <div className="flex justify-end mb-4">
        <TeacherModal trigger={<AddPersonButton />} />
      </div>

      {loading ? (
        <div className="text-center py-10">Cargando docentes...</div>
      ) : (
        <div className="w-full overflow-auto rounded-2xl shadow-md shadow-black">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-center">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nombre Completo</th>
                <th className="py-2 px-4 border-b">DNI</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Código</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="text-center">
                  <td className="py-2 px-4 border-b">{teacher.id}</td>
                  <td className="py-2 px-4 border-b">{teacher.person.firstName} {teacher.person.lastName}</td>
                  <td className="py-2 px-4 border-b">{teacher.person?.dni || "-"}</td>
                  <td className="py-2 px-4 border-b">{teacher.person?.user?.email || "-"}</td>
                  <td className="py-2 px-4 border-b">{teacher.code || "-"}</td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <TeacherModal trigger={<EditButton className="w-8 h-8 p-1" />} teacherId={teacher.id} />
                    <DeleteButton className="w-8 h-8 p-1" onClick={() => openDeleteModal(teacher.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4 text-center">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p className="mb-4">¿Estás seguro de eliminar esta persona?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cerrar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
              >
                {actionLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
