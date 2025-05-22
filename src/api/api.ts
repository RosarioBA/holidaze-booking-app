/**
 * @file api.ts
 * @description Core API utilities for making requests to the Noroff API
 */

// API base URL - Change to use Vite proxy
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://v2.api.noroff.dev' 
  : '/api';

// API key for Noroff API
const API_KEY = '54941b48-0ce5-4d6d-a8f2-9e3dcc28ddcf';

/**
 * Generic function to fetch data from the API
 * 
 * @template T The expected return type of the API call
 * @param {string} endpoint - The API endpoint to call (without base URL)
 * @param {RequestInit} options - Fetch options for the request
 * @returns {Promise<T>} A promise that resolves to the API response data
 * @throws {Error} If the request fails or returns an error status
 */
export const fetchFromApi = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers);
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  headers.set('X-Noroff-API-Key', API_KEY);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.errors?.[0]?.message || `API error: ${response.statusText}`);
      } catch (e) {
        throw new Error(`API error: ${response.statusText}`);
      }
    }
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      return null as unknown as T;
    }
    
    // Check if response has content
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    
    if (contentLength === '0' || !contentType || !contentType.includes('application/json')) {
      return null as unknown as T;
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Extract username from JWT token or retrieve from localStorage
 * 
 * @param {string} token - The JWT token to extract username from
 * @returns {string|null} The extracted username or null if not found
 * @throws {Error} If username cannot be extracted
 */
export const getUsernameFromToken = (token: string): string => {
  // First try: Get username from user object in localStorage
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.name) {
        return user.name;
      }
    }
  } catch (e) {
    // Silent fail and try next method
  }
  
  // Second try: Extract from token
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Check different possible names
      const username = payload.name || payload.sub || payload.email;
      if (username) {
        return username;
      }
    }
  } catch (e) {
    // Silent fail and use fallback
  }
  
  // If all methods fail, throw an error to be handled by the caller
  throw new Error('Could not extract username from token or localStorage');
};