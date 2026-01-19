import { useAuthStore } from "./useAuthStore";
import { authService } from "@/services/auth.service";
import { useEffect } from "react";

/**
 * Hook to get current user info from store
 */
export function useUserInfo() {
  const userInfo = useAuthStore((state) => state.userInfo);
  return userInfo;
}

/**
 * Hook to load user info from API
 * Automatically loads when authenticated but userInfo is missing
 */
export function useLoadUserInfo() {
  const { isAuthenticated, userInfo, setUserInfo } = useAuthStore();

  useEffect(() => {
    const loadUserInfo = async () => {
      // Only load if authenticated AND userInfo is not loaded yet
      if (isAuthenticated && !userInfo) {
        try {
          const fetchedUserInfo = await authService.getUserInfo();
          setUserInfo(fetchedUserInfo);
        } catch (error) {
          console.error("[useLoadUserInfo] Failed to load user info:", error);
        }
      }
    };

    loadUserInfo();
  }, [isAuthenticated, userInfo, setUserInfo]);
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
  const userInfo = useUserInfo();
  return userInfo?.isAdmin ?? false;
}
