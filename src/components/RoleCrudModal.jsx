// src/components/RoleCrudModal.jsx
import React, { useState, useEffect } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "../api/roles";
import EditButton from "./UI/EditButton";
import DeleteButton from "./UI/DeletButton";
import { toast, ToastContainer } from "react-toastify";

const RoleCrudModal = ({ open, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Obtiene la lista de roles cuando se abre el modal
  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (open) {
      fetchRoles();
    }
  }, [open]);

  const handleCreateOrUpdate = async () => {
    try {
      if (editingId) {
        await updateRole(editingId, newRole);
      } else {
        await createRole(newRole);
      }
      setNewRole({ name: "", description: "" });
      setEditingId(null);
      fetchRoles();
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const handleEdit = (role) => {
    setEditingId(role.id);
    setNewRole({ name: role.name, description: role.description });
  };

  const handleDelete = async (id) => {
    try {
      await deleteRole(id);
      fetchRoles();
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo semitransparente y clic para cerrar */}
      <div
        className="absolute inset-0 bg-gray-800 opacity-50"
        onClick={onClose}
      ></div>
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">CRUD de Roles</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            X
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Nombre"
            value={newRole.name}
            onChange={(e) =>
              setNewRole({ ...newRole, name: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded mb-2"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={newRole.description}
            onChange={(e) =>
              setNewRole({ ...newRole, description: e.target.value })
            }
            className="w-full border border-gray-300 p-2 rounded mb-2"
          />
          <button
            onClick={handleCreateOrUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? "Actualizar" : "Crear"}
          </button>
        </div>
        <div>
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex justify-between items-center border-b border-gray-200 py-2"
            >
              <div>
                <p className="font-semibold">{role.name}</p>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
              <div className="flex space-x-2">
                <EditButton className="w-8 h-8" onClick={() => handleEdit(role)} />
                <DeleteButton className="w-8 h-8" onClick={() => handleDelete(role.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RoleCrudModal;
