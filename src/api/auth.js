import axiosInstance from './axiosInstance';

export const loginUser = async (credentials) => {
  if (!credentials.username || !credentials.password) {
    throw new Error("El nombre de usuario y la contraseña son obligatorios.");
  }

  try {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    // Se espera que la respuesta incluya: { token, tokenType, person, user }
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