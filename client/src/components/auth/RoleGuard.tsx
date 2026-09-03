import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import Loader from "../common/Loader";
import type { UserRole } from "@/lib/types";
import { getRoleDashboardPath } from "@/lib/routes";

type RoleGuardLayoutProps = {
  allow: UserRole[];
};

export const RoleGuardLayout = ({ allow }: RoleGuardLayoutProps) => {
  const { user, isBootstrapped } = useAuthStore();

  if (!isBootstrapped) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role || (user as any).user?.role;
  const userRoles: string[] = Array.isArray(userRole)
    ? userRole.map((r) => (typeof r === "string" ? r.toUpperCase() : ""))
    : typeof userRole === "string"
    ? [userRole.toUpperCase()]
    : [];

  const isAllowed = allow.some((allowedRole) => {
    const normAllowed =
      allowedRole === "SUPERADMIN" ? "SUPERADMIN" : allowedRole.toUpperCase();
    return (
      userRoles.includes(allowedRole.toUpperCase()) ||
      userRoles.includes(normAllowed)
    );
  });

  if (!isAllowed) {
    return <Navigate to={getRoleDashboardPath(userRole)} replace />;
  }

  return <Outlet />;
};