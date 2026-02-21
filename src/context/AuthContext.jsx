import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, signup as apiSignup } from '../services/authService';

const TOKEN_KEY = 'careconnect_token';
const USER_KEY = 'careconnect_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStoredUser = useCallback(() => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const stored = localStorage.getItem(USER_KEY);
      if (token && stored) {
        setUser(JSON.parse(stored));
        return;
      }
    } catch (_) {}
    setUser(null);
  }, []);

  useEffect(() => {
    loadStoredUser();
    setLoading(false);
  }, [loadStoredUser]);

  useEffect(() => {
    const handleStorage = () => loadStoredUser();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadStoredUser]);

  const login = async (email, password) => {
    const { token, user: userData } = await apiLogin(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const signup = async (payload) => {
    const { token, user: userData } = await apiSignup(payload);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    window.dispatchEvent(new Event('storage'));
  }, []);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isCoordinator: user?.role === 'COORDINATOR' || user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
