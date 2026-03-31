import type { RoleDto } from "./role.dto";

export interface LoginRequest {
  username: string;
  password: string;
  loginAsAdmin?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  type: string;
  id: string;
  username: string;
  email: string;
  roles: string[];
  isAdmin?: boolean;
  // Backward compatibility: also support token
  token?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  roles: RoleDto[];
  isGoogle: boolean;
}

// Module Permission Interface
export interface ModulePermission {
  code: string;
  name: string;
  description: string;
  urlPageView: string;
  isCanRead: boolean;
  isCanCreate: boolean;
  isCanUpdate: boolean;
  isCanDelete: boolean;
  isCanActivate: boolean;
  isCanDeactivate: boolean;
  isCanImport: boolean;
  isCanExport: boolean;
}

// User Info with Permissions
export interface UserInfo {
  userId: string;
  username: string;
  email: string;
  name: string;
  isAdmin: boolean;
  isGoogle: boolean;
  // Permissions in JSON format from backend: {"EMPLOYEE": ["READ","CREATE"], "PAYROLL": ["READ"]}
  permissions: Record<string, string[]>;
}

// Module Codes
export const ModuleCode = {
  PERMISSION: "PERMISSION",
  DEPARTMENT: "DEPARTMENT",
  POSITION: "POSITION",
  PAYROLL: "PAYROLL",
  EMPLOYEE: "EMPLOYEE",
  ROLE: "ROLE",
  SETTINGS: "SETTINGS",
  CUSTOMER: "CUSTOMER",
  CAR: "CAR",
  ROUTE: "ROUTE",
  TRIP: "TRIP",
  BOOKING: "BOOKING",
  PAYMENT: "PAYMENT",
  OFFICE_LOCATION: "OFFICE_LOCATION",
} as const;

export type ModuleCodeType = (typeof ModuleCode)[keyof typeof ModuleCode];

// Permission Actions
export type PermissionAction =
  | "isCanRead"
  | "isCanCreate"
  | "isCanUpdate"
  | "isCanDelete"
  | "isCanActivate"
  | "isCanDeactivate"
  | "isCanImport"
  | "isCanExport";
