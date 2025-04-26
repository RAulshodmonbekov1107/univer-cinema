import axiosInstance from './axiosConfig';
import { jwtDecode } from 'jwt-decode';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  password2: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  password: string;
  password2: string;
}

export const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await axiosInstance.post('/token/', credentials);
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Decode the token to get user info
      const decodedToken: any = jwtDecode(response.data.access);
      const user = {
        id: decodedToken.user_id,
        username: decodedToken.username
      };
      
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  },
  
  register: async (data: RegisterRequest) => {
    const response = await axiosInstance.post('/auth/register/', data);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me/');
    return response.data;
  },
  
  updateProfile: async (data: Partial<User>) => {
    const response = await axiosInstance.put('/auth/me/', data);
    return response.data;
  },
  
  passwordReset: async (data: PasswordResetRequest) => {
    const response = await axiosInstance.post('/auth/password-reset/', data);
    return response.data;
  },
  
  passwordResetConfirm: async (data: PasswordResetConfirmRequest) => {
    const response = await axiosInstance.post('/auth/password-reset/confirm/', data);
    return response.data;
  },
  
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  }
}; 