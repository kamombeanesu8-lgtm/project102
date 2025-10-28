import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      console.log('Not authenticated');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSession = async (sessionToken) => {
    try {
      const response = await axios.post(
        `${API}/auth/session`,
        {
          id: '',
          email: '',
          name: '',
          picture: '',
          session_token: sessionToken,
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        await checkAuth();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Session error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, handleSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
