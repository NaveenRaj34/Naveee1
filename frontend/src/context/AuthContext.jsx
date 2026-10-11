import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jobshield_access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('jobshield_access_token');
      const storedUser = localStorage.getItem('jobshield_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          // Silently verify with profile
          const res = await authAPI.getProfile();
          if (res.data && res.data.data) {
            setUser(res.data.data);
            localStorage.setItem('jobshield_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.warn("Session restore warning:", err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data && res.data.success) {
      const { user: userData, access, refresh } = res.data.data;
      localStorage.setItem('jobshield_access_token', access);
      localStorage.setItem('jobshield_refresh_token', refresh);
      localStorage.setItem('jobshield_user', JSON.stringify(userData));
      setUser(userData);
      setToken(access);
      return userData;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    if (res.data && res.data.success) {
      const { user: userData, access, refresh } = res.data.data;
      localStorage.setItem('jobshield_access_token', access);
      localStorage.setItem('jobshield_refresh_token', refresh);
      localStorage.setItem('jobshield_user', JSON.stringify(userData));
      setUser(userData);
      setToken(access);
      return userData;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = () => {
    try {
      authAPI.logout();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('jobshield_access_token');
    localStorage.removeItem('jobshield_refresh_token');
    localStorage.removeItem('jobshield_user');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
