import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Eye,
  HeartHandshake,
  UserCheck,
  ShieldCheck,
  Wrench,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCooperativeMembers,
  toggleMemberStatus,
} from "@/features/cooperative/members/api";
import type {
  CooperativeMember,
  MemberRosterStats,
} from "@/features/cooperative/members/types";
import { MemberDossierModal } from "@/components/cooperative/members/MemberDossierModal";
import { EmergencyGrantDialog } from "@/components/cooperative/welfare/EmergencyGrantDialog";
import { getCooperativeWorkerWelfareList } from "@/features/welfare/api";
import type { CooperativeWorkerWelfareItem } from "@/features/welfare/types";

export default function CooperativeMembers() {
  const navigate = useNavigate();

  // State
  const [members, setMembers] = useState<CooperativeMember[]>([]);
  const [stats, setStats] = useState<MemberRosterStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [togglingWorkerId, setTogglingWorkerId] = useState<string | null>(null);

  // Modals state
  const [selectedMember, setSelectedMember] = useState<CooperativeMember | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isGrantOpen, setIsGrantOpen] = useState(false);
  const [grantWorkerId, setGrantWorkerId] = useState<string | undefined>();
  const [welfareWorkers, setWelfareWorkers] = useState<CooperativeWorkerWelfareItem[]>([]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const res = await getCooperativeMembers({
        search: searchQuery.trim() || undefined,
        status: statusFilter,
        availability: availabilityFilter,
        page: currentPage,
        limit: 15,
      });
      setMembers(res.members || []);
      setStats(res.stats);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err: any) {
      toast.error(err.message || "Failed to load cooperative members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [statusFilter, availabilityFilter, currentPage]);

  // Load welfare worker list in background for emergency grant dialog
  useEffect(() => {
    getCooperativeWorkerWelfareList()
      .then((res) => setWelfareWorkers(res.workers || []))
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchMembers();
  };

  const handleToggleActive = async (member: CooperativeMember) => {
    setTogglingWorkerId(member._id);
    const newStatus = !member.isActive;
    try {
      await toggleMemberStatus(member._id, { isActive: newStatus });
      setMembers((prev) =>
        prev.map((m) => (m._id === member._id ? { ...m, isActive: newStatus } : m))
      );
      toast.success(
        `${member.userId?.name} is now ${newStatus ? "Active for gig dispatch" : "Marked Inactive"}`
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update member status");
    } finally {
      setTogglingWorkerId(null);
    }
  };

  const handleOpenGrantModal = (workerId: string) => {
    setGrantWorkerId(workerId);
    setIsGrantOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20"
            >
              <Users className="size-3.5 mr-1" />
              Society Workforce
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Members Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage, mobilize, and safeguard your cooperative's skilled gig workforce roster.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMembers}
            className="rounded-lg gap-1.5 text-xs h-9 shadow-xs"
          >
            <RefreshCw className="size-3.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => navigate("/cooperative/verifications")}
            className="rounded-lg gap-1.5 text-xs h-9 shadow-xs"
          >
            <UserCheck className="size-3.5" />
            Applicant Queue
          </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs text-center">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Enrolled Members
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
              {stats.totalMembers}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs text-center">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Active On-Duty
            </p>
            <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.activeOnDuty}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs text-center">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Pending Verification
            </p>
            <p className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400 mt-1">
              {stats.pendingVerificationCount}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs text-center">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Average Rating
            </p>
            <div className="flex items-center justify-center gap-1 mt-1 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              <Star className="size-5 fill-amber-500 text-amber-500" />
              <span>{stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "5.0"}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border/80 shadow-xs text-center col-span-2 sm:col-span-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Jobs Delivered
            </p>
            <p className="text-2xl font-bold tracking-tight text-primary mt-1">
              {stats.totalJobsCompleted}
            </p>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <Card className="rounded-xl border-border/80 shadow-xs">
        <CardContent className="p-3.5">
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-col md:flex-row items-center gap-3"
          >
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search member by worker name, email, or mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9 rounded-lg"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val || "ALL");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-44 text-xs h-9 rounded-lg">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Status: All</SelectItem>
                <SelectItem value="ACTIVE">Active On-Duty</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="Approved">Approved Verified</SelectItem>
                <SelectItem value="Pending">Pending Approval</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            {/* Availability Filter */}
            <Select
              value={availabilityFilter}
              onValueChange={(val) => {
                setAvailabilityFilter(val || "ALL");
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-40 text-xs h-9 rounded-lg">
                <SelectValue placeholder="Availability: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Availability: All</SelectItem>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
                <SelectItem value="Part-Time">Part-Time</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" size="sm" className="w-full md:w-auto h-9 rounded-lg text-xs px-5 shadow-xs">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Members Roster Table */}
      <Card className="rounded-xl border-border/80 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-accent" />
              <span>Loading cooperative member roster...</span>
            </div>
          ) : members.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2">
              <Users className="size-8 mx-auto opacity-40 text-accent" />
              <p className="font-semibold text-foreground">No member workers found</p>
              <p>Try adjusting your search criteria or review pending applicant verifications.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Worker Details</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Trade Category & Services</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Availability & Status</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Performance</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[11px]">Dispatch Active</th>
                    <th className="py-3 px-4 text-right font-semibold uppercase tracking-wider text-[11px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {members.map((member) => (
                    <tr
                      key={member._id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      {/* Worker Details */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                            {member.userId?.profilePicture ? (
                              <img
                                src={member.userId.profilePicture}
                                alt={member.userId.name}
                                className="size-full object-cover rounded-xl"
                              />
                            ) : (
                              member.userId?.name?.charAt(0) || "W"
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">
                              {member.userId?.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                              <span>{member.userId?.phone}</span>
                              <span>•</span>
                              <span>{member.location?.city || "Tamil Nadu"}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Trade Category & Services */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1 max-w-xs">
                          {member.category ? (
                            <Badge
                              variant="default"
                              className="w-fit text-[11px] px-2.5 py-0.5 rounded-lg font-semibold bg-primary/15 text-primary border border-primary/25"
                            >
                              {typeof member.category === "object" && member.category !== null
                                ? (member.category as any).name
                                : String(member.category || "")}
                            </Badge>
                          ) : null}
                          {member.skills && member.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {member.skills.slice(0, 2).map((s) => (
                                <Badge
                                  key={s._id}
                                  variant="secondary"
                                  className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                                >
                                  {s.name}
                                </Badge>
                              ))}
                              {member.skills.length > 2 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{member.skills.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                          {!member.category && (!member.skills || member.skills.length === 0) && (
                            <span className="text-muted-foreground text-[11px]">General Trades</span>
                          )}
                        </div>
                      </td>

                      {/* Availability & Verification */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={
                              member.verificationStatus === "Approved"
                                ? "default"
                                : member.verificationStatus === "Pending"
                                ? "secondary"
                                : "destructive"
                            }
                            className="w-fit text-[10px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {member.verificationStatus}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">
                            {member.availability} • {member.experience} yrs exp
                          </span>
                        </div>
                      </td>

                      {/* Performance */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1 font-bold text-foreground">
                            <Star className="size-3.5 fill-amber-500 text-amber-500" />
                            <span>{member.rating > 0 ? member.rating.toFixed(1) : "New"}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {member.totalJobsCompleted || 0} gigs delivered
                          </span>
                        </div>
                      </td>

                      {/* Dispatch Active Toggle Switch */}
                      <td className="py-4 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(member)}
                          disabled={togglingWorkerId === member._id}
                          className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            member.isActive ? "bg-emerald-500" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              member.isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsDossierOpen(true);
                            }}
                            className="h-8 px-2.5 rounded-lg text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <Eye className="size-3.5" /> Dossier
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenGrantModal(member._id)}
                            className="h-8 px-2.5 rounded-lg text-xs gap-1 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                            title="Issue emergency welfare grant"
                          >
                            <HeartHandshake className="size-3.5" /> Grant
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border/60 text-xs">
              <span className="text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg h-8 px-2.5 text-xs"
                >
                  <ChevronLeft className="size-3.5 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg h-8 px-2.5 text-xs"
                >
                  Next <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Dossier Modal */}
      <MemberDossierModal
        member={selectedMember}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onIssueEmergencyGrant={(workerId) => handleOpenGrantModal(workerId)}
      />

      {/* Emergency Relief Grant Modal */}
      <EmergencyGrantDialog
        workers={welfareWorkers}
        preselectedWorkerId={grantWorkerId}
        isOpen={isGrantOpen}
        onClose={() => setIsGrantOpen(false)}
        onSuccess={() => {
          toast.success("Emergency grant dispatched!");
          fetchMembers();
        }}
        availableReserve={150000}
      />
    </div>
  );
}
