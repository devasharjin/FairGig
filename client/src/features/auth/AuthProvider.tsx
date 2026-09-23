import { Outlet } from "react-router-dom";
import { useBootstrapAuth } from "./useBootstrapAuth";
import { SocketNotificationProvider } from "@/features/socket/SocketNotificationProvider";

const AuthProvider = () => {
  useBootstrapAuth();
  return (
    <SocketNotificationProvider>
      <Outlet />
    </SocketNotificationProvider>
  );
};

export default AuthProvider;