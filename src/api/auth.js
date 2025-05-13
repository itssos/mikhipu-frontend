import { api } from './apiHelper';

export const loginUser = async credentials => {
  if (!credentials.username || !credentials.password) {
    throw new Error('El nombre de usuario y la contraseña son obligatorios.');
  }

  const data = await api.post('/api/auth/login', credentials);
  if (!data.token || !data.person) {
    throw new Error('Respuesta inválida del servidor.');
  }
  return data;
};

export const forgotPassword = email => {
  if (!email) throw new Error('El correo electrónico es requerido.');
  return api.post('/api/auth/forgot-password', { email });
};

export const resetPassword = ({ token, newPassword }) => {
  if (!token) throw new Error('El token de recuperación es obligatorio.');
  if (!newPassword || newPassword.length < 8) {
    throw new Error('La nueva contraseña debe tener al menos 8 caracteres.');
  }
  return api.post('/api/auth/reset-password', { token, newPassword });
};
