import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../api/store/auth/types";

interface AuthState {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    error: string | null;
    setToken: (token: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isLoading: false,
            error: null,
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: "auth-storage",
        },
    ),
);
