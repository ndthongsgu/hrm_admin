import { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Spin } from "antd";
// import { useProfile } from "@/hooks/auth/auth"; // Disabled because backend doesn't have /me endpoint
import { useAuthHydrationStore, useAuthStore } from "@/hooks/auth/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const { _hasHydrated } = useAuthHydrationStore();
  // const profileQuery = useProfile(); // Disabled because backend doesn't have /me endpoint
  const navigate = useNavigate();

  useEffect(() => {
    // Simplified: only check isAuthenticated from token, no need to call /me API
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Show loading while checking hydration
  if (!_hasHydrated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  // Simplified: nếu đã authenticated thì redirect (trong useEffect)
  // Không cần check profile query nữa

  // Show login form if not authenticated or token is invalid
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "top",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingRight: "300px",
        }}
      >
        <LoginForm adminMode={true} />
      </div>
    </div>
  );
}
