// src/api/api.ts

// API base URL - Change to use Vite proxy
export const API_BASE_URL = '/api';

// API key for Noroff API
const API_KEY = '54941b48-0ce5-4d6d-a8f2-9e3dcc28ddcf';

/**
 * Generic function to fetch data from the API
 */
export const fetchFromApi = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Create headers with API key
  const headers = new Headers(options.headers);
  
  // Add Content-Type if not present
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add API key
  headers.set('X-Noroff-API-Key', API_KEY);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error(errorData.errors?.[0]?.message || `API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Extract username from JWT token
 */
export const getUsernameFromToken = (token: string): string => {
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(atob(tokenParts[1]));
    const username = payload.name;
    
    if (!username) {
      throw new Error('Could not extract username from token');
    }
    
    return username;
  } catch (error) {
    console.error('Error extracting username from token:', error);
    throw new Error('Invalid authentication token');
  }
};