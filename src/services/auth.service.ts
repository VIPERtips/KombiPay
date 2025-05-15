import { LoginFormValues } from '../lib/schemas';
import { api } from './api';

// Types matching the API response structures
export type AuthResponse = {
  message: string;
  success: boolean;
  data: {
    token: string;
    role: string;
    refreshToken: string;
    message: string;
    status: string;
    id: number;
  };
};

export type RegisterResponse = {
  message: string;
  success: boolean;
  data: Record<string, any>;
};

export type OtpResponse = {
  message: string;
  success: boolean;
  data: string;
};

export type UserRegisterRequest = {
  id?: number;
  password: string;
  confirmPassword: string;
  email: string;
  fullname: string;
};

// Service functions for auth operations
export const authService = {
  login: async (credentials: LoginFormValues): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      // Add proper error typing
      if (error.response?.data?.message?.includes('OTP')) {
        throw new Error('OTP_NOT_CONFIRMED');
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  
  register: async (userData: UserRegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register?role=PASSENGER', userData);
    return response.data;
  },
  
  requestOtp: async (email: string): Promise<string> => {
    const response = await api.post<string>(`/auth/request-otp?email=${email}`);
    return response.data;
  },
  
  confirmOtp: async (email: string, otp: string): Promise<OtpResponse> => {
    const response = await api.post<OtpResponse>(`/auth/confirm-otp?email=${email}&otp=${otp}`);
    return response.data;
  },
  
  forgotPassword: async (email: string): Promise<string> => {
    const response = await api.post<string>(`/auth/forgot-password?email=${email}`);
    return response.data;
  },
  
  resetPassword: async (token: string, newPassword: string): Promise<string> => {
    const response = await api.post<string>(`/auth/reset-password?token=${token}&newPassword=${newPassword}`);
    return response.data;
  },
  
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(`/auth/refresh-token?refreshToken=${refreshToken}`);
    return response.data;
  }
};
