import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { storage } from '../services/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userEmail: string | null;
  setIsAuthenticated: (value: boolean) => void;
  setUserEmail: (email: string | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = storage.getString('userToken');
    const email = storage.getString('userEmail');

    if (token && email) {
      setUserEmail(email);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  const logout = async () => {
    await authService.logout();
    setUserEmail(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext
      value={{
        isAuthenticated,
        isLoading,
        userEmail,
        setIsAuthenticated,
        setUserEmail,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth must be executed within an AuthProvider structural tree.',
    );
  }
  return context;
};
