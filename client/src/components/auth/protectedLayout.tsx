import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import Loader from "../common/Loader";

export const ProtectedLayout = () => {
  const { user, isBootstrapped } = useAuthStore();

  if (!isBootstrapped) {
    return <Loader/>
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};