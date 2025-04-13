
import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);     // UserDTO (incluye roles como array)
  const [person, setPerson] = useState(null); // PersonDTO, puede ser null
  const [loading, setLoading] = useState(true);

  // Recupera la sesión almacenada al iniciar la app
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedPerson = localStorage.getItem('person');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Si storedPerson es una cadena vacía o nula, se asigna null
      setPerson(storedPerson ? JSON.parse(storedPerson) : null);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    if (!data.token || !data.user) {
      throw new Error("Datos de autenticación incompletos.");
    }
    // person puede ser null
    setToken(data.token);
    setUser(data.user);
    setPerson(data.person || null);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('person', data.person ? JSON.stringify(data.person) : '');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPerson(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('person');
  };

  return (
    <AuthContext.Provider value={{ token, user, person, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
