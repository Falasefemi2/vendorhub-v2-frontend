/** @format */

import { create } from "zustand";
import { StoreResponse } from "../api/store/store/types";

interface StoreState {
  stores: StoreResponse[];
  isLoading: boolean;
  error: string | null;

  setStores(stores: StoreResponse[]): void;
  setIsLoading(isLoading: boolean): void;
  setError(error: string | null): void;
  reset(): void;
}

const initialState: StoreState = {
  stores: [],
  isLoading: false,
  error: null,

  setStores: () => {},
  setIsLoading: () => {},
  setError: () => {},
  reset: () => {},
};

export const useStoreStore = create<StoreState>((set) => ({
  ...initialState,

  setStores: (stores) => set({ stores }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set({ stores: [], isLoading: false, error: null }),
}));
