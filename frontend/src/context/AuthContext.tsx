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
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await authService.login(email, password);
      const loggedInUser = await authService.getCurrentUser();
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

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
