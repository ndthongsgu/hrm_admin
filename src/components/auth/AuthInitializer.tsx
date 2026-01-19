import { useAuthHydrationStore } from "@/hooks/auth/useAuthStore";
import { useLoadUserInfo } from "@/hooks/auth/useUserInfo";
import { useEffect } from "react";

export default function AuthInitializer() {
  const setHasHydrated = useAuthHydrationStore((state) => state.setHasHydrated);
  
  // Load user info when authenticated
  useLoadUserInfo();

  useEffect(() => {
    setHasHydrated(true);
  }, [setHasHydrated]);

  return null;
}
