import { ROUTES } from "@/common/constants/routes";
import AppLayout from "@/layouts/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import BookingManager from "@/pages/main/booking-manager";
import AddBookingScreen from "@/pages/main/booking-manager/add";
import BookingDetail from "@/pages/main/booking-manager/detail";
import EditBookingScreen from "@/pages/main/booking-manager/edit";
import CarManager from "@/pages/main/car-trip-manager/car-manager";
import CarPage from "@/pages/main/car-trip-manager/car-manager/car";
import CarEmployeeManager from "@/pages/main/car-trip-manager/car-manager/car-employee";
import CarTypePage from "@/pages/main/car-trip-manager/car-manager/car-type";
import AddCarTypeScreen from "@/pages/main/car-trip-manager/car-manager/car-type/add";
import DetailCarTypeScreen from "@/pages/main/car-trip-manager/car-manager/car-type/detail";
import EditCarTypeScreen from "@/pages/main/car-trip-manager/car-manager/car-type/edit";
import AddCarScreen from "@/pages/main/car-trip-manager/car-manager/car/add";
import DetailCarScreen from "@/pages/main/car-trip-manager/car-manager/car/detail";
import EditCarScreen from "@/pages/main/car-trip-manager/car-manager/car/edit";
import RouteManager from "@/pages/main/car-trip-manager/route-manager";
import AddRouteScreen from "@/pages/main/car-trip-manager/route-manager/add";
import DetailRouteScreen from "@/pages/main/car-trip-manager/route-manager/detail";
import EditRouteScreen from "@/pages/main/car-trip-manager/route-manager/edit";
import TripManager from "@/pages/main/car-trip-manager/trip-manager";
import AddTripScreen from "@/pages/main/car-trip-manager/trip-manager/add";
import DetailTripScreen from "@/pages/main/car-trip-manager/trip-manager/detail";
import EditTripScreen from "@/pages/main/car-trip-manager/trip-manager/edit";
import Dashboard from "@/pages/main/dashboard/Dashboard";
import RoleManager from "@/pages/main/role-manager";
import CustomerManager from "@/pages/main/user-manager/customer-manager";
import CustomerPage from "@/pages/main/user-manager/customer-manager/customer";
import CustomerTypePage from "@/pages/main/user-manager/customer-manager/customer-type";
import AddCustomerTypeScreen from "@/pages/main/user-manager/customer-manager/customer-type/add";
import DetailCustomerTypeScreen from "@/pages/main/user-manager/customer-manager/customer-type/detail";
import EditCustomerTypeScreen from "@/pages/main/user-manager/customer-manager/customer-type/edit";
import AddCustomerScreen from "@/pages/main/user-manager/customer-manager/customer/add";
import DetailCustomerScreen from "@/pages/main/user-manager/customer-manager/customer/detail";
import EditCustomerScreen from "@/pages/main/user-manager/customer-manager/customer/edit";
import EmployeeManager from "@/pages/main/user-manager/employee-manager";
import AddEmployeeScreen from "@/pages/main/user-manager/employee-manager/add";
import DetailEmployeeScreen from "@/pages/main/user-manager/employee-manager/detail";
import EditEmployeeScreen from "@/pages/main/user-manager/employee-manager/edit";
import PaymentMethodPage from "@/pages/main/payment-manager/payment-method-manager";
import AddPaymentMethodScreen from "@/pages/main/payment-manager/payment-method-manager/add";
import EditPaymentMethodScreen from "@/pages/main/payment-manager/payment-method-manager/edit";
import DetailPaymentMethodScreen from "@/pages/main/payment-manager/payment-method-manager/detail";
import NotFound from "@/pages/NotFound";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PaymentManager from "@/pages/main/payment-manager/payment-manager";
import PaymentDetail from "@/pages/main/payment-manager/payment-manager/detail";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import OAuthCallbackPage from "@/pages/auth/OAuthCallbackPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import PermissionManager from "@/pages/main/permission-manager";
import TripsStatusReportPage from "@/pages/main/reports/trips-status";
import BookingsByRouteReportPage from "@/pages/main/reports/bookings-by-route";
import RevenueReportPage from "@/pages/main/reports/revenue";
import DetailRoleScreen from "@/pages/main/role-manager/detail";
import AddRoleScreen from "@/pages/main/role-manager/add";
import EditRoleScreen from "@/pages/main/role-manager/edit";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Route công khai */}
      <Route path={ROUTES.AUTH.LOGIN.path} element={<LoginPage />} />
      <Route
        path={ROUTES.AUTH.CHANGE_PASSWORD.path}
        element={<ChangePasswordPage />}
      />
      <Route
        path={ROUTES.AUTH.FORGOT_PASSWORD.path}
        element={<ForgotPasswordPage />}
      />
      <Route
        path={ROUTES.AUTH.RESET_PASSWORD.path}
        element={<ResetPasswordPage />}
      />
      <Route
        path={ROUTES.AUTH.OAUTH_CALLBACK.path}
        element={<OAuthCallbackPage />}
      />
      {/* Route bảo vệ */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route index path={ROUTES.MAIN.HOME.path} element={<Dashboard />} />
          {/* Quản lý vai trò */}
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.path}
            element={<RoleManager />}
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.Children.ADD_ROLE.path}
            element={<AddRoleScreen />}
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.Children.EDIT_ROLE.path}
            element={<EditRoleScreen />}
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.Children.DETAIL_ROLE.path}
            element={<DetailRoleScreen />}
          />
          {/* Quản lý nhân viên */}
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.path}
            element={<EmployeeManager />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children
                .ADD_EMPLOYEE.path
            }
            element={<AddEmployeeScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children
                .EDIT_EMPLOYEE.path
            }
            element={<EditEmployeeScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.EMPLOYEE_MANAGER.children
                .DETAIL_EMPLOYEE.path
            }
            element={<DetailEmployeeScreen />}
          />
          {/* Quản lý khách hàng */}
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.path}
            element={<CustomerManager />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_LIST.path
            }
            element={<CustomerPage />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_LIST.children.ADD_CUSTOMER.path
            }
            element={<AddCustomerScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_LIST.children.EDIT_CUSTOMER.path
            }
            element={<EditCustomerScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_LIST.children.DETAIL_CUSTOMER.path
            }
            element={<DetailCustomerScreen />}
          />
          {/* Quản lý loại khách hàng */}
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_TYPE.path
            }
            element={<CustomerTypePage />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_TYPE.children.ADD_CUSTOMER_TYPE.path
            }
            element={<AddCustomerTypeScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_TYPE.children.EDIT_CUSTOMER_TYPE.path
            }
            element={<EditCustomerTypeScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.USER_MANAGER.children.CUSTOMER_MANAGER.children
                .CUSTOMER_TYPE.children.DETAIL_CUSTOMER_TYPE.path
            }
            element={<DetailCustomerTypeScreen />}
          />
          {/* Quản lý xe */}
          <Route
            path={ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.path}
            element={<CarManager />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children
                .CAR_LIST.path
            }
            element={<CarPage />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children
                .CAR_LIST.children.ADD_CAR.path
            }
            element={<AddCarScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children
                .CAR_LIST.children.EDIT_CAR.path
            }
            element={<EditCarScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children
                .CAR_LIST.children.DETAIL_CAR.path
            }
            element={<DetailCarScreen />}
          />
          {/* Quản lý loại xe */}
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children
                .CAR_TYPE.path
            }
            element={<CarTypePage />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children
                .CAR_TYPE.children.ADD_CAR_TYPE.path
            }
            element={<AddCarTypeScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children
                .CAR_TYPE.children.EDIT_CAR_TYPE.path
            }
            element={<EditCarTypeScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children
                .CAR_TYPE.children.DETAIL_CAR_TYPE.path
            }
            element={<DetailCarTypeScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.CAR_MANAGER.children
                .CAR_EMPLOYEE_MANAGER.path
            }
            element={<CarEmployeeManager />}
          />
          {/* Quản lý chuyến đi */}
          <Route
            path={ROUTES.MAIN.CAR_TRIP_MANAGER.children.TRIP_MANAGER.path}
            element={<TripManager />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.TRIP_MANAGER.children
                .ADD_TRIP.path
            }
            element={<AddTripScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.TRIP_MANAGER.children
                .EDIT_TRIP.path
            }
            element={<EditTripScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.TRIP_MANAGER.children
                .DETAIL_TRIP.path
            }
            element={<DetailTripScreen />}
          />
          {/* Quản lý tuyến đường */}
          <Route
            path={ROUTES.MAIN.CAR_TRIP_MANAGER.children.ROUTE_MANAGER.path}
            element={<RouteManager />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.ROUTE_MANAGER.children
                .ADD_ROUTE.path
            }
            element={<AddRouteScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.ROUTE_MANAGER.children
                .EDIT_ROUTE.path
            }
            element={<EditRouteScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.CAR_TRIP_MANAGER.children.ROUTE_MANAGER.children
                .DETAIL_ROUTE.path
            }
            element={<DetailRouteScreen />}
          />
          {/* Quản lý đặt xe */}
          <Route
            path={ROUTES.MAIN.BOOKING_MANAGER.path}
            element={<BookingManager />}
          />
          <Route
            path={ROUTES.MAIN.BOOKING_MANAGER.children.ADD_BOOKING.path}
            element={<AddBookingScreen />}
          />
          <Route
            path={ROUTES.MAIN.BOOKING_MANAGER.children.EDIT_BOOKING.path}
            element={<EditBookingScreen />}
          />
          <Route
            path={ROUTES.MAIN.BOOKING_MANAGER.children.DETAIL_BOOKING.path}
            element={<BookingDetail />}
          />

          {/* Quản lý phương thức thanh toán */}
          <Route
            path={
              ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_METHOD_MANAGER.path
            }
            element={<PaymentMethodPage />}
          />
          <Route
            path={
              ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_METHOD_MANAGER
                .children.ADD_PAYMENT_METHOD.path
            }
            element={<AddPaymentMethodScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_METHOD_MANAGER
                .children.EDIT_PAYMENT_METHOD.path
            }
            element={<EditPaymentMethodScreen />}
          />
          <Route
            path={
              ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_METHOD_MANAGER
                .children.DETAIL_PAYMENT_METHOD.path
            }
            element={<DetailPaymentMethodScreen />}
          />

          {/* Quản lý danh sách giao dịch */}
          <Route
            path={ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_LIST.path}
            element={<PaymentManager />}
          />
          <Route
            path={
              ROUTES.MAIN.PAYMENT_MANAGER.children.PAYMENT_LIST.children
                .DETAIL_PAYMENT.path
            }
            element={<PaymentDetail />}
          />
          {/* Quản lý phân quyền */}
          <Route
            path={ROUTES.MAIN.PERMISSION_MANAGER.path}
            element={<PermissionManager />}
          />
          {/* Báo cáo & Thống kê */}
          <Route
            path={ROUTES.MAIN.REPORTS.children.REVENUE_TIME.path}
            element={<RevenueReportPage />}
          />
          <Route
            path={ROUTES.MAIN.REPORTS.children.BOOKINGS_BY_ROUTE.path}
            element={<BookingsByRouteReportPage />}
          />
          <Route
            path={ROUTES.MAIN.REPORTS.children.TRIPS_STATUS.path}
            element={<TripsStatusReportPage />}
          />
        </Route>
      </Route>{" "}
      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
