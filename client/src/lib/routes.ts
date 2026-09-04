import type { UserRole } from "./types";

/**
 * Determine dashboard redirect route based on user role
 * Safely handles strings, string arrays, undefined, or unexpected shapes
 */
export function getRoleDashboardPath(
  role?: UserRole | UserRole[] | string | string[] | any
): string {
  let selectedRole: string | undefined;

  if (Array.isArray(role)) {
    const uppercaseRoles = role
      .map((r) => (typeof r === "string" ? r.toUpperCase() : ""))
      .filter(Boolean);

    if (uppercaseRoles.includes("SUPERADMIN")) {
      selectedRole = "SUPERADMIN";
    } else if (uppercaseRoles.includes("COOPERATIVE")) {
      selectedRole = "COOPERATIVE";
    } else if (uppercaseRoles.includes("WORKER")) {
      selectedRole = "WORKER";
    } else if (uppercaseRoles.includes("CUSTOMER")) {
      selectedRole = "CUSTOMER";
    } else if (uppercaseRoles.length > 0) {
      selectedRole = uppercaseRoles[0];
    }
  } else if (typeof role === "string") {
    selectedRole = role;
  } else if (role && typeof role === "object") {
    // If nested under { role: ... } or similar object
    const nested = (role as any).role || (role as any).name;
    return getRoleDashboardPath(nested);
  }

  const normalizedRole =
    typeof selectedRole === "string" ? selectedRole.trim().toUpperCase() : "";

  switch (normalizedRole) {
    case "CUSTOMER":
      return "/";
    case "WORKER":
      return "/worker";
    case "COOPERATIVE":
      return "/cooperative";
    case "SUPERADMIN":
      return "/admin";
    default:
      return "/";
  }
}
