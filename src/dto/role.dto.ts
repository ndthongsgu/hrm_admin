import type { BaseDto } from "./base.dto";

// Backend response format (permissionsJson as string)
interface RoleBackendDto extends BaseDto {
  name: string;
  description?: string;
  permissionsJson?: string; // Backend stores as JSON string in DB
  isDeleted?: boolean;
}

// Frontend DTO (permissions as object - type-safe, easy to use)
export interface RoleDto extends BaseDto {
  name: string;
  description?: string;
  permissionsJson?: string;
  permissions?: Record<string, string[]>; // Frontend uses object format: {"EMPLOYEE": ["READ", "CREATE"], ...}
  isDeleted?: boolean;
}

export interface RoleCreateDto {
  name: string;
  description?: string;
  permissionsJson?: string;
  permissions?: Record<string, string[]>; // Frontend sends as object
}

export interface RoleUpdateDto {
  name?: string;
  description?: string;
  permissionsJson?: string;
  permissions?: Record<string, string[]>; // Frontend sends as object
}

export interface RoleFilter {
  name?: string;
  isActive?: boolean;
}

export interface RoleSearchRequest {
  skip: number;
  take: number;
  where?: RoleFilter;
}

export interface RolePageRequest {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: string;
  name?: string;
  isActive?: boolean;
}

export interface RoleSelectDto {
  id: string;
  name: string;
}

// Permission structure for frontend use
export interface RolePermission {
  module: string;
  actions: string[];
}

/**
 * Transform backend response (permissionsJson: string) to frontend format (permissions: object)
 */
export function transformRoleFromBackend(backend: RoleBackendDto): RoleDto {
  return {
    ...backend,
    permissions: backend.permissionsJson
      ? parsePermissionsJson(backend.permissionsJson)
      : undefined,
  };
}

/**
 * Transform frontend format (permissions: object) to backend request (permissionsJson: string)
 */
export function transformRoleToBackend(
  frontend: RoleCreateDto | RoleUpdateDto
): Omit<RoleBackendDto, keyof BaseDto> {
  return {
    name: frontend.name || "",
    description: frontend.description,
    permissionsJson:
      frontend.permissionsJson ||
      (frontend.permissions ? JSON.stringify(frontend.permissions) : undefined),
    isDeleted: false,
  };
}

/**
 * Parse permissionsJson string to Record<string, string[]>
 */
function parsePermissionsJson(
  jsonString: string
): Record<string, string[]> {
  try {
    return JSON.parse(jsonString);
  } catch {
    return {};
  }
}
