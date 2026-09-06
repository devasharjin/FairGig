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
import WorkerVerifications from "./pages/cooperative/WorkerVerifications";
import SuperAdminHome from "./pages/superAdmin/Home";
import AdminServices from "./pages/superAdmin/Services";
import AdminVerifications from "./pages/superAdmin/Verifications";
import CustomerServices from "./pages/customer/Services";
import CustomerBookings from "./pages/customer/Bookings";
import CustomerBookingDetails from "./pages/customer/BookingDetails";
import WorkerJobs from "./pages/worker/Jobs";
import WorkerMyBookings from "./pages/worker/MyBookings";
import WorkerBookingDetails from "./pages/worker/BookingDetails";
import WorkerSchedule from "./pages/worker/Schedule";
import WorkerProfile from "./pages/worker/Profile";

function DashboardRedirect() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.role || (user as any).user?.role;
  return <Navigate to={getRoleDashboardPath(role)} replace />;
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
            element: <CustomerHome />,
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
                    path: "members",
                    element: <CooperativeHome />,
                  },
                  {
                    path: "bids",
                    element: <CooperativeHome />,
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
                    path: "verifications",
                    element: <AdminVerifications />,
                  },
                  {
                    path: "users",
                    element: <SuperAdminHome />,
                  },
                  {
                    path : "services",
                    element : <AdminServices />
                  }
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