import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../client";
import {
  CreateProductRequest,
  UpdateProductRequest,
  ToggleProductStatusRequest,
  ProductResponse,
  ProductListResponse,
} from "./types";
import { useProductStore } from "../../../store/productstore";

export const productQueryKeys = {
  all: ["products"] as const,
  active: () => [...productQueryKeys.all, "active"] as const,
  my: () => [...productQueryKeys.all, "my"] as const,
  price: (min?: number, max?: number) =>
    [...productQueryKeys.all, "price", min ?? "", max ?? ""] as const,
  search: (q: string) => [...productQueryKeys.all, "search", q] as const,
  details: (id: string) => [...productQueryKeys.all, "detail", id] as const,
  vendor: (vendorId: string) =>
    [...productQueryKeys.all, "vendor", vendorId] as const,
  vendorActive: (vendorId: string) =>
    [...productQueryKeys.all, "vendor-active", vendorId] as const,
};

export const useGetProduct = (productId: string) => {
  const { setError, setIsLoading } = useProductStore();

  return useQuery({
    queryKey: productQueryKeys.details(productId),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<ProductResponse>(`/products`, {
          params: { id: productId },
        });
        return response.data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch product";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!productId,
  });
};

export const useGetActiveProducts = () => {
  const { setError, setIsLoading } = useProductStore();

  return useQuery({
    queryKey: productQueryKeys.active(),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response =
          await apiClient.get<ProductListResponse>(`/products/active`);
        const data = Array.isArray(response.data) ? response.data : [];
        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch active products";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
  });
};

export const useGetMyProducts = () => {
  const { setError, setIsLoading } = useProductStore();

  return useQuery({
    queryKey: productQueryKeys.my(),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response =
          await apiClient.get<ProductListResponse>(`/products/my`);
        const data = Array.isArray(response.data) ? response.data : [];
        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch your products";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
  });
};

export const useGetProductsByPrice = (min?: number, max?: number) => {
  const { setError, setIsLoading } = useProductStore();

  return useQuery({
    queryKey: productQueryKeys.price(min, max),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const params: Record<string, any> = {};
        if (typeof min === "number") params.min = min;
        if (typeof max === "number") params.max = max;

        const response = await apiClient.get<ProductListResponse>(
          `/products/price`,
          { params },
        );
        const data = Array.isArray(response.data) ? response.data : [];
        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch products by price";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: typeof min === "number" || typeof max === "number",
  });
};

export const useSearchProducts = (query: string) => {
  const { setError, setIsLoading } = useProductStore();

  return useQuery({
    queryKey: productQueryKeys.search(query),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<ProductListResponse>(
          `/products/search`,
          { params: { q: query } },
        );
        const data = Array.isArray(response.data) ? response.data : [];
        return data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to search products";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!query,
  });
};

export const useGetVendorProducts = (vendorId: string) => {
  const { setError, setIsLoading } = useProductStore();

  return useQuery({
    queryKey: productQueryKeys.vendor(vendorId),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<ProductListResponse>(
          `/vendors/${vendorId}/products`,
        );
        const data = Array.isArray(response.data) ? response.data : [];
        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor products";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!vendorId,
  });
};

export const useGetVendorActiveProducts = (vendorId: string) => {
  const { setError, setIsLoading } = useProductStore();

  return useQuery({
    queryKey: productQueryKeys.vendorActive(vendorId),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<ProductListResponse>(
          `/vendors/${vendorId}/products/active`,
        );
        const data = Array.isArray(response.data) ? response.data : [];
        return data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor active products";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!vendorId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { setError } = useProductStore();

  return useMutation({
    mutationFn: async (data: CreateProductRequest) => {
      const response = await apiClient.post<ProductResponse>(`/products`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.my() });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.active() });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to create product";
      setError(message);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { setError } = useProductStore();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductRequest;
    }) => {
      const response = await apiClient.put<ProductResponse>(
        `/products/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, vars) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.details(vars.id),
      });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.my() });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.active() });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to update product";
      setError(message);
    },
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();
  const { setError } = useProductStore();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ToggleProductStatusRequest;
    }) => {
      const response = await apiClient.put<ProductResponse>(
        `/products/${id}/status`,
        data,
      );
      return response.data;
    },
    onSuccess: (_, vars) => {
      // Invalidate affected queries
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.details(vars.id),
      });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.my() });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.active() });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to toggle product status";
      setError(message);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { setError } = useProductStore();

  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiClient.delete<{ success: boolean }>(
        `/products/${productId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate affected queries
      queryClient.invalidateQueries({ queryKey: productQueryKeys.my() });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.active() });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete product";
      setError(message);
    },
  });
};


export interface UploadProductImageRequest {
  image: File;
  position?: number;
}

export interface UpdateImagePositionRequest {
  position: number;
}

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();
  const { setError } = useProductStore();

  return useMutation({
    mutationFn: async ({
      productId,
      image,
      position,
    }: {
      productId: string;
      image: File;
      position?: number;
    }) => {
      const formData = new FormData();
      formData.append("image", image);
      if (typeof position === "number") {
        formData.append("position", position.toString());
      }

      const response = await apiClient.post<ProductResponse>(
        `/products/${productId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate the product details to refresh images
      queryClient.invalidateQueries({
        queryKey: productQueryKeys.details(data.id),
      });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.my() });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to upload image";
      setError(message);
    },
  });
};

export const useUpdateImagePosition = () => {
  const queryClient = useQueryClient();
  const { setError } = useProductStore();

  return useMutation({
    mutationFn: async ({
      imageId,
      position,
    }: {
      imageId: string;
      position: number;
    }) => {
      const response = await apiClient.put(
        `/images/${imageId}/position`,
        { position },
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all product queries since image order changed
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.my() });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update image position";
      setError(message);
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  const { setError } = useProductStore();

  return useMutation({
    mutationFn: async (imageId: string) => {
      const response = await apiClient.delete<{ success: boolean }>(
        `/images/${imageId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all product queries since images changed
      queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: productQueryKeys.my() });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to delete image";
      setError(message);
    },
  });
};
