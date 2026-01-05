import { create } from "zustand";
import { User } from "../api/store/auth/types";
import { persist } from "zustand/middleware";

interface AdminState {
    pendingVendors: User[];
    approvedVendors: User[];
    selectedVendor: User | null;
    isLoading: boolean;
    isFetching: boolean;
    error: string | null;

    setPendingVendors(vendors: User[]): void;
    setApprovedVendors(vendors: User[]): void;
    setSelectedVendor(vendor: User | null): void;
    setIsLoading(isLoading: boolean): void;
    setIsFetching(isFetching: boolean): void;
    setError(error: string | null): void;
}

const initialAdminState = {
    pendingVendors: [],
    approvedVendors: [],
    selectedVendor: null,
    isLoading: false,
    isFetching: false,
    error: null,
};

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            ...initialAdminState,

            setPendingVendors: (vendors) => set({ pendingVendors: vendors }),

            setApprovedVendors: (vendors) => set({ approvedVendors: vendors }),

            setSelectedVendor: (vendor) => set({ selectedVendor: vendor }),

            removeFromPending: (vendorId: string | undefined) =>
                set((state) => ({
                    pendingVendors: state.pendingVendors.filter((v) => v.id !== vendorId),
                    selectedVendor:
                        state.selectedVendor?.id === vendorId ? null : state.selectedVendor,
                })),

            addToApproved: (vendor: User) =>
                set((state) => ({
                    approvedVendors: state.approvedVendors.some((v) => v.id === vendor.id)
                        ? state.approvedVendors
                        : [vendor, ...state.approvedVendors],
                })),

            setIsLoading: (loading) => set({ isLoading: loading }),

            setIsFetching: (fetching) => set({ isFetching: fetching }),

            setError: (error) => set({ error }),

            clearError: () => set({ error: null }),

            reset: () => set(initialAdminState),
        }),
        {
            name: "admin-store",
            partialize: (state) => ({
                pendingVendors: state.pendingVendors,
                approvedVendors: state.approvedVendors,
                selectedVendor: state.selectedVendor,
            }),
        },
    ),
);
