// src/api/auth.js
import axiosInstance from './axiosInstance';

export const loginUser = async (credentials) => {
  if (!credentials.username || !credentials.password) {
    throw new Error("El nombre de usuario y la contraseña son obligatorios.");
  }
  try {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    if (response.data && response.data.token && response.data.user) {
      return response.data; // person puede ser null, lo cual es aceptable
    } else {
      throw new Error("Respuesta inválida del servidor.");
    }
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Error al iniciar sesión.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const forgotPassword = async (email) => {
  if (!email) {
    throw new Error("El correo electrónico es requerido.");
  }
  try {
    const response = await axiosInstance.post("/api/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Error al enviar el correo de recuperación.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const resetPassword = async ({ token, newPassword }) => {
  if (!token) {
    throw new Error("El token de recuperación es obligatorio.");
  }
  if (!newPassword || newPassword.length < 8) {
    throw new Error("La nueva contraseña debe tener al menos 8 caracteres.");
  }
  try {
    const response = await axiosInstance.post("/api/auth/reset-password", { token, newPassword });
    // Se espera recibir un string con el mensaje del backend
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Error al restablecer la contraseña.");
    } else {
      throw new Error(error.message);
    }
  }
};
