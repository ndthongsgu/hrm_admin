// Re-export all payroll hooks from their organized subfolders
// ===== PAYROLL PERIOD HOOKS =====
export {
  useActivatePayrollPeriod,
  useApprovePayrollPeriod,
  useCreatePayrollPeriod,
  useDeactivatePayrollPeriod,
  useDetailPayrollPeriod,
  usePaginationPayrollPeriods,
  useUpdatePayrollPeriod,
} from "./payrollPeriod";

// ===== SALARY ADJUSTMENT HOOKS =====
export {
  useActivateSalaryAdjustment,
  useApproveSalaryAdjustment,
  useUnApproveSalaryAdjustment,
  useCreateSalaryAdjustment,
  useDeactivateSalaryAdjustment,
  useDetailSalaryAdjustment,
  usePaginationSalaryAdjustments,
  useUpdateSalaryAdjustment,
} from "./salaryAdjustment";

// ===== ATTENDANCE SUMMARY HOOKS =====
export {
  useApproveAttendance,
  useUnApproveAttendance,
  useDetailAttendanceSummary,
  usePaginationAttendanceSummaries,
  useUpdateAttendanceSummary,
} from "./attendanceSummary";

// ===== PAYSLIP HOOKS =====
export {
  useDetailPayslip,
  usePaginationPayslips,
  useApprovePayslip,
  useUnApprovePayslip,
  useDeactivatePayslip,
  useActivatePayslip,
  useGeneratePayslip,
} from "./payslip";

// ===== SELECT OPTIONS HOOKS =====
export {
  useEmployeeSelectOptions,
  usePayrollPeriodSelectOptions,
} from "./selectOptions";
