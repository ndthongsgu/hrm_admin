import type { BaseDto } from "./base.dto";

export interface RoleDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  permissionsJson?: Record<string, string[]>; // JSON format: {"EMPLOYEE": ["READ", "CREATE"], ...}
  isActive: boolean;
}

export interface RoleCreateDto {
  code: string;
  name: string;
  description?: string;
  permissionsJson?: Record<string, string[]>;
}

export interface RoleUpdateDto {
  code?: string;
  name?: string;
  description?: string;
  permissionsJson?: Record<string, string[]>;
}

export interface RolePageRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
  code?: string;
  name?: string;
  isActive?: boolean;
}

export interface RoleSelectDto {
  id: string;
  code: string;
  name: string;
}

// Permission structure for frontend use
export interface RolePermission {
  module: string;
  actions: string[];
}
