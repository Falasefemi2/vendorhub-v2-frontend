/** @format */

import { useQuery } from "@tanstack/react-query";
import apiClient from "../../client";
import { StoreResponse, StoreListResponse } from "./types";
import { useStoreStore } from "@/utils/store/storestore";

export const storeQueryKeys = {
  all: ["stores"] as const,
  list: (page = 1, page_size = 20) =>
    [...storeQueryKeys.all, "list", page, page_size] as const,
  search: (q: string) => [...storeQueryKeys.all, "search", q] as const,
  details: (id: string) => [...storeQueryKeys.all, "detail", id] as const,
  slug: (slug: string) => [...storeQueryKeys.all, "slug", slug] as const,
};

export const useGetStores = (page = 1, page_size = 20) => {
  const { setError, setIsLoading } = useStoreStore();

  return useQuery({
    queryKey: storeQueryKeys.list(page, page_size),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<StoreListResponse>(`/stores`, {
          params: { page, page_size },
        });
        const data = Array.isArray(response.data) ? response.data : [];
        return data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch stores";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useSearchStores = (q: string) => {
  const { setError, setIsLoading } = useStoreStore();

  return useQuery({
    queryKey: storeQueryKeys.search(q),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<StoreListResponse>(
          `/stores/search`,
          {
            params: { q },
          }
        );
        const data = Array.isArray(response.data) ? response.data : [];
        return data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to search stores";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!q,
  });
};

export const useGetStoreById = (id: string) => {
  const { setError, setIsLoading } = useStoreStore();

  return useQuery({
    queryKey: storeQueryKeys.details(id),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<any>(`/stores/vendor`, {
          params: { id },
        });

        // API may return a wrapper like { store: {...}, products: [...] }
        if (response.data && response.data.store) {
          return response.data.store as StoreResponse;
        }

        return response.data as StoreResponse;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch store by id";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!id,
  });
};

export const useGetStoreBySlug = (slug: string) => {
  const { setError, setIsLoading } = useStoreStore();

  return useQuery({
    queryKey: storeQueryKeys.slug(slug),
    queryFn: async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<any>(`/stores/${slug}`);

        // Some endpoints return { store, products, store_url }
        if (response.data && response.data.store) {
          // return the wrapper so callers can access products and store_url
          return response.data;
        }

        return response.data as StoreResponse;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch store by slug";
        setError(message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    enabled: !!slug,
  });
};
