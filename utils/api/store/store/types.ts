/** @format */

export interface StoreResponse {
  id: string;
  name: string;
  slug: string;
  username: string;
  bio: string;
  whatsapp_number: string;
  email: string;
  updated_at?: string;
}

export type StoreListResponse = StoreResponse[];
