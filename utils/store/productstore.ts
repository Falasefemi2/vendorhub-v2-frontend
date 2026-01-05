import { create } from "zustand";
import { ProductResponse } from "../api/store/product/types";

interface ProductState {
    products: ProductResponse[];
    activeProducts: ProductResponse[];
    myProducts: ProductResponse[];
    isLoading: boolean;
    error: string | null;

    setProducts(products: ProductResponse[]): void;
    setActiveProducts(products: ProductResponse[]): void;
    setMyProducts(products: ProductResponse[]): void;
    setIsLoading(isLoading: boolean): void;
    setError(error: string | null): void;
    reset(): void;
}

const initialState: ProductState = {
    products: [],
    activeProducts: [],
    myProducts: [],
    isLoading: false,
    error: null,

    setProducts: () => { },
    setActiveProducts: () => { },
    setMyProducts: () => { },
    setIsLoading: () => { },
    setError: () => { },
    reset: () => { },
};

export const useProductStore = create<ProductState>((set) => ({
    ...initialState,

    setProducts: (products) => set({ products }),

    setActiveProducts: (products) => set({ activeProducts: products }),

    setMyProducts: (products) => set({ myProducts: products }),

    setIsLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    reset: () =>
        set({
            products: [],
            activeProducts: [],
            myProducts: [],
            isLoading: false,
            error: null,
        }),
}));
