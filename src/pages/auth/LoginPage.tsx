import { useEffect } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Spin } from "antd";
import { useProfile } from "@/hooks/auth/auth";
import { useAuthHydrationStore, useAuthStore } from "@/hooks/auth/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();
  const { _hasHydrated } = useAuthHydrationStore();
  const profileQuery = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    // If we have tokens and profile query is successful, redirect to home
    if (isAuthenticated && profileQuery.isSuccess) {
      navigate("/");
    }
  }, [isAuthenticated, profileQuery.isSuccess, navigate]);

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

  // Show loading while checking authentication
  if (isAuthenticated && profileQuery.isLoading) {
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
        <Spin size="large" tip="Đang kiểm tra phiên đăng nhập..." />
      </div>
    );
  }

  // If authenticated and profile loaded successfully, we'll redirect in useEffect
  // But show loading until redirect happens
  if (isAuthenticated && profileQuery.isSuccess) {
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
        <Spin size="large" tip="Đang chuyển hướng..." />
      </div>
    );
  }

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
