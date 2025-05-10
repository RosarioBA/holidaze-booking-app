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
  
  // Debug headers
  const headers = new Headers(options.headers);
  console.log("Headers for request:", Object.fromEntries([...headers.entries()]));
  
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  headers.set('X-Noroff-API-Key', API_KEY);
  
  try {
    console.log(`Sending ${options.method || 'GET'} request to: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(errorData.errors?.[0]?.message || `API error: ${response.statusText}`);
      } catch (e) {
        console.error('Could not parse error response');
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
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Extract username from JWT token or get from localStorage
 */
export const getUsernameFromToken = (token: string): string => {
  // First try: Get username from user object in localStorage
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.name) {
        console.log("Using username from localStorage:", user.name);
        return user.name;
      }
    }
  } catch (e) {
    console.error("Error reading username from localStorage:", e);
  }
  
  // Second try: Extract from token
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      console.log("Token payload:", payload);
      
      // Check different possible names
      const username = payload.name || payload.sub || payload.email;
      if (username) {
        console.log("Username from token:", username);
        return username;
      }
    }
  } catch (e) {
    console.error("Error extracting username from token:", e);
  }
  
  // If all else fails, use hardcoded username from logs
  // This is just temporary to get things working
  console.warn("Using hardcoded username as fallback - fix this later!");
  return "rosario99";
};