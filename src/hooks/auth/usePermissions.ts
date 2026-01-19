import { useMemo } from "react";
import { useUserInfo } from "@/hooks/auth/useUserInfo";
import { canAccessModule, isAdmin } from "@/common/helpers/permissions";
import { ModuleCode, type ModuleCodeType } from "@/dto/auth.dto";

/**
 * Map route paths to module codes
 */
const ROUTE_MODULE_MAP: Record<string, ModuleCodeType> = {
  "/user_manager/customer": ModuleCode.CUSTOMER,
  "/user_manager/employee": ModuleCode.EMPLOYEE,
  "/user_manager/role": ModuleCode.ROLE,
  "/car_trip_manager/car": ModuleCode.CAR,
  "/car_trip_manager/route": ModuleCode.ROUTE,
  "/car_trip_manager/trip": ModuleCode.TRIP,
  "/booking": ModuleCode.BOOKING,
  "/payment": ModuleCode.PAYMENT,
  "/transaction": ModuleCode.PAYMENT,
};

/**
 * Hook to check if a route is accessible based on user permissions
 * 
 * IMPORTANT: Admin users (isAdmin = true) can access ALL routes
 */
export function useCanAccessRoute(routePath: string): boolean {
  const userInfo = useUserInfo();

  return useMemo(() => {
    if (!userInfo) return false;
    
    // ⚠️ ADMIN BYPASS: Admin can access all routes
    if (isAdmin(userInfo)) return true;

    // Find matching module code for the route
    const moduleCode = Object.keys(ROUTE_MODULE_MAP).find((path) =>
      routePath.startsWith(path)
    );

    if (!moduleCode) {
      // If no module code found, allow access (for dashboard, profile, etc.)
      return true;
    }

    return canAccessModule(ROUTE_MODULE_MAP[moduleCode], userInfo);
  }, [userInfo, routePath]);
}

/**
 * Hook to get all accessible route paths
 * 
 * IMPORTANT: Admin users get access to ALL routes
 */
export function useAccessibleRoutes(): string[] {
  const userInfo = useUserInfo();

  return useMemo(() => {
    if (!userInfo) return [];

    // ⚠️ ADMIN BYPASS: Admin can access all routes
    if (isAdmin(userInfo)) {
      return Object.keys(ROUTE_MODULE_MAP);
    }

    return Object.entries(ROUTE_MODULE_MAP)
      .filter(([_, moduleCode]) => canAccessModule(moduleCode, userInfo))
      .map(([path]) => path);
  }, [userInfo]);
}

/**
 * Hook to check if user can access a specific module
 * 
 * IMPORTANT: Admin users can access ALL modules
 */
export function useCanAccessModule(moduleCode: ModuleCodeType): boolean {
  const userInfo = useUserInfo();

  return useMemo(() => {
    if (!userInfo) return false;
    
    // ⚠️ ADMIN BYPASS: Admin can access all modules
    if (isAdmin(userInfo)) return true;
    
    return canAccessModule(moduleCode, userInfo);
  }, [userInfo, moduleCode]);
}
