import type { BaseDto } from "./base.dto";
import type { RoleDto } from "./role.dto";

export interface EmployeeDto extends BaseDto {
  code: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
  roles: RoleDto[];
}

export interface EmployeeCreateDto {
  code: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
  roles: RoleDto[];
}

export interface EmployeeUpdateDto {
  code: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
  roles: RoleDto[];
}

export interface EmployeeFilter {
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  isDeleted?: boolean;
  roleIds?: string[]; // role filter
  roleFilterMode?: "OR" | "AND" | "EXCLUDE"; // filter mode
}

export interface EmployeePageRequest extends EmployeeFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}
