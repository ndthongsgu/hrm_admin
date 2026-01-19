import {
  BarChartOutlined,
  CarOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  LockOutlined,
  SafetyOutlined,
  ScheduleOutlined,
  SettingOutlined,
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
import { useMemo } from "react";

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
    {
      key: ROUTES.MAIN.HOME.key,
      path: ROUTES.MAIN.HOME.path,
      icon: <DashboardOutlined />,
      label: ROUTES.MAIN.HOME.label,
    },
    {
      key: ROUTES.MAIN.REPORTS.key,
      path: ROUTES.MAIN.REPORTS.path,
      icon: <BarChartOutlined />,
      label: ROUTES.MAIN.REPORTS.label,
      children: [
        {
          key: ROUTES.MAIN.REPORTS.children.REVENUE_TIME.key,
          path: ROUTES.MAIN.REPORTS.children.REVENUE_TIME.path,
          label: ROUTES.MAIN.REPORTS.children.REVENUE_TIME.label,
        },
        {
          key: ROUTES.MAIN.REPORTS.children.BOOKINGS_BY_ROUTE.key,
          path: ROUTES.MAIN.REPORTS.children.BOOKINGS_BY_ROUTE.path,
          label: ROUTES.MAIN.REPORTS.children.BOOKINGS_BY_ROUTE.label,
        },
        {
          key: ROUTES.MAIN.REPORTS.children.TRIPS_STATUS.key,
          path: ROUTES.MAIN.REPORTS.children.TRIPS_STATUS.path,
          label: ROUTES.MAIN.REPORTS.children.TRIPS_STATUS.label,
        },
      ],
    },
    {
      key: ROUTES.MAIN.CAR_TRIP_MANAGER.key,
      path: ROUTES.MAIN.CAR_TRIP_MANAGER.path,
      icon: <CarOutlined />,
      label: ROUTES.MAIN.CAR_TRIP_MANAGER.label,
      children: [
        {
          key: ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.key,
          path: ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.path,
          label: ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.label,
          moduleCode: ModuleCode.CAR,
        },
        {
          key: ROUTES.MAIN.CAR_TRIP_MANAGER.children.TRIP_MANAGER.key,
          path: ROUTES.MAIN.CAR_TRIP_MANAGER.children.TRIP_MANAGER.path,
          label: ROUTES.MAIN.CAR_TRIP_MANAGER.children.TRIP_MANAGER.label,
          moduleCode: ModuleCode.TRIP,
        },
        {
          key: ROUTES.MAIN.CAR_TRIP_MANAGER.children.ROUTE_MANAGER.key,
          path: ROUTES.MAIN.CAR_TRIP_MANAGER.children.ROUTE_MANAGER.path,
          label: ROUTES.MAIN.CAR_TRIP_MANAGER.children.ROUTE_MANAGER.label,
          moduleCode: ModuleCode.ROUTE,
        },
      ],
    },
    {
      key: ROUTES.MAIN.BOOKING_MANAGER.key,
      path: ROUTES.MAIN.BOOKING_MANAGER.path,
      icon: <ScheduleOutlined />,
      label: ROUTES.MAIN.BOOKING_MANAGER.label,
      moduleCode: ModuleCode.BOOKING,
    },
    {
      key: ROUTES.MAIN.PAYMENT_MANAGER.key,
      path: ROUTES.MAIN.PAYMENT_MANAGER.path,
      icon: <CreditCardOutlined />,
      label: ROUTES.MAIN.PAYMENT_MANAGER.label,
      children: [
        {
          key: ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_LIST.key,
          path: ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_LIST.path,
          label: ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_LIST.label,
          moduleCode: ModuleCode.PAYMENT,
        },
        {
          key: ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_METHOD_MANAGER.key,
          path: ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_METHOD_MANAGER.path,
          label: ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_METHOD_MANAGER.label,
          moduleCode: ModuleCode.PAYMENT_METHOD,
        }
      ]
    },
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
    {
      key: "settings",
      path: "/settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
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

  const renderMenuItems = (items: MenuItem[]) =>
    items.map((item) =>
      item.children ? (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
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
        selectedKeys={[location.pathname]}
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
