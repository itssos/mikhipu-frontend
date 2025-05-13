// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import { loginUser } from '../api/auth';

export const AuthContext = createContext();

const TOKEN_EXPIRATION_TIME = 3600000; // 1 hora en ms

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [tokenType, setTokenType] = useState(null);
  const [person, setPerson] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimeoutRef = useRef(null);

  const logout = () => {
    setToken(null);
    setTokenType(null);
    setPerson(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('person');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenTimestamp');
    delete axiosInstance.defaults.headers.common['Authorization'];
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
  };

  const scheduleLogout = (timestamp) => {
    const elapsed = Date.now() - Number(timestamp);
    const remaining = TOKEN_EXPIRATION_TIME - elapsed;
    if (remaining <= 0) {
      logout();
    } else {
      logoutTimeoutRef.current = setTimeout(logout, remaining);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedTokenType = localStorage.getItem('tokenType');
    const storedPerson = localStorage.getItem('person');
    const storedUser = localStorage.getItem('user');
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');

    if (storedToken && storedTokenType && storedPerson && storedUser && tokenTimestamp) {
      const age = Date.now() - Number(tokenTimestamp);
      if (age < TOKEN_EXPIRATION_TIME) {
        setToken(storedToken);
        setTokenType(storedTokenType);
        setPerson(JSON.parse(storedPerson));
        setUser(JSON.parse(storedUser));
        axiosInstance.defaults.headers.common['Authorization'] = `${storedTokenType} ${storedToken}`;
        scheduleLogout(tokenTimestamp);
      } else {
        logout();
      }
    }

    setLoading(false);
    return () => {
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    };
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);
    const { token: newToken, tokenType: newType, person: newPerson } = data;
    if (!newToken || !newPerson) {
      throw new Error('Respuesta de autenticación incompleta.');
    }

    setToken(newToken);
    setTokenType(newType);
    setPerson(newPerson);
    setUser(newPerson.user);
    localStorage.setItem('token', newToken);
    localStorage.setItem('tokenType', newType);
    localStorage.setItem('person', JSON.stringify(newPerson));
    localStorage.setItem('user', JSON.stringify(newPerson.user));
    const timestamp = Date.now().toString();
    localStorage.setItem('tokenTimestamp', timestamp);

    axiosInstance.defaults.headers.common['Authorization'] = `${newType} ${newToken}`;
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    scheduleLogout(timestamp);
  };

  return (
    <AuthContext.Provider value={{ token, tokenType, user, person, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
