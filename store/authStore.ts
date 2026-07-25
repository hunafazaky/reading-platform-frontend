import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isRefreshing: boolean;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
  setRefreshing: (status: boolean) => void;
  updateUser: (newData: Partial<Omit<User, "id">>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isRefreshing: false,
      setAuth: (accessToken, user) => set({ accessToken, user }),
      clearAuth: () => set({ user: null, accessToken: null }),
      setRefreshing: (status) => set({ isRefreshing: status }),
      updateUser: (newData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...newData } : null,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);