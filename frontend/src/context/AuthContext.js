import React, { createContext, useState, useEffect } from 'react';
import API from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const res = await API.post('/auth/token/login/', credentials);
    localStorage.setItem('authToken', res.data.auth_token);
    fetchUser();
  };

  const register = async (data) => {
    await API.post('/auth/users/', data);
    await login({ username: data.username, password: data.password });
  };

  const fetchUser = async () => {
    try {
      const res = await API.get('/auth/users/me/');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  useEffect(() => {
    if (localStorage.getItem('authToken')) fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

