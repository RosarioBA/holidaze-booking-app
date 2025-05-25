// src/api/profileService.ts

import { fetchFromApi } from './api';
import { Profile } from '../types/profile';

/**
 * Updates a user profile with the API
 * 
 * @param name - Username to update
 * @param token - Authentication token
 * @param profileData - Profile data to update
 * @returns Updated profile from the API
 */
export const updateUserProfile = async (name: string, token: string, profileData: Partial<Profile>) => {
  try {
    const response = await fetchFromApi<{data: Profile}>(
      `/holidaze/profiles/${name}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Fetches a user profile from the API
 * 
 * @param name - Username to fetch
 * @param token - Authentication token
 * @returns Profile from the API
 */
export const getUserProfile = async (name: string, token: string) => {
  try {
    const response = await fetchFromApi<{data: Profile}>(
      `/holidaze/profiles/${name}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};