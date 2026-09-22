import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthProvider from "./features/auth/AuthProvider";
import { useAuthStore } from "./features/auth/store";
import { getRoleDashboardPath } from "./lib/routes";

// Layouts
import { PublicOnlyLayout } from "./components/auth/publicOnlyLayout";
import { ProtectedLayout } from "./components/auth/protectedLayout";
import { RoleGuardLayout } from "./components/auth/RoleGuard";
import CustomerLayout from "./components/layout/customerLayout";
import WorkerLayout from "./components/layout/workerLayout";
import CooperativeLayout from "./components/layout/cooperateLayout";
import SuperAdminLayout from "./components/layout/superAdminLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import WorkerRegister from "./pages/auth/WorkerRegister";
import CooperativeRegister from "./pages/auth/CooperativeRegister";

// Role Home Pages
import CustomerHome from "./pages/customer/Home";
import WorkerHome from "./pages/worker/Home";
import CooperativeHome from "./pages/cooperative/Home";
import CooperativeMembers from "./pages/cooperative/Members";
import WorkerVerifications from "./pages/cooperative/WorkerVerifications";
import SuperAdminHome from "./pages/superAdmin/Home";
import AdminUsers from "./pages/superAdmin/Users";
import AdminServices from "./pages/superAdmin/Services";
import AdminVerifications from "./pages/superAdmin/Verifications";
import AdminPayments from "./pages/superAdmin/Payments";
import CooperativePayments from "./pages/cooperative/Payments";
import CustomerServices from "./pages/customer/Services";
import CustomerBookings from "./pages/customer/Bookings";
import CustomerBookingDetails from "./pages/customer/BookingDetails";
import CustomerProfile from "./pages/customer/Profile";
import CustomerContact from "./pages/customer/Contact";
import WorkerJobs from "./pages/worker/Jobs";
import WorkerMyBookings from "./pages/worker/MyBookings";
import WorkerBookingDetails from "./pages/worker/BookingDetails";
import WorkerSchedule from "./pages/worker/Schedule";
import WorkerProfile from "./pages/worker/Profile";
import WorkerWelfare from "./pages/worker/Welfare";
import CooperativeWelfare from "./pages/cooperative/Welfare";
import SuperAdminWelfare from "./pages/superAdmin/Welfare";
import CooperativeForecasting from "./pages/cooperative/Forecasting";
import SuperAdminForecasting from "./pages/superAdmin/Forecasting";

function DashboardRedirect() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role || (user as any).user?.role;
  return <Navigate to={getRoleDashboardPath(role)} replace />;
}

function WelfareRedirect() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role || (user as any).user?.role;
  const roleList = Array.isArray(role) ? role : [role];

  if (roleList.includes("WORKER")) {
    return <Navigate to="/worker/welfare" replace />;
  }
  if (roleList.includes("COOPERATIVE")) {
    return <Navigate to="/cooperative/welfare" replace />;
  }
  if (roleList.includes("SUPERADMIN")) {
    return <Navigate to="/admin/welfare" replace />;
  }
  return <Navigate to="/services" replace />;
}

