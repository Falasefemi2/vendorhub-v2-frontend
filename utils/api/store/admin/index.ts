import { useAdminStore } from "@/utils/store/adminstore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { set } from "zod";
import apiClient from "../../client";
import { ApproveVenderResponse, VendorListResponse } from "./types";

export const adminQueryKeys = {
    all: ["admin"] as const,
    vendors: () => [...adminQueryKeys.all, "vendors"] as const,
    vendorList: () => [...adminQueryKeys.all, "vendor-list"] as const,
    pendingVendors: () => [...adminQueryKeys.all, "pending-vendors"] as const,
    approvedVendors: () => [...adminQueryKeys.all, "approved-vendors"] as const,
    details: (vendorID: string) =>
        [...adminQueryKeys.all, "vendor", vendorID] as const,
    detail: (vendorID: string) =>
        [...adminQueryKeys.all, "vendor-detail", vendorID] as const,
};

// Get pending vendors
export const usePendingVendors = () => {
    const { setError, setIsLoading } = useAdminStore();

    return useQuery({
        queryKey: adminQueryKeys.pendingVendors(),
        queryFn: async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<VendorListResponse>(
                    "/admin/vendors/pending",
                );
                return Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch pending vendors";
                setError(message);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
    });
};

// Get approved vendors
export const useApprovedVendors = () => {
    const { setError, setIsLoading } = useAdminStore();

    return useQuery({
        queryKey: adminQueryKeys.approvedVendors(),
        queryFn: async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get<VendorListResponse>(
                    "/admin/vendors/approved",
                );
                return Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch approved vendors";
                setError(message);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
    });
};

// Approve vendor
export const useApproveVendor = () => {
    const queryClient = useQueryClient();
    const { setError } = useAdminStore();

    return useMutation({
        mutationFn: async (vendorId: string) => {
            const response = await apiClient.post<ApproveVenderResponse>(
                `/admin/vendors/${vendorId}/approve`,
            );
            return response.data;
        },
        onSuccess: (data) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({
                queryKey: adminQueryKeys.pendingVendors(),
            });
            queryClient.invalidateQueries({
                queryKey: adminQueryKeys.approvedVendors(),
            });
        },
        onError: (error) => {
            const message =
                error instanceof Error ? error.message : "Failed to approve vendor";
            setError(message);
        },
    });
};
