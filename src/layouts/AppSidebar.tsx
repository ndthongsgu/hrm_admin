import {
  DashboardOutlined,
  LockOutlined,
  SafetyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../assets/icons";
import { ROUTES } from "../common/constants/routes";
import { useUserInfo } from "@/hooks/auth/useUserInfo";
import { canAccessModule, isAdmin } from "@/common/helpers/permissions";
import { ModuleCode, type ModuleCodeType } from "@/dto/auth.dto";
import { useEffect, useMemo, useState } from "react";
import "./AppSidebar.less";

type AppSidebarProps = {
  collapsed: boolean;
};

type MenuItem = {
  key: string;
  path: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItem[];
  moduleCode?: ModuleCodeType; // Add module code for permission checking
};

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useUserInfo();

  const allMenuItems: MenuItem[] = [
    // Home (always visible)
    {
      key: ROUTES.MAIN.HOME.key,
      path: ROUTES.MAIN.HOME.path,
      icon: <DashboardOutlined />,
      label: ROUTES.MAIN.HOME.label,
    },

    // HRM: User Manager (Employee / Customer)
    {
      key: ROUTES.MAIN.USER_MANAGER.key,
      path: ROUTES.MAIN.USER_MANAGER.path,
      icon: <UserOutlined />,
      label: ROUTES.MAIN.USER_MANAGER.label,
      children: [
        {
          key: ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.key,
          path: ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.path,
          label: ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.label,
          moduleCode: ModuleCode.EMPLOYEE,
        },
        {
          key: ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.key,
          path: ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.path,
          label: ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.label,
          moduleCode: ModuleCode.CUSTOMER,
        },
      ],
    },

    // HRM: Role / Permission
    {
      key: ROUTES.MAIN.ROLE_MANAGER.key,
      path: ROUTES.MAIN.ROLE_MANAGER.path,
      icon: <SafetyOutlined />,
      label: ROUTES.MAIN.ROLE_MANAGER.label,
      moduleCode: ModuleCode.ROLE,
    },
    {
      key: ROUTES.MAIN.PERMISSION_MANAGER.key,
      path: ROUTES.MAIN.PERMISSION_MANAGER.path,
      icon: <LockOutlined />,
      label: ROUTES.MAIN.PERMISSION_MANAGER.label,
      moduleCode: ModuleCode.PERMISSION,
    },
  ];

  // Filter menu items based on user permissions
  const menuItems = useMemo(() => {
    if (!userInfo) return [];

    // ⚠️ ADMIN BYPASS: Admin sees ALL menu items
    if (isAdmin(userInfo)) {
      return allMenuItems;
    }

    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .map((item) => {
          // If item has moduleCode, check permission
          if (item.moduleCode) {
            const hasAccess = canAccessModule(item.moduleCode, userInfo);
            if (!hasAccess) return null;
          }

          // Filter children recursively
          if (item.children) {
            const filteredChildren = filterItems(item.children);
            // If no children have access, hide parent
            if (filteredChildren.length === 0) return null;
            return { ...item, children: filteredChildren };
          }

          return item;
        })
        .filter((item): item is MenuItem => item !== null);
    };

    return filterItems(allMenuItems);
  }, [userInfo]);

  const { selectedKeys, routeOpenKeys } = useMemo(() => {
    const currentPath = location.pathname;

    let bestMatch:
      | { key: string; parents: string[]; pathLen: number }
      | undefined;

    const walk = (items: MenuItem[], parents: string[] = []) => {
      for (const item of items) {
        const isMatch =
          currentPath === item.path || currentPath.startsWith(item.path + "/");
        if (isMatch) {
          const candidate = {
            key: item.key,
            parents,
            pathLen: item.path.length,
          };
          if (!bestMatch || candidate.pathLen > bestMatch.pathLen) {
            bestMatch = candidate;
          }
        }
        if (item.children) {
          walk(item.children, [...parents, item.key]);
        }
      }
    };

    walk(menuItems);

    if (!bestMatch) {
      return { selectedKeys: [], routeOpenKeys: [] };
    }

    const open = [...bestMatch.parents];
    const selected = [bestMatch.key, ...bestMatch.parents];
    return { selectedKeys: selected, routeOpenKeys: open };
  }, [location.pathname, menuItems]);

  // Keep submenu open state controllable by user interaction,
  // but also auto-open the branch matching current route.
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
      return;
    }
    setOpenKeys(routeOpenKeys);
  }, [collapsed, routeOpenKeys]);

  const renderMenuItems = (items: MenuItem[]) =>
    items.map((item) =>
      item.children ? (
        <Menu.SubMenu
          key={item.key}
          icon={item.icon}
          title={item.label}
          onTitleClick={() => navigate(item.path)}
        >
          {item.children.map((child) => (
            <Menu.Item key={child.key} onClick={() => navigate(child.path)}>
              {child.label}
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      ) : (
        <Menu.Item
          key={item.key}
          icon={item.icon}
          onClick={() => navigate(item.path)}
        >
          {item.label}
        </Menu.Item>
      )
    );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      width={300}
      trigger={null}
      style={{
        background: `url('/background.png') top/cover no-repeat`,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 0,
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: 16,
          height: 100,
        }}
      >
        <img src={Logo} alt="Logo" style={{ width: "100%", height: "100%" }} />
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys as string[])}
        className="app-sidebar-menu"
        style={{
          position: "relative",
          zIndex: 1,
          background: "transparent",
        }}
      >
        {renderMenuItems(menuItems)}
      </Menu>
    </Sider>
  );
}
