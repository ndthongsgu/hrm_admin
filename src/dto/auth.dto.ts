import type { RoleDto } from "./role.dto";

export interface LoginRequest {
  username: string;
  password: string;
  loginAsAdmin?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
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
  permissions: Record<string, ModulePermission>;
}

// Module Codes
export const ModuleCode = {
  CUSTOMER: "CUSTOMER",
  USER: "USER",
  CAR: "CAR",
  ROUTE: "ROUTE",
  TRIP: "TRIP",
  BOOKING: "BOOKING",
  PAYMENT: "PAYMENT",
  ROLE: "ROLE",
  EMPLOYEE: "EMPLOYEE",
  CUSTOMER_TYPE: "CUSTOMER_TYPE",
  CAR_TYPE: "CAR_TYPE",
  PAYMENT_METHOD: "PAYMENT_METHOD",
  PERMISSION: "PERMISSION",
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
