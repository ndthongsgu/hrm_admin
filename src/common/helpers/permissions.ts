import type {
  ModuleCodeType,
  ModulePermission,
  PermissionAction,
  UserInfo,
} from "@/dto/auth.dto";

/**
 * Check if user is admin
 * Admin users have ALL permissions and bypass all permission checks
 */
export function isAdmin(userInfo: UserInfo | null): boolean {
  return userInfo?.isAdmin === true;
}

/**
 * Check if user has permission for a specific module and action
 * 
 * IMPORTANT: Admin users (isAdmin = true) automatically have ALL permissions
 * and this function will always return true for them.
 */
export function hasPermission(
  moduleCode: ModuleCodeType,
  action: PermissionAction,
  userInfo: UserInfo | null
): boolean {
  // ⚠️ ADMIN BYPASS: Admin users have ALL permissions
  if (isAdmin(userInfo)) {
    return true;
  }

  if (!userInfo || !userInfo.permissions) {
    return false;
  }

  const modulePermission = userInfo.permissions[moduleCode];
  if (!modulePermission) {
    return false;
  }

  return modulePermission[action] === true;
}

/**
 * Check if user can access a module (has canRead permission)
 * 
 * IMPORTANT: Admin users (isAdmin = true) can access ALL modules
 */
export function canAccessModule(
  moduleCode: ModuleCodeType,
  userInfo: UserInfo | null
): boolean {
  // ⚠️ ADMIN BYPASS: Admin can access all modules
  if (isAdmin(userInfo)) {
    return true;
  }
  
  return hasPermission(moduleCode, "isCanRead", userInfo);
}

/**
 * Get all accessible modules for user
 * 
 * IMPORTANT: Admin users get access to ALL modules in their permissions object
 */
export function getAccessibleModules(
  userInfo: UserInfo | null
): ModulePermission[] {
  if (!userInfo) {
    return [];
  }

  // ⚠️ ADMIN BYPASS: Admin can access all modules
  if (isAdmin(userInfo)) {
    return Object.values(userInfo.permissions || {});
  }

  return Object.values(userInfo.permissions || {}).filter(
    (permission) => permission.isCanRead
  );
}

/**
 * Get accessible routes based on user permissions
 */
export function getAccessibleRoutes(userInfo: UserInfo | null): string[] {
  const accessibleModules = getAccessibleModules(userInfo);
  return accessibleModules.map((module) => module.urlPageView);
}

/**
 * Check if user can perform multiple actions (at least one)
 * 
 * IMPORTANT: Admin users automatically pass this check
 */
export function hasAnyPermission(
  moduleCode: ModuleCodeType,
  actions: PermissionAction[],
  userInfo: UserInfo | null
): boolean {
  // ⚠️ ADMIN BYPASS: Admin has all permissions
  if (isAdmin(userInfo)) {
    return true;
  }
  
  return actions.some((action) => hasPermission(moduleCode, action, userInfo));
}

/**
 * Check if user has all specified permissions
 * 
 * IMPORTANT: Admin users automatically pass this check
 */
export function hasAllPermissions(
  moduleCode: ModuleCodeType,
  actions: PermissionAction[],
  userInfo: UserInfo | null
): boolean {
  // ⚠️ ADMIN BYPASS: Admin has all permissions
  if (isAdmin(userInfo)) {
    return true;
  }
  
  return actions.every((action) => hasPermission(moduleCode, action, userInfo));
}

/**
 * Get permission for a specific module
 */
export function getModulePermission(
  moduleCode: ModuleCodeType,
  userInfo: UserInfo | null
): ModulePermission | null {
  if (!userInfo || !userInfo.permissions) {
    return null;
  }

  return userInfo.permissions[moduleCode] || null;
}
