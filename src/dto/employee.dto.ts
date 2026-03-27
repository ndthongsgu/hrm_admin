import type { BaseDto } from "./base.dto";

interface EmployeeDepartmentRef {
  id: string;
  name?: string;
  code?: string;
}

interface EmployeePositionRef {
  id: string;
  name?: string;
  code?: string;
  department?: EmployeeDepartmentRef | null;
}

interface EmployeeContractRef {
  id: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string | null;
  status?: string;
  position?: EmployeePositionRef | null;
}

export type EmployeeStatus = "ACTIVE" | "RESIGNED" | "DEACTIVE";

export interface EmployeeDto extends BaseDto {
  code?: string;
  employeeCode: string;
  status?: EmployeeStatus;
  fullName: string;
  email?: string;
  phone?: string;
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
  department?: EmployeeDepartmentRef | null;
  departmentId?: string;
  departmentName?: string;
  position?: EmployeePositionRef | null;
  positionId?: string;
  positionName?: string;
  hireDate?: string;
  terminationDate?: string;
  isActive: boolean;
  contracts?: EmployeeContractRef[];
  userId?: string;
  notes?: string;
  officeLocationId?: string;
}

export interface EmployeeCreateDto {
  code: string;
  employeeCode?: string;
  status?: EmployeeStatus;
  fullName: string;
  email?: string;
  phone?: string;
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
  officeLocationId?: string;
}

export interface EmployeeUpdateDto {
  code?: string;
  employeeCode?: string;
  status?: EmployeeStatus;
  fullName?: string;
  email?: string;
  phone?: string;
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
  officeLocationId?: string;
}

export interface EmployeeFilter {
  code?: string;
  employeeCode?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  departmentId?: string;
  positionId?: string;
  status?: EmployeeStatus;
  isActive?: boolean;
  officeLocationId?: string;
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
