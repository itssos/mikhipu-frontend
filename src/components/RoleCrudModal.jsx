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
import { toast } from "react-toastify";

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
        size="xl"
        actions={[
          {
            label: "Cancelar",
            onClick: resetForm,
            className: "btn-adventure-secondary"
          },
          {
            label: editingId ? "Actualizar" : "Crear",
            onClick: handleSaveRole,
            className: "btn-adventure"
          }
        ]}
      >
        {/* Formulario de rol */}
        <div className="adventure-form mb-4 grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre del rol"
            value={roleForm.name}
            onChange={e =>
              setRoleForm({ ...roleForm, name: e.target.value })
            }
            className="adventure-input"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={roleForm.description}
            onChange={e =>
              setRoleForm({ ...roleForm, description: e.target.value })
            }
            className="adventure-input"
          />
        </div>

        {/* Gestión de permisos (solo en edición) */}
        {editingRole && (
          <div className="mb-6">
            <h4 className="adventure-label mb-2">Permisos disponibles</h4>
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto adventure-scroll">
              {allPermissions.map(p => {
                const checked = editingRole.permissions?.some(
                  rp => rp.name === p.name
                );
                return (
                  <label key={p.name} className="flex items-center space-x-2 adventure-checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!checked}
                      onChange={() => togglePermission(p.name)}
                      className="adventure-checkbox"
                    />
                    <span>{p.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista de roles */}
        <div className="adventure-panel space-y-2 max-h-60 overflow-y-auto adventure-scroll">
          {roles.map(role => (
            <div
              key={role.id}
              className="flex justify-between items-center adventure-role-row"
            >
              <div>
                <p className="font-semibold text-yellow-900">{role.name}</p>
                <p className="text-xs text-yellow-800 italic">{role.description}</p>
              </div>
              <div className="flex space-x-2">
                <EditButton
                  className="btn-adventure-mini"
                  onClick={() => handleEdit(role)}
                />
                <DeleteButton
                  className="btn-adventure-mini bg-red-100 hover:bg-red-200 text-red-800"
                  onClick={() => handleDelete(role.id)}
                />
              </div>
            </div>
          ))}
        </div>
        <style>{`
        .adventure-form {
          font-family: 'Georgia', serif;
        }
        .adventure-panel {
          background: #fffbe8;
          border: 1.6px solid #ecd18c;
          border-radius: 15px;
          padding: 13px 14px;
          box-shadow: 0 2px 10px #eddec4aa;
        }
        .adventure-input {
          background: #fff9ed;
          border: 1.4px solid #e6d2a5;
          border-radius: 12px;
          font-family: 'Georgia', serif;
          padding: 9px 12px;
          font-size: 1em;
          color: #95702a;
          box-shadow: 0 1px 3px #edd7b444;
          transition: border 0.13s;
        }
        .adventure-input:focus {
          outline: none;
          border: 1.7px solid #b89325;
          background: #fff6d8;
        }
        .adventure-label {
          color: #b89325;
          font-weight: bold;
          font-family: 'Georgia', serif;
          font-size: 1.07em;
        }
        .adventure-role-row {
          border-bottom: 1px dashed #f6e3b2;
          padding-bottom: 7px;
          margin-bottom: 2px;
          padding-top: 7px;
        }
        .adventure-checkbox-label {
          font-family: 'Georgia', serif;
          color: #705413;
        }
        .adventure-checkbox {
          width: 17px;
          height: 17px;
          accent-color: #bfa44c;
          border-radius: 5px;
        }
        .btn-adventure, .btn-adventure-secondary, .btn-adventure-mini {
          font-family: 'Georgia', serif;
          border-radius: 10px;
          font-weight: bold;
          transition: background .16s, color .16s;
        }
        .btn-adventure {
          background: linear-gradient(90deg, #ecd18c 10%, #c6a258 90%);
          color: #604a14;
          border: none;
          padding: 9px 20px;
          font-size: 1rem;
          box-shadow: 0 2px 9px #ecd99a44;
        }
        .btn-adventure:hover {
          background: linear-gradient(90deg, #ffe7b4 10%, #b89325 90%);
          color: #7d640c;
        }
        .btn-adventure-secondary {
          background: #f9f6ed;
          color: #8c7a4c;
          border: 1.2px solid #d5be80;
          padding: 9px 19px;
          font-size: 1rem;
        }
        .btn-adventure-secondary:hover {
          background: #f0e5c5;
          color: #b39334;
        }
        .btn-adventure-mini {
          background: #f3e2c0;
          color: #95702a;
          border: 1.1px solid #e1c98a;
          padding: 5px 13px;
          font-size: 0.94em;
          margin: 0 1px;
        }
        .adventure-scroll {
          scrollbar-width: thin;
          scrollbar-color: #e9c96c #faf7f2;
        }
        .adventure-scroll::-webkit-scrollbar {
          width: 8px;
          background: #faf7f2;
          border-radius: 7px;
        }
        .adventure-scroll::-webkit-scrollbar-thumb {
          background: #ecd18c;
          border-radius: 7px;
        }
      `}</style>
      </Modal>
    </>
  );

};

export default RoleCrudModal;
