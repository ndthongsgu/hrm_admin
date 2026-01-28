// import { Children } from "react"; // Unused

export const ROUTES = {
  AUTH: {
    LOGIN: {
      key: "LOGIN",
      label: "Đăng nhập",
      path: "/login",
    },
    CHANGE_PASSWORD: {
      key: "CHANGE_PASSWORD",
      label: "Đổi mật khẩu",
      path: "/change-password",
    },
    FORGOT_PASSWORD: {
      key: "FORGOT_PASSWORD",
      label: "Quên mật khẩu",
      path: "/forgot-password",
    },
    RESET_PASSWORD: {
      key: "RESET_PASSWORD",
      label: "Đặt lại mật khẩu",
      path: "/reset-password",
    },
    OAUTH_CALLBACK: {
      key: "OAUTH_CALLBACK",
      label: "OAuth Callback",
      path: "/oauth/callback",
    },
  },
  MAIN: {
    HOME: {
      key: "HOME",
      label: "Trang chủ",
      path: "/",
    },
    ROLE_MANAGER: {
      key: "ROLE_MANAGER",
      label: "Quản lý vai trò",
      path: "/role_manager",
      Children: {
        ADD_ROLE: {
          key: "ADD_ROLE",
          label: "Thêm vai trò",
          path: "/role_manager/add",
        },
        EDIT_ROLE: {
          key: "EDIT_ROLE",
          label: "Chỉnh sửa vai trò",
          path: "/role_manager/edit/:id",
        },
        DETAIL_ROLE: {
          key: "DETAIL_ROLE",
          label: "Chi tiết vai trò",
          path: "/role_manager/detail/:id",
        },
      }
    },
    PERMISSION_MANAGER: {
      key: "PERMISSION_MANAGER",
      label: "Quản lý phân quyền",
      path: "/user_manager/permission",
    },
    DEPARTMENT_MANAGER: {
      key: "DEPARTMENT_MANAGER",
      label: "Quản lý phòng ban",
      path: "/department_manager",
      children: {
        ADD_DEPARTMENT: {
          key: "ADD_DEPARTMENT",
          label: "Thêm phòng ban",
          path: "/department_manager/add",
        },
        EDIT_DEPARTMENT: {
          key: "EDIT_DEPARTMENT",
          label: "Chỉnh sửa phòng ban",
          path: "/department_manager/edit/:id",
        },
        DETAIL_DEPARTMENT: {
          key: "DETAIL_DEPARTMENT",
          label: "Chi tiết phòng ban",
          path: "/department_manager/detail/:id",
        },
      },
    },
    POSITION_MANAGER: {
      key: "POSITION_MANAGER",
      label: "Quản lý chức vụ",
      path: "/position_manager",
      children: {
        ADD_POSITION: {
          key: "ADD_POSITION",
          label: "Thêm chức vụ",
          path: "/position_manager/add",
        },
        EDIT_POSITION: {
          key: "EDIT_POSITION",
          label: "Chỉnh sửa chức vụ",
          path: "/position_manager/edit/:id",
        },
        DETAIL_POSITION: {
          key: "DETAIL_POSITION",
          label: "Chi tiết chức vụ",
          path: "/position_manager/detail/:id",
        },
      },
    },
    USER_MANAGER: {
      key: "USER_MANAGER",
      label: "Quản lý người dùng",
      path: "/user_manager",
      children: {
        EMPLOYEE_MANAGER: {
          key: "EMPLOYEE_MANAGER",
          label: "Quản lý nhân viên",
          path: "/employee_manager",
          children: {
            ADD_EMPLOYEE: {
              key: "ADD_EMPLOYEE",
              label: "Thêm nhân viên",
              path: "/employee_manager/add",
            },
            DETAIL_EMPLOYEE: {
              key: "DETAIL_EMPLOYEE",
              label: "Chi tiết nhân viên",
              path: "/employee_manager/detail/:id",
            },
            EDIT_EMPLOYEE: {
              key: "EDIT_EMPLOYEE",
              label: "Chỉnh sửa nhân viên",
              path: "/employee_manager/edit/:id",
            },
          },
        },
        ADD_USER: {
          key: "ADD_USER",
          label: "Thêm người dùng",
          path: "/user_manager/add",
        },
        EDIT_USER: {
          key: "EDIT_USER",
          label: "Chỉnh sửa người dùng",
          path: "/user_manager/edit/:id",
        },
        DETAIL_USER: {
          key: "DETAIL_USER",
          label: "Chi tiết người dùng",
          path: "/user_manager/detail/:id",
        },
      },
    },
  },
};
