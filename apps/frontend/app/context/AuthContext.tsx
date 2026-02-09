'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api/v1/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/session`, {
        withCredentials: true,
      });
      
      const { message } = response.data;
      if (message?.isAuthenticated && message?.user) {
        setUser(message.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/signup`,
        { email, username, password },
        { withCredentials: true }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || 'Signup failed'
      );
    }
  };

  const verifyOtp = async (email: string, otpEntered: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/verify-mail`,
        { email, otpEntered },
        { withCredentials: true }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'OTP verification failed');
      }
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || 'OTP verification failed'
      );
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/signin`,
        { username, password },
        { withCredentials: true }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || 'Login failed'
      );
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        signup,
        verifyOtp,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
