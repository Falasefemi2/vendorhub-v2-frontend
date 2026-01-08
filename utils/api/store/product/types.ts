export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  is_active?: boolean;
}

export interface ToggleProductStatusRequest {
  is_active: boolean;
}

export interface ProductResponse {
  id: string;
  user_id: string;
  name: string;
  description: string;
  price: number;
  is_active: boolean;
  images: ProductImageResponse[];
  created_at: string;
  updated_at: string;
}

export interface ProductImageResponse {
  id: string;
  imageUrl: string;
  position: number;
}

export type ProductListResponse = ProductResponse[];


