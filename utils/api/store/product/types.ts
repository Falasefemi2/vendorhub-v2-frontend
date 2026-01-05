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
    created_at: string;
    updated_at: string;
}

export type ProductListResponse = ProductResponse[];
