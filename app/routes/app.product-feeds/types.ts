export interface ProductFeed {
  id: string;
  country: string;
  language: string;
  status: string;
}

// Alias for backward compatibility
export type Feed = ProductFeed;
