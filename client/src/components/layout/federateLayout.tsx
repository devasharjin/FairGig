import { Outlet } from "react-router-dom";
import FederationNavbar from "../federate/common/navbar";
import Footer from "../common/footer";

export const FederationLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <FederationNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default FederationLayout;