function ForecastingRedirect() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role || (user as any).user?.role;
  const roleList = Array.isArray(role) ? role : [role];

  if (roleList.includes("COOPERATIVE")) {
    return <Navigate to="/cooperative/forecasting" replace />;
  }
  if (roleList.includes("SUPERADMIN")) {
    return <Navigate to="/admin/forecasting" replace />;
  }
  if (roleList.includes("WORKER")) {
    return <Navigate to="/worker/jobs" replace />;
  }
  return <Navigate to="/services" replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider />,
    children: [
      // =========================
      // PUBLIC ONLY (AUTH)
      // =========================
      {
        element: <PublicOnlyLayout />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "register/customer",
            element: <Register />,
          },
          {
            path: "register/worker",
            element: <WorkerRegister />,
          },
          {
            path: "register/cooperative",
            element: <CooperativeRegister />,
          },
        ],
      },

      // =========================
      // CUSTOMER / MAIN APP (/)
      // =========================
      {
        path: "/",
        element: <CustomerLayout />,
        children: [
          {
            index: true,
            element: <CustomerHome />,
          },
          {
            path: "categories",
            element: <Navigate to="/services" replace />,
          },
          {
            path: "services",
            element: <CustomerServices />,
          },
          {
            path: "bookings",
            element: <CustomerBookings />,
          },
          {
            path: "bookings/:id",
            element: <CustomerBookingDetails />,
          },
          {
            path: "mybookings",
            element: <CustomerBookings />,
          },
          {
            path: "mybookings/:id",
            element: <CustomerBookingDetails />,
          },
          {
            path: "profile",
            element: <CustomerProfile />,
          },
          {
            path: "contact",
            element: <CustomerContact />,
          },
        ],
      },

      // =========================
      // PROTECTED ROLE DASHBOARDS
      // =========================
      {
        element: <ProtectedLayout />,
        children: [
          // WORKER (/worker)
          {
            path: "worker",
            element: <RoleGuardLayout allow={["WORKER"]} />,
            children: [
              {
                element: <WorkerLayout />,
                children: [
                  {
                    index: true,
                    element: <WorkerHome />,
                  },
                  {
                    path: "jobs",
                    element: <WorkerJobs />,
                  },
                  {
                    path: "bookings",
                    element: <WorkerMyBookings />,
                  },
                  {
                    path: "bookings/:id",
                    element: <WorkerBookingDetails />,
                  },
                  {
                    path: "schedule",
                    element: <WorkerSchedule />,
                  },
                  {
                    path: "profile",
                    element: <WorkerProfile />,
                  },
                  {
                    path: "welfare",
                    element: <WorkerWelfare />,
                  },
                ],
              },
            ],
          },

          // COOPERATIVE (/cooperative)
          {
            path: "cooperative",
            element: <RoleGuardLayout allow={["COOPERATIVE"]} />,
            children: [
              {
                element: <CooperativeLayout />,
                children: [
                  {
                    index: true,
                    element: <CooperativeHome />,
                  },
                  {
                    path: "verifications",
                    element: <WorkerVerifications />,
                  },
                  {
                    path: "payments",
                    element: <CooperativePayments />,
                  },
                  {
                    path: "welfare",
                    element: <CooperativeWelfare />,
                  },
                  {
                    path: "forecasting",
                    element: <CooperativeForecasting />,
                  },
                  {
                    path: "members",
                    element: <CooperativeMembers />,
                  },
                ],
              },
            ],
          },


          // SUPER ADMIN (/admin)
          {
            path: "admin",
            element: <RoleGuardLayout allow={["SUPERADMIN"]} />,
            children: [
              {
                element: <SuperAdminLayout />,
                children: [
                  {
                    index: true,
                    element: <SuperAdminHome />,
                  },
                  {
                    path: "payments",
                    element: <AdminPayments />,
                  },
                  {
                    path: "verifications",
                    element: <AdminVerifications />,
                  },
                  {
                    path: "users",
                    element: <AdminUsers />,
                  },
                  {
                    path : "services",
                    element : <AdminServices />
                  },
                  {
                    path: "welfare",
                    element: <SuperAdminWelfare />,
                  },
                  {
                    path: "forecasting",
                    element: <SuperAdminForecasting />,
                  },
                ],
              },
            ],
          },

          // Redirect shortcuts & backwards compatibility
          {
            path: "dashboard",
            element: <DashboardRedirect />,
          },
          {
            path: "welfare",
            element: <WelfareRedirect />,
          },
          {
            path: "forecasting",
            element: <ForecastingRedirect />,
          },
          {
            path: "dashboard/customer",
            element: <Navigate to="/" replace />,
          },
          {
            path: "dashboard/worker",
            element: <Navigate to="/worker" replace />,
          },
          {
            path: "dashboard/cooperative",
            element: <Navigate to="/cooperative" replace />,
          },
          {
            path: "dashboard/superadmin",
            element: <Navigate to="/admin" replace />,
          },
        ],
      },

      // =========================
      // FALLBACK
      // =========================
      {
        path: "*",
        element: <DashboardRedirect />,
      },
    ],
  },
]);