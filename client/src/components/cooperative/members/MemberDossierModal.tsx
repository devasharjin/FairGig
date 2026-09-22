import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Star,
  CheckCircle2,
  AlertCircle,
  FileText,
  ExternalLink,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Wrench,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMemberDossier } from "@/features/cooperative/members/api";
import type { CooperativeMember } from "@/features/cooperative/members/types";

interface MemberDossierModalProps {
  member: CooperativeMember | null;
  isOpen: boolean;
  onClose: () => void;
  onIssueEmergencyGrant?: (workerId: string) => void;
}

export const MemberDossierModal = ({
  member,
  isOpen,
  onClose,
  onIssueEmergencyGrant,
}: MemberDossierModalProps) => {
  const [dossier, setDossier] = useState<{
    recentGigs: any[];
    welfareClaims: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (member && isOpen) {
      setIsLoading(true);
      getMemberDossier(member._id)
        .then((res) => {
          setDossier({
            recentGigs: res.recentGigs || [],
            welfareClaims: res.welfareClaims || [],
          });
        })
        .catch(() => {
          setDossier(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [member, isOpen]);

  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-card border-border/80 shadow-2xl">
        {/* Header Profile Banner */}
        <div className="bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 border-b border-border/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center font-bold text-2xl text-primary shadow-inner">
                {member.userId?.profilePicture ? (
                  <img
                    src={member.userId.profilePicture}
                    alt={member.userId.name}
                    className="size-full object-cover rounded-2xl"
                  />
                ) : (
                  member.userId?.name?.charAt(0) || "W"
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {member.userId?.name}
                  </h3>
                  <Badge
                    variant={
                      member.verificationStatus === "Approved"
                        ? "default"
                        : member.verificationStatus === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="rounded-full text-xs font-semibold px-2.5"
                  >
                    {member.verificationStatus}
                  </Badge>
                  {member.isActive ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="size-3" /> {member.userId?.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="size-3" /> {member.userId?.phone}
                  </span>
                </p>
              </div>
            </div>

            {onIssueEmergencyGrant && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-rose-500/30 text-rose-500 hover:bg-rose-500/10 rounded-xl"
                onClick={() => {
                  onClose();
                  onIssueEmergencyGrant(member._id);
                }}
              >
                <HeartHandshake className="size-3.5" />
                Emergency Grant
              </Button>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-input/20 border border-border/60 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                Rating
              </p>
              <div className="flex items-center justify-center gap-1 mt-1 text-base font-bold text-amber-500">
                <Star className="size-4 fill-amber-500" />
                <span>{member.rating > 0 ? member.rating.toFixed(1) : "New"}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-input/20 border border-border/60 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                Gigs Delivered
              </p>
              <p className="mt-1 text-base font-bold text-foreground">
                {member.totalJobsCompleted || 0}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-input/20 border border-border/60 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                Experience
              </p>
              <p className="mt-1 text-base font-bold text-foreground">
                {member.experience} {member.experience === 1 ? "Year" : "Years"}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-input/20 border border-border/60 text-center">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">
                Availability
              </p>
              <p className="mt-1 text-base font-bold text-primary">
                {member.availability}
              </p>
            </div>
          </div>

          {/* Location & Skills */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench className="size-3.5 text-primary" /> Trade Category & Services
              </h4>

              {member.category && (
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Primary Trade:</span>
                  <Badge className="px-3 py-1 text-xs rounded-lg font-semibold bg-primary text-primary-foreground shadow-xs">
                    {typeof member.category === "object" && member.category !== null
                      ? (member.category as any).name
                      : String(member.category || "")}
                  </Badge>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {member.skills && member.skills.length > 0 ? (
                  member.skills.map((skill) => (
                    <Badge
                      key={skill._id}
                      variant="secondary"
                      className="px-3 py-1 text-xs rounded-lg font-medium bg-muted/70 text-muted-foreground border border-border/60"
                    >
                      {skill.name}
                      {skill.hourlyPrice && (
                        <span className="ml-1.5 opacity-70">
                          (₹{skill.hourlyPrice}/hr)
                        </span>
                      )}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No specific trade tagged</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" /> Operational Base
              </h4>
              <p className="text-xs text-foreground bg-input/20 p-3 rounded-xl border border-border/60">
                {member.location?.address}, {member.location?.city},{" "}
                {member.location?.state} - {member.location?.pincode}
              </p>
            </div>
          </div>

          {/* Verification Documents */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" /> Verified Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-input/20 border border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-primary" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Identity Proof</p>
                    <p className="text-[10px] text-muted-foreground">
                      Status: {member.verificationDocuments?.identity?.status || "Pending"}
                    </p>
                  </div>
                </div>
                {member.verificationDocuments?.identity?.url && (
                  <a
                    href={member.verificationDocuments.identity.url}
                    target="_blank"
                    rel="noreferrer"
                    className="size-8 inline-flex items-center justify-center rounded-lg text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>

              <div className="p-3 rounded-xl bg-input/20 border border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-primary" />
                  <div>
                    <p className="text-xs font-medium text-foreground">Skill Certificate</p>
                    <p className="text-[10px] text-muted-foreground">
                      Status: {member.verificationDocuments?.certificate?.status || "Pending"}
                    </p>
                  </div>
                </div>
                {member.verificationDocuments?.certificate?.url && (
                  <a
                    href={member.verificationDocuments.certificate.url}
                    target="_blank"
                    rel="noreferrer"
                    className="size-8 inline-flex items-center justify-center rounded-lg text-primary hover:bg-muted transition-colors cursor-pointer"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Recent Bookings Feed */}
          {dossier?.recentGigs && dossier.recentGigs.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" /> Recent Completed Gigs
              </h4>
              <div className="space-y-2">
                {dossier.recentGigs.slice(0, 4).map((gig: any) => (
                  <div
                    key={gig._id}
                    className="p-3 rounded-xl bg-input/20 border border-border/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-foreground">
                        {gig.service?.name || "Household Service"}
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Customer: {gig.customer?.name || "Resident"} • ₹{gig.totalAmount || 0}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] rounded-md font-medium">
                      {gig.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
