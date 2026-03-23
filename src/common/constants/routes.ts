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
      },
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
            ADD_KNOWN_FACE: {
              key: "ADD_KNOWN_FACE",
              label: "Thêm ảnh nhân viên",
              path: "/employee_manager/:id/known-faces",
            },
            DEPENDENT_MANAGER: {
              key: "DEPENDENT_MANAGER",
              label: "Quản lý thân nhân",
              path: "/employee_manager/:id/dependents",
            },
            ADD_DEPENDENT: {
              key: "ADD_DEPENDENT",
              label: "Thêm thân nhân",
              path: "/employee_manager/:id/dependents/add",
            },
            EDIT_DEPENDENT: {
              key: "EDIT_DEPENDENT",
              label: "Chỉnh sửa thân nhân",
              path: "/employee_manager/:id/dependents/edit/:dependentId",
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
    SETTINGS_MANAGER: {
      key: "SETTINGS_MANAGER",
      label: "Cấu hình hệ thống",
      path: "/settings",
      children: {
        SYS_SETTINGS: {
          key: "SYS_SETTINGS",
          label: "Cài đặt chung",
          path: "/settings/sys-settings",
        },
        TAX_BRACKETS: {
          key: "TAX_BRACKETS",
          label: "Bậc thuế TNCN",
          path: "/settings/tax-brackets",
        },
        INSURANCE_CONFIGS: {
          key: "INSURANCE_CONFIGS",
          label: "Cấu hình bảo hiểm",
          path: "/settings/insurance-configs",
        },
      },
    },
    PAYROLL_MANAGER: {
      key: "PAYROLL_MANAGER",
      label: "Quản lý tính lương",
      path: "/payroll",
      children: {
        PAYROLL_PERIODS: {
          key: "PAYROLL_PERIODS",
          label: "Kỳ lương",
          path: "/payroll/periods",
          children: {
            ADD_PAYROLL_PERIOD: {
              key: "ADD_PAYROLL_PERIOD",
              label: "Thêm kỳ lương",
              path: "/payroll/periods/add",
            },
            EDIT_PAYROLL_PERIOD: {
              key: "EDIT_PAYROLL_PERIOD",
              label: "Chỉnh sửa kỳ lương",
              path: "/payroll/periods/edit/:id",
            },
            DETAIL_PAYROLL_PERIOD: {
              key: "DETAIL_PAYROLL_PERIOD",
              label: "Chi tiết kỳ lương",
              path: "/payroll/periods/detail/:id",
            },
          },
        },
        ATTENDANCE_SUMMARY: {
          key: "ATTENDANCE_SUMMARY",
          label: "Tổng hợp công",
          path: "/payroll/attendance-summary",
          children: {
            DETAIL_ATTENDANCE_SUMMARY: {
              key: "DETAIL_ATTENDANCE_SUMMARY",
              label: "Chi tiết tổng hợp công",
              path: "/payroll/attendance-summary/detail/:id",
            },
            EDIT_ATTENDANCE_SUMMARY: {
              key: "EDIT_ATTENDANCE_SUMMARY",
              label: "Chỉnh sửa tổng hợp công",
              path: "/payroll/attendance-summary/edit/:id",
            },
          },
        },
        SALARY_ADJUSTMENTS: {
          key: "SALARY_ADJUSTMENTS",
          label: "Điều chỉnh lương",
          path: "/payroll/salary-adjustments",
          children: {
            ADD_SALARY_ADJUSTMENT: {
              key: "ADD_SALARY_ADJUSTMENT",
              label: "Thêm điều chỉnh lương",
              path: "/payroll/salary-adjustments/add",
            },
            EDIT_SALARY_ADJUSTMENT: {
              key: "EDIT_SALARY_ADJUSTMENT",
              label: "Chỉnh sửa điều chỉnh lương",
              path: "/payroll/salary-adjustments/edit/:id",
            },
            DETAIL_SALARY_ADJUSTMENT: {
              key: "DETAIL_SALARY_ADJUSTMENT",
              label: "Chi tiết điều chỉnh lương",
              path: "/payroll/salary-adjustments/detail/:id",
            },
          },
        },
        OFFICE_LOCATIONS: {
          key: "OFFICE_LOCATIONS",
          label: "Địa điểm văn phòng",
          path: "/payroll/office-locations",
          children: {
            ADD_OFFICE_LOCATION: {
              key: "ADD_OFFICE_LOCATION",
              label: "Thêm địa điểm văn phòng",
              path: "/payroll/office-locations/add",
            },
            EDIT_OFFICE_LOCATION: {
              key: "EDIT_OFFICE_LOCATION",
              label: "Chỉnh sửa địa điểm văn phòng",
              path: "/payroll/office-locations/edit/:id",
            },
            DETAIL_OFFICE_LOCATION: {
              key: "DETAIL_OFFICE_LOCATION",
              label: "Chi tiết địa điểm văn phòng",
              path: "/payroll/office-locations/detail/:id",
            },
          },
        },
        PAYSLIPS: {
          key: "PAYSLIPS",
          label: "Phiếu lương",
          path: "/payroll/payslips",
          children: {
            DETAIL_PAYSLIP: {
              key: "DETAIL_PAYSLIP",
              label: "Chi tiết phiếu lương",
              path: "/payroll/payslips/detail/:id",
            },
          },
        },
        CONTRACTS: {
          key: "CONTRACTS",
          label: "Hợp đồng lao động",
          path: "/payroll/contracts",
        },
      },
    },
  },
};
