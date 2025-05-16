import React, { createContext, useState, useEffect } from 'react';
import API from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      // Login endpoint is 'auth/token/login/' relative to baseURL
      const res = await API.post('auth/token/login/', credentials);
      localStorage.setItem('token', res.data.auth_token);
      await fetchUser();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (data) => {
    try {
      // Register endpoint is 'auth/users/' relative to baseURL
      await API.post('auth/users/', data);
      await login({ username: data.username, password: data.password });
    } catch (err) {
      const errorMessage = err.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const fetchUser = async () => {
    try {
      // Get current user details endpoint is 'auth/users/me/' relative to baseURL
      const res = await API.get('auth/users/me/');
      setUser(res.data);
    } catch (err) {
      setUser(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
