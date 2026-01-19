import { Navigate } from "react-router-dom";
import { useCanAccessRoute } from "@/hooks/auth/usePermissions";
import { useUserInfo } from "@/hooks/auth/useUserInfo";
import { ROUTES } from "@/common/constants/routes";

interface ProtectedRouteProps {
  children: React.ReactElement;
  routePath: string;
}

/**
 * Component to protect routes based on user permissions
 * Redirects to home if user doesn't have access
 */
export default function ProtectedRoute({
  children,
  routePath,
}: ProtectedRouteProps) {
  const userInfo = useUserInfo();
  const canAccess = useCanAccessRoute(routePath);

  // Wait for user info to load
  if (!userInfo) {
    return null; // or a loading spinner
  }

  if (!canAccess) {
    return <Navigate to={ROUTES.MAIN.HOME.path} replace />;
  }

  return children;
}
