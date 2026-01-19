import type { BaseDto } from "./base.dto";

export interface RoleCreateUpdateDto {
  code: string;
  name: string;
  description?: string;
}

export interface RoleUpdateDto {
  code: string;
  name: string;
  description?: string;
  permissions: RolePermissionCreateDto[];
}

export interface RolePageRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface RoleDto extends BaseDto {
  code: string;
  name: string;
  description: string;
}

export interface RolePermissionCreateDto {
  module: string;
  isCanRead: boolean;
  isCanCreate: boolean;
  isCanUpdate: boolean;
  isCanDelete: boolean;
  isCanActivate: boolean;
  isCanDeactivate: boolean;
  isCanExport: boolean;
  isCanImport: boolean;
}
