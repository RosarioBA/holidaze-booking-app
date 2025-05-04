// src/api/authService.ts
import { fetchFromApi } from './api';
import { AuthResponse, LoginData, RegisterData } from '../types/user';

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const result = await fetchFromApi<{ data: AuthResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    return result.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const result = await fetchFromApi<{ data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    return result.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};