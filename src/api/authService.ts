/**
 * @file authService.ts
 * @description Service for handling authentication operations including user registration and login
 */

import { fetchFromApi } from './api';
import { AuthResponse, LoginData, RegisterData } from '../types/user';

/**
 * Register a new user with the API
 * 
 * @param {RegisterData} data - Registration data including email, password, and user details
 * @returns {Promise<AuthResponse>} Promise resolving to authentication data including user and token
 * @throws {Error} If registration fails
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const result = await fetchFromApi<{ data: AuthResponse }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    return result.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Authenticate a user with the API
 * 
 * @param {LoginData} data - Login credentials including email and password
 * @returns {Promise<AuthResponse>} Promise resolving to authentication data including user and token
 * @throws {Error} If login fails
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const result = await fetchFromApi<{ data: AuthResponse }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    return result.data;
  } catch (error) {
    throw error;
  }
};