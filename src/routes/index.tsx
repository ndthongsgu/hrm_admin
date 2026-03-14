import { ROUTES } from "@/common/constants/routes";
import AppLayout from "@/layouts/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import Dashboard from "@/pages/main/dashboard/Dashboard";
import RoleManager from "@/pages/main/role-manager";
import EmployeeManager from "@/pages/main/user-manager/employee-manager";
import AddEmployeeScreen from "@/pages/main/user-manager/employee-manager/add";
import DetailEmployeeScreen from "@/pages/main/user-manager/employee-manager/detail";
import EditEmployeeScreen from "@/pages/main/user-manager/employee-manager/edit";
import NotFound from "@/pages/NotFound";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import OAuthCallbackPage from "@/pages/auth/OAuthCallbackPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import ChangePasswordPage from "@/pages/auth/ChangePasswordPage";
import DetailRoleScreen from "@/pages/main/role-manager/detail";
import AddRoleScreen from "@/pages/main/role-manager/add";
import EditRoleScreen from "@/pages/main/role-manager/edit";
import DepartmentManager from "@/pages/main/department-manager";
import AddDepartmentScreen from "@/pages/main/department-manager/add";
import EditDepartmentScreen from "@/pages/main/department-manager/edit";
import DetailDepartmentScreen from "@/pages/main/department-manager/detail";
import PositionManager from "@/pages/main/position-manager";
import AddPositionScreen from "@/pages/main/position-manager/add";
import EditPositionScreen from "@/pages/main/position-manager/edit";
import DetailPositionScreen from "@/pages/main/position-manager/detail";
import PayrollPeriodScreen from "@/pages/main/payroll-manager/payrollPeriod-manager";
import AddPayrollPeriodScreen from "@/pages/main/payroll-manager/payrollPeriod-manager/add";
import EditPayrollPeriodScreen from "@/pages/main/payroll-manager/payrollPeriod-manager/edit";
import DetailPayrollPeriodScreen from "@/pages/main/payroll-manager/payrollPeriod-manager/detail";
import SalaryAdjustmentManager from "@/pages/main/payroll-manager/salaryAdjustment-manager";
import AddSalaryAdjustmentScreen from "@/pages/main/payroll-manager/salaryAdjustment-manager/add";
import EditSalaryAdjustmentScreen from "@/pages/main/payroll-manager/salaryAdjustment-manager/edit";
import DetailSalaryAdjustmentScreen from "@/pages/main/payroll-manager/salaryAdjustment-manager/detail";
import AttendanceSummaryManager from "@/pages/main/payroll-manager/attendanceSummary-manager";
import DetailAttendanceSummaryScreen from "@/pages/main/payroll-manager/attendanceSummary-manager/detail";
import EditAttendanceSummaryScreen from "@/pages/main/payroll-manager/attendanceSummary-manager/edit";
import PayslipManager from "@/pages/main/payroll-manager/payslip";
import PayslipDetailScreen from "@/pages/main/payroll-manager/payslip/detail";


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
          {/* Quản lý người dùng */}
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
          {/* Quản lý phòng ban */}
          <Route
            path={ROUTES.MAIN.DEPARTMENT_MANAGER.path}
            element={<DepartmentManager />}
          />
          <Route
            path={ROUTES.MAIN.DEPARTMENT_MANAGER.children.ADD_DEPARTMENT.path}
            element={<AddDepartmentScreen />}
          />
          <Route
            path={ROUTES.MAIN.DEPARTMENT_MANAGER.children.EDIT_DEPARTMENT.path}
            element={<EditDepartmentScreen />}
          />
          <Route
            path={ROUTES.MAIN.DEPARTMENT_MANAGER.children.DETAIL_DEPARTMENT.path}
            element={<DetailDepartmentScreen />}
          />
          {/* Quản lý chức vụ */}
          <Route
            path={ROUTES.MAIN.POSITION_MANAGER.path}
            element={<PositionManager />}
          />
          <Route
            path={ROUTES.MAIN.POSITION_MANAGER.children.ADD_POSITION.path}
            element={<AddPositionScreen />}
          />
          <Route
            path={ROUTES.MAIN.POSITION_MANAGER.children.EDIT_POSITION.path}
            element={<EditPositionScreen />}
          />
          <Route
            path={ROUTES.MAIN.POSITION_MANAGER.children.DETAIL_POSITION.path}
            element={<DetailPositionScreen />}
          />

          {/* Quản lý tính lương */}
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.PAYROLL_PERIODS.path}
            element={<PayrollPeriodScreen />}
          />
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.PAYROLL_PERIODS.children.ADD_PAYROLL_PERIOD.path}
            element={<AddPayrollPeriodScreen />}
          />
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.PAYROLL_PERIODS.children.EDIT_PAYROLL_PERIOD.path}
            element={<EditPayrollPeriodScreen />}
          />
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.PAYROLL_PERIODS.children.DETAIL_PAYROLL_PERIOD.path}
            element={<DetailPayrollPeriodScreen />}
          />

          {/* Quản lý tổng hợp công */}
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.ATTENDANCE_SUMMARY.path}
            element={<AttendanceSummaryManager />}
          />
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.ATTENDANCE_SUMMARY.children.DETAIL_ATTENDANCE_SUMMARY.path}
            element={<DetailAttendanceSummaryScreen />}
          />
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.ATTENDANCE_SUMMARY.children.EDIT_ATTENDANCE_SUMMARY.path}
            element={<EditAttendanceSummaryScreen />}
          />

          {/* Quản lý phiếu lương */}
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.PAYSLIPS.path}
            element={<PayslipManager />}
          />
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.PAYSLIPS.children.DETAIL_PAYSLIP.path}
            element={<PayslipDetailScreen />}
          />

          {/* Quản lý điều chỉnh lương */}
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.SALARY_ADJUSTMENTS.path}
            element={<SalaryAdjustmentManager />}
          />
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.SALARY_ADJUSTMENTS.children.ADD_SALARY_ADJUSTMENT.path}
            element={<AddSalaryAdjustmentScreen />}
          />
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.SALARY_ADJUSTMENTS.children.EDIT_SALARY_ADJUSTMENT.path}
            element={<EditSalaryAdjustmentScreen />}
          />
          <Route
            path={ROUTES.MAIN.PAYROLL_MANAGER.children.SALARY_ADJUSTMENTS.children.DETAIL_SALARY_ADJUSTMENT.path}
            element={<DetailSalaryAdjustmentScreen />}
          />
        </Route>
      </Route>{" "}
      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
