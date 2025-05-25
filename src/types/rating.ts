// src/types/rating.ts

/**
 * @file rating.ts
 * @description Type definitions for rating-related interfaces
 */

export interface Rating {
    id: string;
    rating: number;
    comment?: string;
    userId: string;
    userName: string;
    date: string;
    user?: {
      name: string;
      email?: string;
      avatar?: {
        url: string;
        alt?: string;
      };
    };
    created: string;
  }