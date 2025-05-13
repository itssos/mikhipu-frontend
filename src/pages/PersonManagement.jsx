// Dentro de PersonManagement.jsx (vista completa, se incluye la parte relevante)
import { useEffect, useState } from "react";
import { ShieldCheckIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { getStudents, deleteStudent } from "../api/students";
import ExcelUploadModal from "../components/ExcelUploadModal";
import RoleCrudModal from "../components/RoleCrudModal";
import EditButton from "../components/UI/EditButton";
import AddPersonButton from "../components/UI/AddPersonButton";
import DeleteButton from "../components/UI/DeleteButton";
import CourseStudentModal from '../components/modals/CourseStudentModal';
import StudentModal from '../components/StudentModal';

export default function PersonManagement() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Estados para modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showExcelModal, setShowExcelModal] = useState(false);

  const fetchStudent = async () => {
    setLoading(true);
    setGlobalError("");
    try {
      const data = await getStudents();
      console.log(data);

      setPersons(data);
    } catch (err) {
      setGlobalError(err.message);
    }
    setLoading(false);
  };


  useEffect(() => {
    fetchStudent();
  }, []);

  // --- Modal de Eliminación ---
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    setGlobalError("");
    try {
      await deleteStudent(deleteId);
      setActionMessage("Persona eliminada con éxito.");
      setTimeout(() => setActionMessage(""), 2000);
      setShowDeleteModal(false);
      await fetchStudent();
    } catch (err) {
      setGlobalError(err.message);
    }
    setActionLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Administración de Personas</h1>
      {globalError && <div className="text-red-500 mb-4 text-center">{globalError}</div>}
      {actionMessage && <div className="text-green-500 mb-4 text-center">{actionMessage}</div>}
      <div className="flex justify-end mb-4 space-x-4">
        <RoleCrudModal trigger={
          <button className="hover:scale-110 cursor-pointer shadow-sm shadow-black transition-normal duration-300 p-1 w-10 h-10 rounded">
            <ShieldCheckIcon className="h-8 w-8 text-gray-500" />
          </button>
        } />
        <CourseStudentModal trigger={
          <button className="hover:scale-110 cursor-pointer shadow-sm shadow-black transition-normal duration-300 p-1 w-10 h-10 rounded">
            <BookOpenIcon className="h-8 w-8 text-gray-500" />
          </button>
        } />

        <StudentModal trigger={
          <AddPersonButton />
        } />
        <button
          onClick={() => setShowExcelModal(true)}
          className="hover:scale-110 cursor-pointer shadow-sm shadow-black transition-normal duration-300 p-1 rounded"
        >
          <svg
            viewBox="0 0 32 32"
            width={"32"}
            height={"32"}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <defs>
                <linearGradient
                  id="a"
                  x1="4.494"
                  y1="-2092.086"
                  x2="13.832"
                  y2="-2075.914"
                  gradientTransform="translate(0 2100)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#18884f"></stop>
                  <stop offset="0.5" stopColor="#117e43"></stop>
                  <stop offset="1" stopColor="#0b6631"></stop>
                </linearGradient>
              </defs>
              <title>file_type_excel</title>
              <path d="M19.581,15.35,8.512,13.4V27.809A1.192,1.192,0,0,0,9.705,29h19.1A1.192,1.192,0,0,0,30,27.809h0V22.5Z" style={{ fill: "#185c37" }} />
              <path d="M19.581,3H9.705A1.192,1.192,0,0,0,8.512,4.191h0V9.5L19.581,16l5.861,1.95L30,16V9.5Z" style={{ fill: "#21a366" }} />
              <path d="M8.512,9.5H19.581V16H8.512Z" style={{ fill: "#107c41" }} />
              <path d="M16.434,8.2H8.512V24.45h7.922a1.2,1.2,0,0,0,1.194-1.191V9.391A1.2,1.2,0,0,0,16.434,8.2Z" style={{ opacity: 0.1, isolation: "isolate" }} />
              <path d="M15.783,8.85H8.512V25.1h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style={{ opacity: 0.2, isolation: "isolate" }} />
              <path d="M15.783,8.85H8.512V23.8h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style={{ opacity: 0.2, isolation: "isolate" }} />
              <path d="M15.132,8.85H8.512V23.8h6.62a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.132,8.85Z" style={{ opacity: 0.2, isolation: "isolate" }} />
              <path d="M3.194,8.85H15.132a1.193,1.193,0,0,1,1.194,1.191V21.959a1.193,1.193,0,0,1-1.194,1.191H3.194A1.192,1.192,0,0,1,2,21.959V10.041A1.192,1.192,0,0,1,3.194,8.85Z" style={{ fill: "url(#a)" }} />
              <path d="M5.7,19.873l2.511-3.884-2.3-3.862H7.758L9.013,14.6c.116.234.2.408.238.524h.017c.082-.188.169-.369.26-.546l1.342-2.447h1.7l-2.359,3.84,2.419,3.905H10.821l-1.45-2.711A2.355,2.355,0,0,1,9.2,16.8H9.176a1.688,1.688,0,0,1-.168.351L7.515,19.873Z" style={{ fill: "#fff" }} />
              <path d="M28.806,3H19.581V9.5H30V4.191A1.192,1.192,0,0,0,28.806,3Z" style={{ fill: "#33c481" }} />
              <path d="M19.581,16H30v6.5H19.581Z" style={{ fill: "#107c41" }} />
            </g>
          </svg>
        </button>
      </div>
      {loading ? (
        <div className="text-center py-10">Cargando personas...</div>
      ) : (
        <div className="w-full overflow-auto rounded-2xl shadow-md shadow-black">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nombre Completo</th>
                <th className="py-2 px-4 border-b">DNI</th>
                <th className="py-2 px-4 border-b">Nivel Escolar</th>
                <th className="py-2 px-4 border-b">Grado</th>
                <th className="py-2 px-4 border-b">Sección</th>
                <th className="py-2 px-4 border-b">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {persons.map((person) => {
                const user = person.user;
                return (
                  <tr key={person.id} className="text-center">
                    <td className="py-2 px-4 border-b">{person.id}</td>
                    <td className="py-2 px-4 border-b">
                      {person.fullName}
                    </td>
                    <td className="py-2 px-4 border-b">{person.dni || "-"}</td>
                    <td className="py-2 px-4 border-b">{person.schoolLevel || "-"}</td>
                    <td className="py-2 px-4 border-b">{person.grade || "-"}</td>
                    <td className="py-2 px-4 border-b">{person.section || "-"}</td>
                    <td className="py-2 px-4 border-b space-x-2">
                      <div>
                        <StudentModal trigger={
                          <EditButton className="w-8 h-8 p-1" />
                        } studentId={person.id} />
                      </div>
                      {person.studentId}
                      <DeleteButton className="w-8 h-8 p-1" onClick={() => openDeleteModal(person.id)} />
                    </td>
                  </tr>
                );
              })}
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

      {/* Modal de Excel Upload */}
      {showExcelModal && (
        <ExcelUploadModal
          isOpen={showExcelModal}
          onClose={() => setShowExcelModal(false)}
          onUploadSuccess={fetchStudent}
        />
      )}
    </div>
  );
}
