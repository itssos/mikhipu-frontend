// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useRef } from 'react';
import { loginUser } from '../api/auth';

export const AuthContext = createContext();

const TOKEN_EXPIRATION_TIME = 3600000;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Referencia para almacenar el timeout del logout
  const logoutTimeoutRef = useRef(null);

  // Función para realizar logout y limpiar timeout
  const logout = () => {
    setToken(null);
    setUser(null);
    setPerson(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('person');
    localStorage.removeItem('tokenTimestamp');
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    console.log("Logout ejecutado");
  };

  // Función que programa el logout basado en la expiración
  const scheduleLogout = (timestamp) => {
    const tokenAge = Date.now() - Number(timestamp);
    const remaining = TOKEN_EXPIRATION_TIME - tokenAge;
    const secondsRemaining = Math.floor(remaining / 1000);
    const expirationDate = new Date(Number(timestamp) + TOKEN_EXPIRATION_TIME);
    console.log(`Tiempo restante para logout: ${secondsRemaining} segundos. Expirará a: ${expirationDate.toLocaleString()}`);
    if (remaining <= 0) {
      logout();
    } else {
      logoutTimeoutRef.current = setTimeout(() => {
        logout();
      }, remaining);
    }
  };

  // Al montar, se carga el token y se programa el logout si es necesario
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedPerson = localStorage.getItem('person');
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');
    if (storedToken && storedUser && tokenTimestamp) {
      const tokenAge = Date.now() - Number(tokenTimestamp);
      if (tokenAge < TOKEN_EXPIRATION_TIME) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setPerson(storedPerson ? JSON.parse(storedPerson) : null);
        scheduleLogout(tokenTimestamp);
      } else {
        logout();
      }
    }
    setLoading(false);
    // Limpiar timeout al desmontar el componente
    return () => {
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
      }
    };
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    if (!data.token || !data.user) {
      throw new Error("Datos de autenticación incompletos.");
    }
    setToken(data.token);
    setUser(data.user);
    setPerson(data.person || null);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('person', data.person ? JSON.stringify(data.person) : "");
    // Guarda la hora de login
    const timestamp = Date.now().toString();
    localStorage.setItem('tokenTimestamp', timestamp);
    // Si existe un timeout anterior, se limpia
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
    }
    scheduleLogout(timestamp);
  };

  return (
    <AuthContext.Provider value={{ token, user, person, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
