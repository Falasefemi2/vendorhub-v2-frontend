import { ProductListResponse } from "../product/types";

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

export interface MyStoreResponse {
  store: StoreResponse;
  products: ProductListResponse[];
  store_url: string;
}

export type StoreListResponse = StoreResponse[];


export interface UpdateStoreRequest {
  bio?: string;
  email?: string;
  store_name?: string;
  username?: string;
  whatsapp_number?: string;
}
