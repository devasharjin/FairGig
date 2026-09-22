import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Building2,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserX,
  Phone,
  Mail,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/features/auth/store";
import {
  getAdminUsers,
  getAdminUserStats,
  getAdminUserById,
  updateAdminUserStatus,
  updateAdminUserRoles,
} from "@/features/admin/users/api";
import type {
  AdminUser,
  AdminUserStats,
  AdminUserDetailResponse,
  UserRole,
  AccountStatus,
} from "@/features/admin/users/types";

const ALL_ROLES: UserRole[] = ["CUSTOMER", "WORKER", "COOPERATIVE", "SUPERADMIN"];

export function AdminUsers() {
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?._id || (currentUser as any)?.id || (currentUser as any)?.user?._id;

  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filter states
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals state
  const [detailUser, setDetailUser] = useState<AdminUserDetailResponse | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [statusTargetUser, setStatusTargetUser] = useState<AdminUser | null>(null);
  const [newStatusValue, setNewStatusValue] = useState<AccountStatus>("SUSPEND");
  const [statusReason, setStatusReason] = useState("");
  const [isSubmittingStatus, setIsSubmittingStatus] = useState(false);

  const [rolesTargetUser, setRolesTargetUser] = useState<AdminUser | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [isSubmittingRoles, setIsSubmittingRoles] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load stats
  const fetchStats = async () => {
    try {
      const data = await getAdminUserStats();
      setStats(data);
    } catch (err: any) {
      // Non-blocking
    }
  };

  // Load user list
  const fetchUsers = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const data = await getAdminUsers({
        page,
        limit,
        role: selectedRole,
        status: selectedStatus,
        search: debouncedSearch,
      });
      setUsers(data.users);
      setTotalUsers(data.total);
      setTotalPages(data.totalPages || 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page, limit, selectedRole, selectedStatus, debouncedSearch]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle open inspect modal
  const handleInspect = async (user: AdminUser) => {
    setIsDetailLoading(true);
    setDetailUser(null);
    try {
      const details = await getAdminUserById(user._id);
      setDetailUser(details);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch user profile details");
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Handle open status modal
  const handleOpenStatusModal = (user: AdminUser) => {
    setStatusTargetUser(user);
    const targetStatus: AccountStatus = user.accountStatus === "ACTIVE" ? "SUSPEND" : "ACTIVE";
    setNewStatusValue(targetStatus);
    setStatusReason("");
  };

  // Handle submit status change
  const handleSubmitStatus = async () => {
    if (!statusTargetUser) return;
    if (statusTargetUser._id === currentUserId && newStatusValue === "SUSPEND") {
      toast.error("You cannot suspend your own administrative session.");
      return;
    }

    setIsSubmittingStatus(true);
    try {
      const res = await updateAdminUserStatus(statusTargetUser._id, newStatusValue, statusReason);
      toast.success(res.message || "User account status updated successfully");
      setStatusTargetUser(null);
      fetchUsers(true);
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to update account status");
    } finally {
      setIsSubmittingStatus(false);
    }
  };

  // Handle open roles modal
  const handleOpenRolesModal = (user: AdminUser) => {
    setRolesTargetUser(user);
    setSelectedRoles([...user.role]);
  };

  const handleToggleRole = (role: UserRole) => {
    if (selectedRoles.includes(role)) {
      // Guard: if current user tries to remove SUPERADMIN from self
      if (rolesTargetUser?._id === currentUserId && role === "SUPERADMIN") {
        toast.error("You cannot revoke the SUPERADMIN role from your own active session");
        return;
      }
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  // Handle submit roles change
  const handleSubmitRoles = async () => {
    if (!rolesTargetUser) return;
    if (selectedRoles.length === 0) {
      toast.error("A user must have at least one assigned role");
      return;
    }

    setIsSubmittingRoles(true);
    try {
      const res = await updateAdminUserRoles(rolesTargetUser._id, selectedRoles);
      toast.success(res.message || "User roles updated successfully");
      setRolesTargetUser(null);
      fetchUsers(true);
      fetchStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user roles");
    } finally {
      setIsSubmittingRoles(false);
    }
  };

  // Render role badge helper
  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case "SUPERADMIN":
        return (
          <Badge key={role} variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[10px] font-semibold">
            <ShieldAlert className="size-2.5 mr-1" /> ADMIN
          </Badge>
        );
      case "COOPERATIVE":
        return (
          <Badge key={role} variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold">
            <Building2 className="size-2.5 mr-1" /> COOPERATIVE
          </Badge>
        );
      case "WORKER":
        return (
          <Badge key={role} variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold">
            <UserCheck className="size-2.5 mr-1" /> WORKER
          </Badge>
        );
      case "CUSTOMER":
      default:
        return (
          <Badge key={role} variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px] font-semibold">
            CUSTOMER
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 p-6 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-2.5 py-0.5 font-semibold text-xs tracking-wide">
              GOVERNANCE & ACCESS CONTROL
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">MULTI-TENANT DIRECTORY</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            User & Role Governance
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Audit identities, manage hierarchical permissions, inspect entity profiles, and enforce access suspensions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchUsers(true);
              fetchStats();
            }}
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh Directory</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="border-border/50 shadow-sm bg-card p-3 flex flex-col justify-between">
          <p className="text-[11px] font-medium text-muted-foreground uppercase">Total Users</p>
          <p className="text-2xl font-bold text-foreground font-mono mt-1">
            {stats?.totalUsers || 0}
          </p>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card p-3 flex flex-col justify-between">
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase">Active</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {stats?.activeUsers || 0}
          </p>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card p-3 flex flex-col justify-between">
          <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase">Suspended</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 font-mono mt-1">
            {stats?.suspendedUsers || 0}
          </p>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card p-3 flex flex-col justify-between">
          <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase">Customers</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono mt-1">
            {stats?.byRole.customers || 0}
          </p>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card p-3 flex flex-col justify-between">
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase">Workers</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            {stats?.byRole.workers || 0}
          </p>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card p-3 flex flex-col justify-between">
          <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase">Societies</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">
            {stats?.byRole.cooperatives || 0}
          </p>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card p-3 flex flex-col justify-between">
          <p className="text-[11px] font-medium text-purple-600 dark:text-purple-400 uppercase">Admins</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-mono mt-1">
            {stats?.byRole.superadmins || 0}
          </p>
        </Card>
      </div>

      {/* Filter Toolbar & Search */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search name, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Role Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { label: "All Roles", value: "ALL" },
                { label: "Customers", value: "CUSTOMER" },
                { label: "Gig Workers", value: "WORKER" },
                { label: "Cooperatives", value: "COOPERATIVE" },
                { label: "Admins", value: "SUPERADMIN" },
              ].map((tab) => (
                <Button
                  key={tab.value}
                  variant={selectedRole === tab.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedRole(tab.value);
                    setPage(1);
                  }}
                  className="h-8 text-xs font-medium"
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Status Select Filter */}
            <div className="w-full md:w-44">
              <Select
                value={selectedStatus}
                onValueChange={(val) => {
                  setSelectedStatus(val || "ALL");
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active Accounts</SelectItem>
                  <SelectItem value="SUSPEND">Suspended Accounts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Directory Table */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                <Users className="size-4 text-primary" />
                Directory Accounts
              </CardTitle>
              <CardDescription className="text-xs">
                Showing {users.length} of {totalUsers} registered platform entities
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <RefreshCw className="size-8 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground animate-pulse">Loading directory entries...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 space-y-2">
              <Users className="size-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-medium text-foreground">No matching users found</p>
              <p className="text-xs text-muted-foreground">
                Try adjusting your search criteria or role filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-muted-foreground bg-muted/30 border-b border-border/40 font-medium">
                  <tr>
                    <th className="py-3 pl-4 font-medium">User Identity</th>
                    <th className="py-3 font-medium">Contact Phone</th>
                    <th className="py-3 font-medium">Assigned Roles</th>
                    <th className="py-3 font-medium">Account Status</th>
                    <th className="py-3 font-medium">Registration Date</th>
                    <th className="py-3 pr-4 font-medium text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {users.map((u) => {
                    const isSelf = u._id === currentUserId;
                    return (
                      <tr key={u._id} className="hover:bg-muted/40 transition-colors">
                        {/* User Identity */}
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isSelf && (
                                  <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20 py-0 px-1">
                                    YOU
                                  </Badge>
                                )}
                              </div>
                              <div className="text-muted-foreground text-[11px] font-mono flex items-center gap-1">
                                <Mail className="size-3" />
                                <span>{u.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-3 font-mono text-muted-foreground">
                          {u.phone ? (
                            <span className="flex items-center gap-1">
                              <Phone className="size-3 text-muted-foreground" />
                              {u.phone}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/60">—</span>
                          )}
                        </td>

                        {/* Assigned Roles */}
                        <td className="py-3">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(u.role)
                              ? u.role.map((r) => renderRoleBadge(r))
                              : renderRoleBadge(u.role as any)}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3">
                          {u.accountStatus === "ACTIVE" ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold">
                              <span className="size-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
                              ACTIVE
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[10px] font-semibold">
                              <span className="size-1.5 rounded-full bg-rose-500 mr-1.5 inline-block" />
                              SUSPENDED
                            </Badge>
                          )}
                        </td>

                        {/* Created At */}
                        <td className="py-3 font-mono text-muted-foreground text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                        </td>

                        {/* Actions */}
                        <td className="py-3 pr-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary"
                              onClick={() => handleInspect(u)}
                              title="Inspect Profile"
                            >
                              <Eye className="size-3.5 mr-1" />
                              <span>Inspect</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs hover:bg-purple-500/10 hover:text-purple-600"
                              onClick={() => handleOpenRolesModal(u)}
                              title="Manage Roles"
                            >
                              <Shield className="size-3.5 mr-1" />
                              <span>Roles</span>
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-7 px-2 text-xs ${
                                u.accountStatus === "ACTIVE"
                                  ? "hover:bg-rose-500/10 hover:text-rose-600"
                                  : "hover:bg-emerald-500/10 hover:text-emerald-600"
                              }`}
                              disabled={isSelf}
                              onClick={() => handleOpenStatusModal(u)}
                              title={
                                isSelf
                                  ? "Cannot suspend self"
                                  : u.accountStatus === "ACTIVE"
                                  ? "Suspend User"
                                  : "Activate User"
                              }
                            >
                              {u.accountStatus === "ACTIVE" ? (
                                <>
                                  <UserX className="size-3.5 mr-1 text-rose-500" />
                                  <span className="text-rose-500">Suspend</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="size-3.5 mr-1 text-emerald-500" />
                                  <span className="text-emerald-500">Activate</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-border/30 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages} ({totalUsers} total entries)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 text-xs flex items-center gap-1"
            >
              <ChevronLeft className="size-3.5" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="h-8 text-xs flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal 1: Inspect User Details */}
      <Dialog open={Boolean(detailUser) || isDetailLoading} onOpenChange={() => setDetailUser(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Eye className="size-4 text-primary" />
              <span>Platform Identity & Profile Inspection</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Complete entity data, associated society records, and gig profile telemetry.
            </DialogDescription>
          </DialogHeader>

          {isDetailLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="size-6 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground">Loading identity dossier...</p>
            </div>
          ) : detailUser ? (
            <div className="space-y-4 pt-2 text-xs">
              {/* Core User Identity */}
              <div className="p-3 bg-secondary/50 rounded-xl border border-border/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-foreground">{detailUser.user.name}</div>
                  <div className="flex gap-1">
                    {detailUser.user.role.map((r) => renderRoleBadge(r))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <span className="text-foreground font-medium">Email: </span>
                    {detailUser.user.email}
                  </div>
                  <div>
                    <span className="text-foreground font-medium">Phone: </span>
                    {detailUser.user.phone || "Not provided"}
                  </div>
                  <div>
                    <span className="text-foreground font-medium">Account Status: </span>
                    <span className="font-semibold text-foreground">{detailUser.user.accountStatus}</span>
                  </div>
                  <div>
                    <span className="text-foreground font-medium">Registered: </span>
                    {new Date(detailUser.user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Linked Worker Profile if exists */}
              {detailUser.workerProfile && (
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between font-semibold text-emerald-700 dark:text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="size-3.5" /> Gig Worker Profile
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/15 text-emerald-600 border-emerald-500/30">
                      {detailUser.workerProfile.verificationStatus || "VERIFIED"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                    <div>
                      <span className="text-foreground font-medium">Trade Category: </span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                        {typeof detailUser.workerProfile.category === "object" && detailUser.workerProfile.category?.name
                          ? detailUser.workerProfile.category.name
                          : detailUser.workerProfile.category || "General Trade"}
                      </span>
                    </div>
                    <div>
                      <span className="text-foreground font-medium">Rating: </span>
                      ⭐ {detailUser.workerProfile.rating || "5.0"}
                    </div>
                    <div className="col-span-2">
                      <span className="text-foreground font-medium">Active Services: </span>
                      {Array.isArray(detailUser.workerProfile.skills)
                        ? detailUser.workerProfile.skills
                            .map((s: any) => (typeof s === "object" ? s.name : s))
                            .join(", ") || "General Services"
                        : "General Services"}
                    </div>
                  </div>
                </div>
              )}

              {/* Linked Cooperative Profile if exists */}
              {detailUser.cooperativeProfile && (
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 space-y-2">
                  <div className="flex items-center justify-between font-semibold text-amber-700 dark:text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="size-3.5" /> Cooperative Society Entity
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-amber-500/15 text-amber-600 border-amber-500/30">
                      {detailUser.cooperativeProfile.verificationStatus || "APPROVED"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <div>
                      <span className="text-foreground font-medium">Society Name: </span>
                      {detailUser.cooperativeProfile.name}
                    </div>
                    <div>
                      <span className="text-foreground font-medium">Registration No: </span>
                      <span className="font-mono">{detailUser.cooperativeProfile.registrationNumber || "REG-9281-COOP"}</span>
                    </div>
                    <div>
                      <span className="text-foreground font-medium">Operational Zone: </span>
                      {detailUser.cooperativeProfile.address?.city || "Registered Jurisdiction"}
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Activity */}
              {detailUser.activity && (
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-between">
                  <span className="font-medium text-blue-700 dark:text-blue-300">
                    Historical Bookings Requested
                  </span>
                  <span className="font-mono font-bold text-foreground text-sm">
                    {detailUser.activity.customerBookingsCount} Bookings
                  </span>
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDetailUser(null)}>
              Close Dossier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 2: Suspend / Activate Account Confirmation */}
      <Dialog open={Boolean(statusTargetUser)} onOpenChange={() => setStatusTargetUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base text-foreground">
              {newStatusValue === "SUSPEND" ? (
                <>
                  <AlertTriangle className="size-4 text-rose-500" />
                  <span>Suspend Account Access</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>Reactivate User Account</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {newStatusValue === "SUSPEND"
                ? `You are about to suspend ${statusTargetUser?.name}. The user will be immediately blocked from logging in, booking, or accepting work.`
                : `You are reactivating ${statusTargetUser?.name}. Their login and operational access will be fully restored.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/40 space-y-1">
              <div className="font-medium text-foreground">{statusTargetUser?.name}</div>
              <div className="text-muted-foreground font-mono">{statusTargetUser?.email}</div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Audit Trail Reason (Required for Compliance)</Label>
              <Textarea
                placeholder={
                  newStatusValue === "SUSPEND"
                    ? "Explain the reason for suspension (e.g., Code of conduct violation, fraudulent claims, disputed billing)..."
                    : "Notes on account restoration (e.g., Dispute resolved, identity verified)..."
                }
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="text-xs min-h-20"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusTargetUser(null)}
              disabled={isSubmittingStatus}
            >
              Cancel
            </Button>
            <Button
              variant={newStatusValue === "SUSPEND" ? "destructive" : "default"}
              size="sm"
              onClick={handleSubmitStatus}
              disabled={isSubmittingStatus}
              className="flex items-center gap-1.5"
            >
              {isSubmittingStatus && <RefreshCw className="size-3.5 animate-spin" />}
              <span>{newStatusValue === "SUSPEND" ? "Confirm Suspension" : "Confirm Reactivation"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal 3: Manage Roles */}
      <Dialog open={Boolean(rolesTargetUser)} onOpenChange={() => setRolesTargetUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Shield className="size-4 text-primary" />
              <span>Modify User Role Permissions</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign or revoke roles for {rolesTargetUser?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-2">
              {ALL_ROLES.map((role) => {
                const checked = selectedRoles.includes(role);
                return (
                  <label
                    key={role}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? "border-primary/50 bg-primary/5"
                        : "border-border/40 hover:bg-secondary/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleRole(role)}
                        className="rounded border-border text-primary focus:ring-primary size-4"
                      />
                      <div>
                        <div className="font-semibold text-foreground text-xs">{role}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {role === "SUPERADMIN" && "Platform-wide administrative governance"}
                          {role === "COOPERATIVE" && "Society operations, worker verification & allocations"}
                          {role === "WORKER" && "Gig service dispatch, job execution & welfare claims"}
                          {role === "CUSTOMER" && "On-demand booking and customer service requests"}
                        </div>
                      </div>
                    </div>
                    {renderRoleBadge(role)}
                  </label>
                );
              })}
            </div>

            {selectedRoles.includes("SUPERADMIN") && (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-[11px] text-amber-700 dark:text-amber-300">
                <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Caution:</strong> The SUPERADMIN role grants unrestricted access to billing rates, platform revenues, and user data.
                </span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRolesTargetUser(null)}
              disabled={isSubmittingRoles}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitRoles}
              disabled={isSubmittingRoles || selectedRoles.length === 0}
              className="flex items-center gap-1.5"
            >
              {isSubmittingRoles && <RefreshCw className="size-3.5 animate-spin" />}
              <span>Save Permissions</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminUsers;
