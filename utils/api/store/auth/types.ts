/** @format */

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  whatsappNumber: string;
  username: string;
  storename: string;
  bio: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  storename?: string;
  slugname?: string;
  role?: string;
  bio?: string;
  whatsappNumber?: string;
  // some endpoints return snake_case fields
  whatsapp_number?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
