// Re-export all payroll hooks from their organized subfolders
// ===== PAYROLL PERIOD HOOKS =====
export {
  useActivatePayrollPeriod,
  useApprovePayrollPeriod,
  useCalculatePayslips,
  useCreatePayrollPeriod,
  useDeactivatePayrollPeriod,
  useDetailPayrollPeriod,
  useLockPayrollPeriod,
  usePaginationPayrollPeriods,
  useSummarizeAttendance,
  useUpdatePayrollPeriod,
} from "./payrollPeriod";

// ===== SALARY ADJUSTMENT HOOKS =====
export {
  useActivateSalaryAdjustment,
  useApproveSalaryAdjustment,
  useCreateSalaryAdjustment,
  useDeactivateSalaryAdjustment,
  useDetailSalaryAdjustment,
  usePaginationSalaryAdjustments,
  useUpdateSalaryAdjustment,
} from "./salaryAdjustment";

// ===== ATTENDANCE SUMMARY HOOKS =====
export {
  useApproveAttendance,
  useDetailAttendanceSummary,
  usePaginationAttendanceSummaries,
  useUpdateAttendanceSummary,
} from "./attendanceSummary";

// ===== PAYSLIP HOOKS =====
export {
  useDetailPayslip,
  usePaginationPayslips,
  useApprovePayslip,
  useDeactivatePayslip,
  useActivatePayslip,
  useGeneratePayslip,
} from "./payslip";

// ===== SELECT OPTIONS HOOKS =====
export {
  useEmployeeSelectOptions,
  usePayrollPeriodSelectOptions,
} from "./selectOptions";
