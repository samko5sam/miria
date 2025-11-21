import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import type { User, AuthContextType } from '../types';
import { authService } from '../services/authService';

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      toast.success(t('toast.loginSuccess'));
    } catch (error) {
      toast.error(t('toast.loginError'));
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await authService.register(username, email, password);
      toast.success(t('toast.registerSuccess'));
    } catch (error) {
      toast.error(t('toast.registerError'));
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success(t('toast.logoutSuccess'));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
