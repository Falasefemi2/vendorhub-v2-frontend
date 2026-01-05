export interface ApproveVendor {
    vendorID: string;
}

export interface ErrorResponse {
    message: string;
    code?: string;
    details?: Record<string, any>;
}

export interface Vendor {
    id: string;
    name: string;
    email: string;
    whatsapp_number: string;
    username: string;
    bio: string;
    store_name: string;
    store_slug: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export type VendorListResponse = Vendor[];

export interface ApproveVenderResponse {
    success: boolean;
    message: string;
    vendor?: Vendor;
}
