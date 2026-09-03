import { Outlet } from "react-router-dom";
import CustomerNavbar from "../customer/common/navbar";
import Footer from "../common/footer";

const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <CustomerNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;