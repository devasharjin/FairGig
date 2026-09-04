import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import Loader from "../common/Loader";
import { getRoleDashboardPath } from "@/lib/routes";

export const PublicOnlyLayout = () => {
  const location = useLocation();
  const { user, isBootstrapped } = useAuthStore();

  if (!isBootstrapped) {
    return <Loader />;
  }

  if (user) {
    const roles: string[] = Array.isArray(user.role)
      ? user.role.map((r) => (typeof r === "string" ? r.toUpperCase() : ""))
      : typeof user.role === "string"
      ? [user.role.toUpperCase()]
      : [];

    const isWorker = roles.includes("WORKER");
    const isCoop = roles.includes("COOPERATIVE");

    // Allow logged-in customers to register as a worker if they aren't already one
    if (location.pathname === "/register/worker") {
      if (isWorker) {
        return <Navigate to="/worker" replace />;
      }
      return <Outlet />;
    }

    // Allow logged-in users to register as a cooperative if they aren't already one
    if (location.pathname === "/register/cooperative") {
      if (isCoop) {
        return <Navigate to="/cooperative" replace />;
      }
      return <Outlet />;
    }

    if (
      location.pathname === "/login" ||
      location.pathname.startsWith("/register")
    ) {
      return <Navigate to={getRoleDashboardPath(user.role)} replace />;
    }
  }

  return <Outlet />;
};
