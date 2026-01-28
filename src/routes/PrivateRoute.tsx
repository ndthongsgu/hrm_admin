import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
// import { useProfile } from "@/hooks/auth/auth"; // Disabled because backend doesn't have /me endpoint
import { useAuthStore, useAuthHydrationStore } from "@/hooks/auth/useAuthStore";

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthStore();
  const { _hasHydrated } = useAuthHydrationStore();
  // const profileQuery = useProfile(); // Disabled because backend doesn't have /me endpoint

  // Wait for hydration
  if (!_hasHydrated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // Simplified: only check isAuthenticated from token, no need to call /me API
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Not authenticated
  return <Navigate to="/login" replace />;
}
