import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';

export type User = {
  id: number;
  name: string;
  email: string;
  balance?: number;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
  requestOtp: (email: string) => Promise<void>;
  confirmOtp: (email: string, otp: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('kombiPayUser');
        const token = await AsyncStorage.getItem('kombiPayToken');
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        const userData: User = {
          id: response.data.id,
          name: response.data.message || email,
          email,
          role: response.data.role,
        };
  
        await AsyncStorage.setItem('kombiPayUser', JSON.stringify(userData));
        await AsyncStorage.setItem('kombiPayToken', response.data.token);
        await AsyncStorage.setItem('kombiPayRefreshToken', response.data.refreshToken);
  
        setUser(userData);
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      
      // Handle OTP specific error
      if (error.message === 'OTP_NOT_CONFIRMED') {
        await AsyncStorage.setItem('pendingEmail', email);
        throw new Error('Please confirm your OTP first');
      }
      
      throw new Error(error.message || 'Login error');
    } finally {
      setIsLoading(false);
    }
  };


  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        email,
        fullname: name,
        password,
        confirmPassword,
      });

      if (!response.success) {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async (email: string) => {
    try {
      await authService.requestOtp(email);
    } catch (error) {
      console.error('OTP request error:', error);
      throw error;
    }
  };

  const confirmOtp = async (email: string, otp: string) => {
    try {
      const response = await authService.confirmOtp(email, otp);
      return response.success;
    } catch (error) {
      console.error('OTP confirmation error:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      return await authService.forgotPassword(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      return await authService.resetPassword(token, newPassword);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.multiRemove(['kombiPayUser', 'kombiPayToken', 'kombiPayRefreshToken']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        requestOtp,
        confirmOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
