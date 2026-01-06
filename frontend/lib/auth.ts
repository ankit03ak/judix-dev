import Cookies from 'js-cookie';
import api from './api';
import toast from 'react-hot-toast';

export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    avatar?: string;
    token: string;
  };
  message: string;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  
  if (response.data.success && response.data.data.token) {
    Cookies.set('token', response.data.data.token, { expires: 30 });
    Cookies.set('user', JSON.stringify({
      _id: response.data.data._id,
      name: response.data.data.name,
      email: response.data.data.email,
      bio: response.data.data.bio,
      avatar: response.data.data.avatar,
    }), { expires: 30 });
  }
  
  return response.data;
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', { name, email, password });
  
  if (response.data.success && response.data.data.token) {
    Cookies.set('token', response.data.data.token, { expires: 30 });
    Cookies.set('user', JSON.stringify({
      _id: response.data.data._id,
      name: response.data.data.name,
      email: response.data.data.email,
      bio: response.data.data.bio,
      avatar: response.data.data.avatar,
    }), { expires: 30 });
  }
  
  return response.data;
};

export const logout = () => {
  Cookies.remove('token');
  Cookies.remove('user');
  toast.success('Logged out successfully');
  window.location.href = '/login';
};

export const getCurrentUser = (): User | null => {
  const userStr = Cookies.get('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get('token');
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data: Partial<User>) => {
  const response = await api.put('/auth/profile', data);
  
  if (response.data.success) {
    Cookies.set('user', JSON.stringify(response.data.data), { expires: 30 });
  }
  
  return response.data;
};
