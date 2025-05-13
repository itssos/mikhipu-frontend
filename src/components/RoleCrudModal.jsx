// src/components/RoleCrudModal.jsx
import React, { useState } from "react";
import Modal from "./UI/Modal";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  assignPermissionToRole,
  removePermissionFromRole,
} from "../api/roles";
import { getAllPermissions } from "../api/permissions";
import EditButton from "./UI/EditButton";
import DeleteButton from "./UI/DeleteButton";
import { toast, ToastContainer } from "react-toastify";

/**
 * Modal para CRUD completo de roles y asignación de permisos.
 *
 * Usage:
 * <RoleCrudModal trigger={<button>Gestionar Roles</button>} />
 */
const RoleCrudModal = ({ trigger }) => {
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [roleForm, setRoleForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Encuentra el rol actualmente en edición
  const editingRole = roles.find(r => r.id === editingId);

  // Carga roles y permisos juntos
  const fetchData = async () => {
    try {
      const [r, perms] = await Promise.all([
        getRoles(),
        getAllPermissions()
      ]);
      setRoles(r);
      setAllPermissions(perms);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Crear o actualizar rol
  const handleSaveRole = async () => {
    try {
      if (editingId) {
        await updateRole(editingId, roleForm);
        toast.success("Rol actualizado");
      } else {
        await createRole(roleForm);
        toast.success("Rol creado");
      }
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Reinicia formulario y cancela edición
  const resetForm = () => {
    setRoleForm({ name: "", description: "" });
    setEditingId(null);
  };

  // Pasa a modo edición
  const handleEdit = role => {
    setEditingId(role.id);
    setRoleForm({
      name: role.name,
      description: role.description || ""
    });
  };

  // Elimina rol y cancela edición si corresponde
  const handleDelete = async id => {
    try {
      await deleteRole(id);
      toast.success("Rol eliminado");
      if (editingId === id) {
        resetForm();
      }
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Asigna o remueve permiso al rol en edición
  const togglePermission = async permName => {
    if (!editingRole) return;
    const exists = editingRole.permissions?.some(p => p.name === permName);
    try {
      if (exists) {
        await removePermissionFromRole(editingId, permName);
        toast.info(`Permiso '${permName}' removido`);
      } else {
        await assignPermissionToRole(editingId, permName);
        toast.success(`Permiso '${permName}' asignado`);
      }
      fetchData();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <Modal
        trigger={<div onClick={fetchData}>{trigger}</div>}
        title="Gestión de Roles y Permisos"
        size="lg"
        actions={[
          {
            label: "Cancelar",
            onClick: resetForm,
            className: "bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          },
          {
            label: editingId ? "Actualizar" : "Crear",
            onClick: handleSaveRole,
            className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          }
        ]}
      >
        {/* Formulario de rol */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre del rol"
            value={roleForm.name}
            onChange={e =>
              setRoleForm({ ...roleForm, name: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={roleForm.description}
            onChange={e =>
              setRoleForm({ ...roleForm, description: e.target.value })
            }
            className="border p-2 rounded"
          />
        </div>

        {/* Gestión de permisos (solo en edición) */}
        {editingRole && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Permisos disponibles</h4>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {allPermissions.map(p => {
                const checked = editingRole.permissions?.some(
                  rp => rp.name === p.name
                );
                return (
                  <label key={p.name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!!checked}
                      onChange={() => togglePermission(p.name)}
                    />
                    <span>{p.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista de roles */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {roles.map(role => (
            <div
              key={role.id}
              className="flex justify-between items-center border-b pb-2 px-1"
            >
              <div>
                <p className="font-semibold">{role.name}</p>
                <p className="text-sm text-gray-600">{role.description}</p>
              </div>
              <div className="flex space-x-2">
                <EditButton
                  className="w-8 h-8 p-1"
                  onClick={() => handleEdit(role)}
                />
                <DeleteButton
                  className="w-8 h-8 p-1"
                  onClick={() => handleDelete(role.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default RoleCrudModal;
