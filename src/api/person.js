// src/api/person.js
import axiosInstance from "./axiosInstance";

// Obtiene la lista de personas (cada uno incluye el objeto user con roles)
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

// Crea una nueva persona. Se espera enviar un objeto según el esquema PersonCreateDTO,
// que incluye los datos de la persona y un objeto "user" con sus datos y roles.
export const createPerson = async (personData) => { 
  try {
    const response = await axiosInstance.post("/api/persons", personData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al crear la persona."
    );
  }
};

// Actualiza una persona (PUT /api/persons/{id}). Se envía un objeto similar al de crear.
export const updatePerson = async (id, personData) => {
  try {
    const response = await axiosInstance.put(`/api/persons/${id}`, personData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al actualizar la persona."
    );
  }
};

// Elimina una persona (DELETE /api/persons/{id})
export const deletePerson = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/persons/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar la persona."
    );
  }
};
