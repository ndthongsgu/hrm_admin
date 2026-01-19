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
    /* Quản lý người dùng */
    USER_MANAGER: {
      key: "USER_MANAGER",
      label: "Quản lý người dùng",
      path: "/user_manager",
      children: {
        CUSTOMER_MANAGER: {
          key: "CUSTOMER_MANAGER",
          label: "Quản lý khách hàng",
          path: "/user_manager/customer",
          children: {
            CUSTOMER_LIST: {
              key: "CUSTOMER_LIST",
              label: "Danh sách khách hàng",
              path: "/user_manager/customer/list",
              children: {
                ADD_CUSTOMER: {
                  key: "ADD_CUSTOMER",
                  label: "Thêm khách hàng",
                  path: "/user_manager/customer/add",
                },
                EDIT_CUSTOMER: {
                  key: "EDIT_CUSTOMER",
                  label: "Chỉnh sửa khách hàng",
                  path: "/user_manager/customer/edit/:id",
                },
                DETAIL_CUSTOMER: {
                  key: "DETAIL_CUSTOMER",
                  label: "Chi tiết khách hàng",
                  path: "/user_manager/customer/detail/:id",
                },
              },
            },
            CUSTOMER_TYPE: {
              key: "CUSTOMER_TYPE",
              label: "Loại khách hàng",
              path: "/user_manager/customer/type",
              children: {
                ADD_CUSTOMER_TYPE: {
                  key: "ADD_CUSTOMER_TYPE",
                  label: "Thêm loại khách hàng",
                  path: "/user_manager/customer/type/add",
                },
                EDIT_CUSTOMER_TYPE: {
                  key: "EDIT_CUSTOMER_TYPE",
                  label: "Chỉnh sửa loại khách hàng",
                  path: "/user_manager/customer/type/edit/:id",
                },
                DETAIL_CUSTOMER_TYPE: {
                  key: "DETAIL_CUSTOMER_TYPE",
                  label: "Chi tiết loại khách hàng",
                  path: "/user_manager/customer/type/detail/:id",
                },
              },
            },
          },
        },
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
      },
    },

    CAR_TRIP_MANAGER: {
      key: "CAR_TRIP_MANAGER",
      label: "Quản lý chuyến xe",
      path: "/car_trip_manager",
      children: {
        CAR_MANAGER: {
          key: "CAR_MANAGER",
          label: "Quản lý xe",
          path: "/car_trip_manager/car",
          children: {
            CAR_EMPLOYEE_MANAGER: {
              key: "CAR_EMPLOYEE_MANAGER",
              label: "Nhân viên xe",
              path: "/car_trip_manager/car-employee",
            },
            CAR_LIST: {
              key: "CAR_LIST",
              label: "Danh sách xe",
              path: "/car_trip_manager/car/list",
              children: {
                DETAIL_CAR: {
                  key: "DETAIL_CAR",
                  label: "Chi tiết xe",
                  path: "/car_trip_manager/car/:id",
                },
                EDIT_CAR: {
                  key: "EDIT_CAR",
                  label: "Chỉnh sửa xe",
                  path: "/car_trip_manager/car/edit/:id",
                },
                ADD_CAR: {
                  key: "ADD_CAR",
                  label: "Thêm xe",
                  path: "/car_trip_manager/car/add",
                },
              },
            },
            CAR_TYPE: {
              key: "CAR_TYPE",
              label: "Loại xe",
              path: "/car_trip_manager/car/type",
              children: {
                DETAIL_CAR_TYPE: {
                  key: "DETAIL_CAR_TYPE",
                  label: "Chi tiết loại xe",
                  path: "/car_trip_manager/car-type/:id",
                },
                EDIT_CAR_TYPE: {
                  key: "EDIT_CAR_TYPE",
                  label: "Chỉnh sửa loại xe",
                  path: "/car_trip_manager/car-type/edit/:id",
                },
                ADD_CAR_TYPE: {
                  key: "ADD_CAR_TYPE",
                  label: "Thêm loại xe",
                  path: "/car_trip_manager/car-type/add",
                },
              },
            },
          },
        },

        ROUTE_MANAGER: {
          key: "ROUTE_MANAGER",
          label: "Quản lý tuyến",
          path: "/car_trip_manager/route",
          children: {
            DETAIL_ROUTE: {
              key: "DETAIL_ROUTE",
              label: "Chi tiết tuyến",
              path: "/car_trip_manager/route/:id",
            },
            EDIT_ROUTE: {
              key: "EDIT_ROUTE",
              label: "Chỉnh sửa tuyến",
              path: "/car_trip_manager/route/edit/:id",
            },
            ADD_ROUTE: {
              key: "ADD_ROUTE",
              label: "Thêm tuyến",
              path: "/car_trip_manager/route/add",
            },
          },
        },
        TRIP_MANAGER: {
          key: "TRIP_MANAGER",
          label: "Quản lý chuyến đi",
          path: "/car_trip_manager/trip",
          children: {
            DETAIL_TRIP: {
              key: "DETAIL_TRIP",
              label: "Chi tiết chuyến đi",
              path: "/car_trip_manager/trip/detail/:id",
            },
            EDIT_TRIP: {
              key: "EDIT_TRIP",
              label: "Chỉnh sửa chuyến đi",
              path: "/car_trip_manager/trip/edit/:id",
            },
            ADD_TRIP: {
              key: "ADD_TRIP",
              label: "Thêm chuyến đi",
              path: "/car_trip_manager/trip/add",
            },
          },
        },
      },
    },

    BOOKING_MANAGER: {
      key: "BOOKING_MANAGER",
      label: "Quản lý đặt xe",
      path: "/booking_manager",
      children: {
        ADD_BOOKING: {
          key: "ADD_BOOKING",
          label: "Thêm đặt xe",
          path: "/booking_manager/add",
        },
        EDIT_BOOKING: {
          key: "EDIT_BOOKING",
          label: "Chỉnh sửa đặt xe",
          path: "/booking_manager/edit/:id",
        },
        DETAIL_BOOKING: {
          key: "DETAIL_BOOKING",
          label: "Chi tiết đặt xe",
          path: "/booking_manager/detail/:id",
        },
      },
    },

    PAYMENT_MANAGER: {
      key: "PAYMENT_MANAGER",
      label: "Quản lý thanh toán",
      path: "/payment_manager",
      children: {
        PAYMENT_LIST: {
          key: "PAYMENT_LIST",
          label: "Danh sách giao dịch",
          path: "/payment_manager/payment-manager",
          children: {
            DETAIL_PAYMENT: {
              key: "DETAIL_PAYMENT",
              label: "Chi tiết giao dịch",
              path: "/payment_manager/payment-manager/detail/:id",
            },
          },
        },
        PAYMENT_METHOD_MANAGER: {
          key: "PAYMENT_METHOD_MANAGER",
          label: "Quản lý phương thức thanh toán",
          path: "/payment_manager/payment-method",
          children: {
            ADD_PAYMENT_METHOD: {
              key: "ADD_PAYMENT_METHOD",
              label: "Thêm phương thức thanh toán",
              path: "/payment_manager/payment-method/add",
            },
            EDIT_PAYMENT_METHOD: {
              key: "EDIT_PAYMENT_METHOD",
              label: "Chỉnh sửa phương thức thanh toán",
              path: "/payment_manager/payment-method/edit/:id",
            },
            DETAIL_PAYMENT_METHOD: {
              key: "DETAIL_PAYMENT_METHOD",
              label: "Chi tiết phương thức thanh toán",
              path: "/payment_manager/payment-method/detail/:id",
            },
          },
        },
      },
    },
    REPORTS: {
      key: "REPORTS",
      label: "Báo cáo & Thống kê",
      path: "/reports",
      children: {
        REVENUE_TIME: {
          key: "REPORT_REVENUE_TIME",
          label: "Doanh thu theo thời gian",
          path: "/reports/revenue",
        },
        BOOKINGS_BY_ROUTE: {
          key: "REPORT_BOOKINGS_BY_ROUTE",
          label: "Lượt đặt vé theo tuyến",
          path: "/reports/bookings-by-route",
        },
        TRIPS_STATUS: {
          key: "REPORT_TRIPS_STATUS",
          label: "Số chuyến đã chạy / bị hủy",
          path: "/reports/trips-status",
        },
      },
    },
  },
};
