import type { BaseDto } from "./base.dto";

export interface EmployeeDto extends BaseDto {
  employeeCode: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  taxCode?: string;
  socialInsuranceNumber?: string;
  healthInsuranceNumber?: string;
  bankAccount?: string;
  bankName?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  departmentId?: string;
  departmentName?: string;
  positionId?: string;
  positionName?: string;
  hireDate?: string;
  terminationDate?: string;
  isActive: boolean;
  userId?: string;
  notes?: string;
}

export interface EmployeeCreateDto {
  code: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  taxCode?: string;
  socialInsuranceNumber?: string;
  healthInsuranceNumber?: string;
  bankAccount?: string;
  bankName?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  departmentId?: string;
  positionId?: string;
  hireDate?: string;
  userId?: string;
  notes?: string;
}

export interface EmployeeUpdateDto {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  taxCode?: string;
  socialInsuranceNumber?: string;
  healthInsuranceNumber?: string;
  bankAccount?: string;
  bankName?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  departmentId?: string;
  positionId?: string;
  hireDate?: string;
  terminationDate?: string;
  notes?: string;
}

export interface EmployeeFilter {
  code?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  departmentId?: string;
  positionId?: string;
  isActive?: boolean;
}

export interface EmployeePageRequest extends EmployeeFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface EmployeeSelectDto {
  id: string;
  code: string;
  fullName: string;
  departmentName?: string;
  positionName?: string;
}
