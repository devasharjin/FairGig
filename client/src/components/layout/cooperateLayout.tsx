import { Outlet } from "react-router-dom";
import CooperativeNavbar from "../cooperative/common/navbar";
import Footer from "../common/footer";

export const CooperativeLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <CooperativeNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CooperativeLayout;