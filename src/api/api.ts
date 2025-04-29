// src/api/api.ts
const API_BASE_URL = 'https://v2.api.noroff.dev';

export async function fetchFromApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log(`Making API request to: ${url}`);
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API error response:', data);
      throw {
        status: response.status,
        message: data.message || `API error: ${response.statusText}`,
        data
      };
    }

    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}