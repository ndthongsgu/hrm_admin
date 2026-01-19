import {
  KeyOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, Row } from "antd";
import type { FC } from "react";
import Breadcrumbs from "./breadcrumb";

const { Header } = Layout;

type AppNavbarProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
};

const AppNavbar: FC<AppNavbarProps> = ({
  collapsed,
  onToggleSidebar,
  onChangePassword,
  onLogout,
}) => {
  const menu = (
    <Menu>
      <Menu.Item
        key="change-password"
        icon={<KeyOutlined />}
        onClick={onChangePassword}
      >
        Đổi mật khẩu
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        padding: "0 16px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <Row align="middle" justify="space-between" style={{ width: "100%" }}>
        <Row align="middle" gutter={16}>
          <span
            style={{ cursor: "pointer", fontSize: 18 }}
            onClick={onToggleSidebar}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
          <Breadcrumbs />
        </Row>

        {/* Right side: avatar dropdown */}
        <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
          <Avatar
            src="https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
            style={{ cursor: "pointer" }}
          />
        </Dropdown>
      </Row>
    </Header>
  );
};

export default AppNavbar;
