import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default dummy user when not authenticated
  const dummyUser = {
    id: 0,
    email: 'guest@example.com',
    name: 'John',
    subscriptionTier: 'free'
  };

  useEffect(() => {
    // Check for stored auth data
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (email, password, name) => {
    try {
      const data = await authService.register(email, password, name);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message || error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user: user || dummyUser, // Return dummy user if not authenticated
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

