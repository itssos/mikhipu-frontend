// Dentro de PersonManagement.jsx (vista completa, se incluye la parte relevante)
import React, { useEffect, useState } from "react";
import { getPersons, createPerson, updatePerson, deletePerson } from "../api/person";
import { assignRoleToUser } from "../api/user";
import ExcelUploadModal from "../components/ExcelUploadModal";

const ROLE_OPTIONS = ["ADMINISTRADOR", "DOCENTE", "ESTUDIANTE", "APODERADO"];
const initialForm = {
  firstName: "",
  lastName: "",
  dni: "",
  birthDate: "",
  gender: "",
  address: "",
  phone: "",
  grade: "",
  section: "",
  schoolLevel: "",
  username: "",
  email: "",
  password: "",
  role: "",
};

export default function PersonManagement() {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Estados para modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState(initialForm);
  const [showExcelModal, setShowExcelModal] = useState(false);

  const fetchPersons = async () => {
    setLoading(true);
    setGlobalError("");
    try {
      const data = await getPersons();
      setPersons(data);
    } catch (err) {
      setGlobalError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  const handleFormChange = (e, setForm) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Modal de Edición ---
  const openEditModal = (person) => {
    setEditForm({
      id: person.id,
      firstName: person.firstName || "",
      lastName: person.lastName || "",
      dni: person.dni || "",
      birthDate: person.birthDate || "",
      gender: person.gender || "",
      address: person.address || "",
      phone: person.phone || "",
      grade: person.grade || "",
      section: person.section || "",
      schoolLevel: person.schoolLevel || "",
      username: person.user?.username || "",
      email: person.user?.email || "",
      password: "",
      role: (person.user?.roles && person.user.roles[0]) || "",
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm) return;
    if (!editForm.firstName || !editForm.lastName || !editForm.username || !editForm.email || !editForm.role) {
      setGlobalError("Complete los campos obligatorios.");
      return;
    }
    setActionLoading(true);
    setGlobalError("");
    try {
      const updatedData = {
        type: editForm.role,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        dni: editForm.dni,
        birthDate: editForm.birthDate,
        gender: editForm.gender,
        address: editForm.address,
        phone: editForm.phone,
        grade: editForm.grade ? parseInt(editForm.grade) : null,
        section: editForm.section,
        schoolLevel: editForm.schoolLevel,
        user: {
          username: editForm.username,
          email: editForm.email,
          ...(editForm.password && { password: editForm.password }),
          roles: [editForm.role],
        },
      };
      await updatePerson(editForm.id, updatedData);
      setActionMessage("Persona actualizada con éxito.");
      setTimeout(() => setActionMessage(""), 2000);
      setShowEditModal(false);
      await fetchPersons();
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

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    setGlobalError("");
    try {
      await deletePerson(deleteId);
      setActionMessage("Persona eliminada con éxito.");
      setTimeout(() => setActionMessage(""), 2000);
      setShowDeleteModal(false);
      await fetchPersons();
    } catch (err) {
      setGlobalError(err.message);
    }
    setActionLoading(false);
  };

  // --- Modal de Creación ---
  const openCreateModal = () => {
    setCreateForm(initialForm);
    setShowCreateModal(true);
  };

  const handleSaveCreate = async () => {
    if (
      !createForm.firstName ||
      !createForm.lastName ||
      !createForm.username ||
      !createForm.email ||
      !createForm.password ||
      !createForm.role
    ) {
      setGlobalError("Complete los campos obligatorios.");
      return;
    }
    setActionLoading(true);
    setGlobalError("");
    try {
      const newPersonData = {
        type: createForm.role,
        firstName: createForm.firstName,
        lastName: createForm.lastName,
        dni: createForm.dni,
        birthDate: createForm.birthDate,
        gender: createForm.gender,
        address: createForm.address,
        phone: createForm.phone,
        grade: createForm.grade ? parseInt(createForm.grade) : null,
        section: createForm.section,
        schoolLevel: createForm.schoolLevel,
        user: {
          username: createForm.username,
          email: createForm.email,
          password: createForm.password,
          roles: [createForm.role],
        },
      };
      await createPerson(newPersonData);
      setActionMessage("Persona creada con éxito.");
      setTimeout(() => setActionMessage(""), 2000);
      setShowCreateModal(false);
      await fetchPersons();
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
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={openCreateModal}
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded"
        >
          Nueva Persona
        </button>
        <button
          onClick={() => setShowExcelModal(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded"
        >
          Importar Excel
        </button>
      </div>
      {loading ? (
        <div className="text-center py-10">Cargando personas...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Nombre Completo</th>
                <th className="py-2 px-4 border-b">DNI</th>
                <th className="py-2 px-4 border-b">Nacimiento</th>
                <th className="py-2 px-4 border-b">Género</th>
                <th className="py-2 px-4 border-b">Dirección</th>
                <th className="py-2 px-4 border-b">Teléfono</th>
                <th className="py-2 px-4 border-b">Usuario</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Rol</th>
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
                      {person.firstName} {person.lastName}
                    </td>
                    <td className="py-2 px-4 border-b">{person.dni || "-"}</td>
                    <td className="py-2 px-4 border-b">{person.birthDate || "-"}</td>
                    <td className="py-2 px-4 border-b">{person.gender || "-"}</td>
                    <td className="py-2 px-4 border-b">{person.address || "-"}</td>
                    <td className="py-2 px-4 border-b">{person.phone || "-"}</td>
                    <td className="py-2 px-4 border-b">{user?.username || "-"}</td>
                    <td className="py-2 px-4 border-b">{user?.email || "-"}</td>
                    <td className="py-2 px-4 border-b">{user?.roles ? user.roles.join(", ") : "-"}</td>
                    <td className="py-2 px-4 border-b">{person.schoolLevel || "-"}</td>
                    <td className="py-2 px-4 border-b">{person.grade || "-"}</td>
                    <td className="py-2 px-4 border-b">{person.section || "-"}</td>
                    <td className="py-2 px-4 border-b space-x-2">
                      <button
                        onClick={() => openEditModal(person)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => openDeleteModal(person.id)}
                        className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-bold mb-4">Editar Persona</h2>
            <form className="space-y-6">
              {/* Sección de Datos de Persona */}
              <div>
                <h3 className="font-semibold mb-2">Datos de Persona</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Nombre</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Apellido</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">DNI</label>
                    <input
                      type="text"
                      name="dni"
                      value={editForm.dni}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Nacimiento</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={editForm.birthDate}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Género</label>
                    <input
                      type="text"
                      name="gender"
                      value={editForm.gender}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Dirección</label>
                    <input
                      type="text"
                      name="address"
                      value={editForm.address}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Teléfono</label>
                    <input
                      type="text"
                      name="phone"
                      value={editForm.phone}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Grado</label>
                    <input
                      type="number"
                      name="grade"
                      value={editForm.grade}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Sección</label>
                    <input
                      type="text"
                      name="section"
                      value={editForm.section}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Nivel Escolar</label>
                    <input
                      type="text"
                      name="schoolLevel"
                      value={editForm.schoolLevel}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>
              {/* Sección de Datos del Usuario */}
              <div>
                <h3 className="font-semibold mb-2">Datos del Usuario</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Usuario</label>
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Contraseña{" "}
                      <span className="text-sm text-gray-500">(Dejar en blanco para no cambiar)</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={editForm.password}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                      placeholder="(Opcional)"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Rol</label>
                    <select
                      name="role"
                      value={editForm.role}
                      onChange={(e) => handleFormChange(e, setEditForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Seleccione</option>
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </form>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cerrar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {actionLoading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
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

      {/* Modal de Creación */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Persona</h2>
            <form className="space-y-6">
              {/* Sección de Datos de Persona */}
              <div>
                <h3 className="font-semibold mb-2">Datos de Persona</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Nombre</label>
                    <input
                      type="text"
                      name="firstName"
                      value={createForm.firstName}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Apellido</label>
                    <input
                      type="text"
                      name="lastName"
                      value={createForm.lastName}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">DNI</label>
                    <input
                      type="text"
                      name="dni"
                      value={createForm.dni}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Nacimiento</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={createForm.birthDate}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Género</label>
                    <input
                      type="text"
                      name="gender"
                      value={createForm.gender}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Dirección</label>
                    <input
                      type="text"
                      name="address"
                      value={createForm.address}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Teléfono</label>
                    <input
                      type="text"
                      name="phone"
                      value={createForm.phone}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Grado</label>
                    <input
                      type="number"
                      name="grade"
                      value={createForm.grade}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Sección</label>
                    <input
                      type="text"
                      name="section"
                      value={createForm.section}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Nivel Escolar</label>
                    <input
                      type="text"
                      name="schoolLevel"
                      value={createForm.schoolLevel}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>
              {/* Sección de Datos del Usuario */}
              <div>
                <h3 className="font-semibold mb-2">Datos del Usuario</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Usuario</label>
                    <input
                      type="text"
                      name="username"
                      value={createForm.username}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={createForm.email}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={createForm.password}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Rol</label>
                    <select
                      name="role"
                      value={createForm.role}
                      onChange={(e) => handleFormChange(e, setCreateForm)}
                      className="w-full border rounded px-3 py-2"
                      required
                    >
                      <option value="">Seleccione</option>
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </form>
            <div className="flex justify-end mt-6 space-x-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleSaveCreate}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {actionLoading ? "Guardando..." : "Guardar"}
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
          onUploadSuccess={fetchPersons}
        />
      )}
    </div>
  );
}
