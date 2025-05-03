// src/api/api.ts
const API_BASE_URL = 'https://v2.api.noroff.dev';

export async function fetchFromApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = {
      status: response.status,
      message: `API error: ${response.statusText}`,
    };
    
    try {
      const errorData = await response.json();
      error.message = errorData.message || error.message;
    } catch {
      // If JSON parsing fails, use the default error message
    }
    
    throw error;
  }

  return response.json() as Promise<T>;
}