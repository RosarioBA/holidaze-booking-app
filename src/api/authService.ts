// src/api/authService.ts
import { fetchFromApi } from './api';
import { AuthResponse, LoginData, RegisterData } from '../types/user';

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return fetchFromApi<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  return fetchFromApi<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};