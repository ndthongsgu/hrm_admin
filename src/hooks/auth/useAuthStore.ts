import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserInfo } from "@/dto/auth.dto";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  clearTokens: () => void;
  getAccessToken: () => string | null;
  getUserInfo: () => UserInfo | null;
}

// Create separate store for hydration state that doesn't persist
interface AuthHydrationState {
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      userInfo: null,

      setTokens: (accessToken: string, refreshToken: string) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),

      setUserInfo: (userInfo: UserInfo) =>
        set({ userInfo }),

      clearTokens: () =>
        set({ 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false,
          userInfo: null 
        }),

      getAccessToken: () => get().accessToken,

      getUserInfo: () => get().userInfo,
    }),
    {
      name: "auth-storage",
    }
  )
);

export const useAuthHydrationStore = create<AuthHydrationState>((set) => ({
  _hasHydrated: false,
  setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
}));
