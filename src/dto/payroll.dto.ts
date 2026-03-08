export interface SelectOptionDto {
  id: string;
  name: string;
}

export interface PayrollPeriodDto {
  id?: string;
  name: string;
  startDate: Date; // ISO date
  endDate: Date; // ISO date
  standardWorkingDays: number;
  isLocked?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  dateRange?: [Date, Date]; // For form initialization only, not part of API contract
}

export interface PayrollPeriodFilter {
  name?: string;
  isLocked?: boolean;
  isDeleted?: boolean;
  startDate?: Date;
  endDate?: Date;
  dateRange?: [Date, Date];
}

export interface AttendanceSummaryDto {
  id?: string;
  payrollPeriodId: string;
  payrollPeriodName?: string;
  employeeId: string;
  employeeName?: string;
  employeeCode?: string;
  actualWorkingDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  overtimeHours: number;
  isApproved?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AttendanceSummaryFilter {
  payrollPeriodId: string;
  isApproved?: boolean;
}

export interface SalaryAdjustmentDto {
  id?: string;
  payrollPeriodId: string;
  payrollPeriodName?: string;
  employeeId: string;
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
  employeeId: string;
  employeeName?: string;
  employeeCode?: string;
  contractId: string;
  
  // Income
  grossSalary: number;
  salaryByWorkdays: number;
  totalAllowance: number;
  totalBonus: number;
  
  // Insurance
  bhxhSalaryBase: number;
  bhxhAmount: number;
  bhytAmount: number;
  bhtnAmount: number;
  socialInsuranceBenefitAmount: number;
  
  // Tax
  taxableIncome: number;
  deductionPersonal: number;
  deductionDependents: number;
  assessableIncome: number;
  taxAmount: number;
  
  // Net
  netSalary: number;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PayslipFilter {
  payrollPeriodId?: string;
}
