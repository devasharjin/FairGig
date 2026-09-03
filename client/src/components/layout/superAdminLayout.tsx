import { Outlet } from "react-router-dom";
import SuperAdminNavbar from "../superAdmin/common/navbar";
import Footer from "../common/footer";

export const SuperAdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SuperAdminNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default SuperAdminLayout;