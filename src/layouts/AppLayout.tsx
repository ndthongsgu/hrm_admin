import { Layout } from "antd";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import AppSidebar from "./AppSidebar";
import { useLogout } from "@/hooks/auth/auth";
import { ROUTES } from "@/common/constants/routes";
// import PermissionDebug from "@/components/auth/PermissionDebug"; // Unused

const { Content } = Layout;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  const handleChangePassword = () => {
    navigate(ROUTES.AUTH.CHANGE_PASSWORD.path);
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppSidebar collapsed={collapsed} />
      <Layout>
        <AppNavbar
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
          onChangePassword={handleChangePassword}
          onLogout={handleLogout}
        />
        <Content
          style={{ borderRadius: 8, minHeight: "calc(100vh - 64px - 32px)" }}
        >
          
          
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
