import React from "react";
import type { ModuleCodeType, PermissionAction } from "@/dto/auth.dto";
import { hasPermission, hasAnyPermission } from "@/common/helpers/permissions";
import { useUserInfo } from "@/hooks/auth/useUserInfo";

export type CanProps = {
  moduleCode: ModuleCodeType;
  action: PermissionAction | PermissionAction[];
  mode?: "hide" | "disable";
  children: React.ReactElement;
  fallback?: React.ReactNode;
};

/**
 * Component to conditionally render based on user permissions
 * 
 * @example
 * // Hide button if user doesn't have create permission
 * <Can moduleCode="CUSTOMER" action="canCreate">
 *   <Button>Create Customer</Button>
 * </Can>
 * 
 * @example
 * // Disable button if user doesn't have update permission
 * <Can moduleCode="CUSTOMER" action="canUpdate" mode="disable">
 *   <Button>Edit Customer</Button>
 * </Can>
 * 
 * @example
 * // Check multiple actions (user needs at least one)
 * <Can moduleCode="CUSTOMER" action={["canCreate", "canUpdate"]}>
 *   <Button>Add/Edit Customer</Button>
 * </Can>
 */
export default function Can({
  moduleCode,
  action,
  mode = "hide",
  children,
  fallback = null,
}: CanProps) {
  const userInfo = useUserInfo();

  const allowed = Array.isArray(action)
    ? hasAnyPermission(moduleCode, action, userInfo)
    : hasPermission(moduleCode, action, userInfo);

  if (allowed) return children;

  if (mode === "disable" && React.isValidElement(children)) {
    return React.cloneElement(children, { disabled: true } as any);
  }

  return <>{fallback}</>;
}
