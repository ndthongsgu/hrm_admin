import type { EmployeeDto } from "./employee.dto";

export interface SelectOptionDto {
  id: string;
  name: string;
}

export interface PayrollPeriodDto {
  id?: string;
  name: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  standardWorkingDays: number;
  status: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  dateRange?: [Date, Date] | undefined; // For form initialization only, not part of API contract
}

export interface PayrollPeriodFilter {
  name?: string;
  isDeleted?: boolean;
  startDate?: Date;
  endDate?: Date;
  dateRange?: [Date, Date];
  status?: string;
}

export interface AttendanceSummaryDto {
  id?: string;
  payrollPeriodId: string;
  payrollPeriod: PayrollPeriodDto;
  payrollPeriodName?: string;
  employeeId: string;
  employee: EmployeeDto;
  employeeName?: string;
  employeeCode?: string;
  actualWorkingDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  overtimeHours: number;
  status: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AttendanceSummaryFilter {
  payrollPeriodId: string;
  isApproved?: string;
}

export interface DailyAttendanceDto {
  id?: string;
  employeeId: string;
  employee?: EmployeeDto;
  employeeName?: string;
  employeeCode?: string;
  date: string; // YYYY-MM-DD format
  checkInTime?: string; // HH:mm:ss format
  checkOutTime?: string; // HH:mm:ss format
  status: string; // PRESENT, ABSENT, LATE, etc.
  version?: number;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DailyAttendanceFilter {
  employeeId?: string;
  employeeName?: string;
  date?: Date;
  dateRange?: [Date, Date];
  status?: string;
  isDeleted?: boolean;
}

export interface SalaryAdjustmentDto {
  id?: string;
  payrollPeriodId: string;
  payrollPeriod: PayrollPeriodDto;
  payrollPeriodName?: string;
  employeeId: string;
  employee: EmployeeDto;
  employeeName?: string;
  employeeCode?: string;
  amount: number;
  type: 'BONUS' | 'FINE' | 'ADVANCE' | 'BHXH_BENEFIT';
  reason?: string;
  isTaxable?: boolean;
  isNetOnly?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
}

export interface SalaryAdjustmentFilter {
  payrollPeriodId?: string;
  employeeId?: string;
  amount?: number;
  type?: string;
  reason?: string;
  isTaxable?: boolean;
  isNetOnly?: boolean;
  isDeleted?: boolean;
}

export interface PayslipDto {
  id?: string;
  payrollPeriodId: string;
  payrollPeriodName?: string;
  payrollPeriod?: PayrollPeriodDto;
  employee: EmployeeDto;
  employeeId: string;
  employeeName?: string;
  employeeCode?: string;
  contractId: string;
  
  // Income
  grossSalary: number;
  salaryByWorkdays: number;
  workdays: number; // Công thực tế
  totalWorkdays: number; // Tổng số ngày công trong kỳ
  
  // Allowances (theo 2 tiêu chí: chịu thuế × tính bảo hiểm)
  taxableAndInsurableAllowance: number;
  taxableAndNonInsurableAllowance: number;
  nonTaxableAndInsurableAllowance: number;
  nonTaxableAndNonInsurableAllowance: number;
  
  // Salary Adjustments
  totalBonus: number; // Thưởng/Phạt chịu thuế
  totalBonusNonTax: number; // Thưởng/Phạt không chịu thuế
  
  // Insurance
  bhxhSalaryBase: number;
  bhxhAmount: number;
  bhytAmount: number;
  bhtnAmount: number;
  totalInsurance: number;
  
  // Tax
  taxableIncome: number;
  deductionPersonal: number;
  deductionDependents: number;
  taxFixedDeduction: number;
  totalDeductions: number;
  assessableIncome: number;
  taxAmount: number;
  taxRate?: number; // Thuế suất áp dụng, có thể lấy từ PayrollPeriod hoặc tính dựa trên assessableIncome
  
  // Net
  netSalary: number;
  
  // Approval
  status?: string;
  reason?: string;
  createBy?: string;
  updateBy?: string;
  isDeleted?: boolean;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PayslipFilter {
  payrollPeriodId?: string;
}

export interface AttendanceSummarySearchRequest {
  where?: any;
}

export interface SalaryAdjustmentSearchRequest {
  where?: any;
}

export interface PayslipSearchRequest {
  where?: any;
}
