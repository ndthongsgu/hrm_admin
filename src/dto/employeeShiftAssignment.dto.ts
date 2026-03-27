import type { BaseDto } from "./base.dto";
import type { EmployeeDto } from "./employee.dto";
import type { WorkShiftDto } from "./workshift.dto";

export interface EmployeeShiftAssignmentDto extends BaseDto {
  id: string;
  employeeId?: string;
  employeeCode?: string;
  employeeName?: string;
  shiftId?: string;
  shiftName?: string;
  startDate?: string;
  endDate?: string | null;
  employee: EmployeeDto;
  shift: WorkShiftDto;
}

export interface EmployeeShiftAssignmentFilter {
  employeeCode?: string;
  employeeName?: string;
  shiftId?: string;
  shiftName?: string;
  startDate?: string;
  endDate?: string;
}

export interface EmployeeShiftAssignmentPageRequest extends EmployeeShiftAssignmentFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
