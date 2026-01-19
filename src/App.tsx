import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastProvider } from "./components/toast";
import { LoadingProvider } from "./context/LoadingContext";
import AppRoutes from "./routes";
import AuthInitializer from "./components/auth/AuthInitializer";

export default function App() {
  const queryClient = new QueryClient();
  if (import.meta.env.VITE_BYPASS_AUTH === "true") {
    if (!localStorage.getItem("token")) {
      localStorage.setItem("token", "dev-token");
    }
  }
  return (
    <>
      <AuthInitializer />
      <Router>
        <ConfigProvider locale={viVN} theme={{ token: { borderRadius: 8 } }}>
          <QueryClientProvider client={queryClient}>
            <LoadingProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </LoadingProvider>
          </QueryClientProvider>
        </ConfigProvider>
      </Router>
    </>
  );
}
