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
import FederationLayout from "./components/layout/federateLayout";
import SuperAdminLayout from "./components/layout/superAdminLayout";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import WorkerRegister from "./pages/auth/WorkerRegister";
import CooperativeRegister from "./pages/auth/CooperativeRegister";
import FederateRegister from "./pages/auth/FederateRegister";

// Role Home Pages
import CustomerHome from "./pages/customer/Home";
import WorkerHome from "./pages/worker/Home";
import CooperativeHome from "./pages/cooperative/Home";
import FederationHome from "./pages/federation/Home";
import SuperAdminHome from "./pages/superAdmin/Home";

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
          {
            path: "register/federation",
            element: <FederateRegister />,
          }
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
                    element: <WorkerHome />,
                  },
                  {
                    path: "schedule",
                    element: <WorkerHome />,
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

          // FEDERATION (/federation)
          {
            path: "federation",
            element: <RoleGuardLayout allow={["FEDERATION"]} />,
            children: [
              {
                element: <FederationLayout />,
                children: [
                  {
                    index: true,
                    element: <FederationHome />,
                  },
                  {
                    path: "cooperatives",
                    element: <FederationHome />,
                  },
                  {
                    path: "policies",
                    element: <FederationHome />,
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
                    element: <SuperAdminHome />,
                  },
                  {
                    path: "users",
                    element: <SuperAdminHome />,
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
            path: "dashboard/federation",
            element: <Navigate to="/federation" replace />,
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