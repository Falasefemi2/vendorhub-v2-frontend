/** @format */

import { useMutation } from "@tanstack/react-query";
import apiClient from "../../client";
import { SignupRequest, LoginRequest, AuthResponse } from "./types";
import { useAuthStore } from "../../../store/authstore";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: SignupRequest): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>("/auth/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      const u: any = data.user || {};
      const normalizedUser = {
        ...u,
        email: u.email || u.emai || null,
        whatsappNumber:
          (u.whatsappNumber && u.whatsappNumber.trim()) ||
          (u.whatsapp_number && u.whatsapp_number.trim()) ||
          (u.whatsapp && u.whatsapp.trim()) ||
          null,
        whatsapp_number:
          (u.whatsapp_number && u.whatsapp_number.trim()) ||
          (u.whatsappNumber && u.whatsappNumber.trim()) ||
          (u.whatsapp && u.whatsapp.trim()) ||
          null,
        storename: u.storename || u.store_name || u.storeName || null,
        slugname: u.slugname || u.store_slug || u.slug || null,
      };
      useAuthStore.setState({
        token: data.token,
        user: normalizedUser,
      });
    },
    onError: (error) => {
      console.error("signup failed", error);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await apiClient.post<AuthResponse>("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      const u: any = data.user || {};
      const normalizedUser = {
        ...u,
        email: u.email || u.emai || null,
        whatsappNumber:
          u.whatsappNumber || u.whatsapp_number || u.whatsapp || null,
        whatsapp_number:
          u.whatsapp_number || u.whatsappNumber || u.whatsapp || null,
        storename: u.storename || u.store_name || u.storeName || null,
        slugname: u.slugname || u.store_slug || u.slug || null,
      };

      useAuthStore.setState({
        token: data.token,
        user: normalizedUser,
      });
    },
    onError: (error) => {
      console.error("login failed", error);
    },
  });
};
