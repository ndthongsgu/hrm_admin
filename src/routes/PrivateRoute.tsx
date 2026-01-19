import { Navigate, Outlet } from "react-router-dom";
import { Spin } from "antd";
import { useProfile } from "@/hooks/auth/auth";
import { useAuthStore, useAuthHydrationStore } from "@/hooks/auth/useAuthStore";

export default function PrivateRoute() {
  const { isAuthenticated } = useAuthStore();
  const { _hasHydrated } = useAuthHydrationStore();
  const profileQuery = useProfile();

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

  // If we think we're authenticated but profile query fails (401), clear tokens
  if (isAuthenticated && profileQuery.isError) {
    useAuthStore.getState().clearTokens();
    return <Navigate to="/login" replace />;
  }

  // If we're authenticated and profile is loading or successful, show content
  if (isAuthenticated) {
    return profileQuery.isLoading ? (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Đang xác thực..." />
      </div>
    ) : (
      <Outlet />
    );
  }

  // Not authenticated
  return <Navigate to="/login" replace />;
}
