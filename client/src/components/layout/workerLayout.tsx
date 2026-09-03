import { Outlet } from "react-router-dom";
import WorkerNavbar from "../worker/common/navbar";
import Footer from "../common/footer";

export const WorkerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <WorkerNavbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default WorkerLayout;