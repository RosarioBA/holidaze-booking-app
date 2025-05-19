// src/types/rating.ts
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