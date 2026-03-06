import type { BaseDto } from "./base.dto";

export interface DepartmentDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  parentDepartmentId?: string;
  parentDepartmentName?: string;
  isActive: boolean;
}

export interface DepartmentCreateDto {
  code: string;
  name: string;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
}

export interface DepartmentUpdateDto {
  code?: string;
  name?: string;
  description?: string;
  managerId?: string;
  parentDepartmentId?: string;
}

export interface DepartmentFilter {
  code?: string;
  name?: string;
  managerId?: string;
  parentDepartmentId?: string;
  isActive?: boolean;
}

export interface DepartmentSearchRequest {
  skip: number;
  take: number;
  where?: DepartmentFilter;
}

export interface DepartmentPageRequest extends DepartmentFilter {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface DepartmentSelectDto {
  id: string;
  code: string;
  name: string;
}
