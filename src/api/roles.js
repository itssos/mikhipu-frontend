// src/api/roles.js
import axiosInstance from "./axiosInstance";

// Obtiene la lista de roles
export const getRoles = async () => {
  try {
    const response = await axiosInstance.get("/api/roles");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener los roles."
    );
  }
};

// Crea un nuevo rol
export const createRole = async (roleData) => {
  try {
    const response = await axiosInstance.post("/api/roles", roleData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al crear el rol."
    );
  }
};

// Actualiza un rol existente
export const updateRole = async (id, roleData) => {
  try {
    const response = await axiosInstance.put(`/api/roles/${id}`, roleData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al actualizar el rol."
    );
  }
};

// Elimina un rol
export const deleteRole = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/roles/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar el rol."
    );
  }
};
