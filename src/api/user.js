
import axiosInstance from "./axiosInstance";

// Obtiene la lista de personas, donde cada PersonaDTO incluye el objeto user (UserDTO)
export const getPersons = async () => {
  try {
    const response = await axiosInstance.get("/api/persons");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al obtener las personas."
    );
  }
};

// Asigna o cambia el rol de un usuario según su ID mediante el endpoint /api/users/{userId}/role
// Se envía un objeto { roleType: newRole } y se espera que retorne el usuario actualizado.
export const assignRoleToUser = async (userId, newRole) => {
  try {
    const response = await axiosInstance.put(`/api/users/${userId}/role`, { roleType: newRole });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al asignar el rol."
    );
  }
};
