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
  useRejectPayrollPeriod,
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
  useRejectSalaryAdjustment,
  useUpdateSalaryAdjustment,
} from "./salaryAdjustment";

// ===== ATTENDANCE SUMMARY HOOKS =====
export {
  useApproveAttendance,
  useDetailAttendanceSummary,
  usePaginationAttendanceSummaries,
  useRejectAttendance,
  useUpdateAttendanceSummary,
} from "./attendanceSummary";

// ===== PAYSLIP HOOKS =====
export {
  useDetailPayslip,
  usePaginationPayslips,
  useApprovePayslip,
  useRejectPayslip,
  useDeactivatePayslip,
  useActivatePayslip,
  useGeneratePayslip,
} from "./payslip";

// ===== SELECT OPTIONS HOOKS =====
export {
  useEmployeeSelectOptions,
  usePayrollPeriodSelectOptions,
} from "./selectOptions";
