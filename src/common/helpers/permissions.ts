import type {
  ModuleCodeType,
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
 * Map PermissionAction to backend action string
 */
function mapActionToBackend(action: PermissionAction): string {
  const actionMap: Record<PermissionAction, string> = {
    isCanRead: "READ",
    isCanCreate: "CREATE",
    isCanUpdate: "UPDATE",
    isCanDelete: "DELETE",
    isCanActivate: "ACTIVATE",
    isCanDeactivate: "DEACTIVATE",
    isCanImport: "IMPORT",
    isCanExport: "EXPORT",
  };
  return actionMap[action] || action;
}

/**
 * Check if user has permission for a specific module and action
 * 
 * IMPORTANT: Admin users (isAdmin = true) automatically have ALL permissions
 * and this function will always return true for them.
 * 
 * Permissions format: {"EMPLOYEE": ["READ","CREATE"], "PAYROLL": ["READ"]}
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

  const moduleActions = userInfo.permissions[moduleCode];
  if (!moduleActions || !Array.isArray(moduleActions)) {
    return false;
  }

  // Map frontend action to backend action string
  const backendAction = mapActionToBackend(action);
  return moduleActions.includes(backendAction);
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
 * 
 * Permissions format: {"EMPLOYEE": ["READ","CREATE"], "PAYROLL": ["READ"]}
 */
export function getAccessibleModules(
  userInfo: UserInfo | null
): string[] {
  if (!userInfo || !userInfo.permissions) {
    return [];
  }

  // ⚠️ ADMIN BYPASS: Admin can access all modules
  if (isAdmin(userInfo)) {
    return Object.keys(userInfo.permissions);
  }

  // Return modules that have READ permission
  return Object.keys(userInfo.permissions).filter((moduleCode) => {
    const actions = userInfo.permissions[moduleCode];
    return actions && Array.isArray(actions) && actions.includes("READ");
  });
}

/**
 * Get accessible routes based on user permissions
 */
export function getAccessibleRoutes(userInfo: UserInfo | null): string[] {
  const accessibleModules = getAccessibleModules(userInfo);
  return accessibleModules.map((module) => `/${module.toLowerCase()}`);
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
 * Get permission actions for a specific module
 * Returns array of action strings like ["READ", "CREATE", "UPDATE"]
 */
export function getModulePermission(
  moduleCode: ModuleCodeType,
  userInfo: UserInfo | null
): string[] | null {
  if (!userInfo || !userInfo.permissions) {
    return null;
  }

  return userInfo.permissions[moduleCode] || null;
}
