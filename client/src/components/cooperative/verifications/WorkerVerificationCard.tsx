import React from "react";
import {
  Clock,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  Eye,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CooperativeWorker } from "@/features/cooperative/verifications/types";

interface WorkerVerificationCardProps {
  worker: CooperativeWorker;
  onReview: (worker: CooperativeWorker) => void;
  onQuickApprove: (id: string) => void;
  onQuickReject: (worker: CooperativeWorker) => void;
}

export const WorkerVerificationCard: React.FC<WorkerVerificationCardProps> = ({
  worker,
  onReview,
  onQuickApprove,
  onQuickReject,
}) => {
  const user = worker.userId;
  const isPending = worker.verificationStatus === "Pending";
  const isApproved = worker.verificationStatus === "Approved";
  const isRejected = worker.verificationStatus === "Rejected";

  const categoryName =
    typeof worker.category === "object" && (worker.category as any)?.name
      ? (worker.category as any).name
      : typeof worker.category === "string"
      ? worker.category
      : null;

  return (
    <Card className="border border-border/80 bg-card shadow-xs hover:border-border transition-all rounded-xl overflow-hidden">
      <CardContent className="p-5 space-y-4">
        {/* Top Row: User Header & Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/20">
              {user?.name?.[0]?.toUpperCase() || "W"}
            </div>
            <div>
              <h4 className="font-bold text-foreground text-sm sm:text-base leading-tight">
                {user?.name || "Worker Applicant"}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span>Applied {new Date(worker.createdAt).toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          <Badge
            variant={
              isApproved
                ? "default"
                : isRejected
                ? "destructive"
                : "secondary"
            }
            className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase border ${
              isApproved
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : isPending
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
            }`}
          >
            {worker.verificationStatus}
          </Badge>
        </div>

        {/* Contact Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/60">
          <div className="flex items-center gap-2 text-foreground font-medium truncate">
            <Phone className="size-3.5 text-accent shrink-0" />
            <span className="truncate">{user?.phone || "No phone"}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium truncate">
            <Mail className="size-3.5 text-accent shrink-0" />
            <span className="truncate">{user?.email || "No email"}</span>
          </div>
        </div>

        {/* Trade Category & Skills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Trade Category & Services
            </p>
            {categoryName && (
              <Badge variant="default" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold rounded-md">
                {categoryName}
              </Badge>
            )}
          </div>
          {worker.skills && worker.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {worker.skills.map((skill) => (
                <span
                  key={skill._id}
                  className="px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/60"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Details Row (Experience, Availability, Location) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-border/50 text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Briefcase className="size-3.5 text-muted-foreground shrink-0" />
            <span>
              Exp: <strong className="text-foreground">{worker.experience} yrs</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-muted-foreground shrink-0" />
            <span>
              Type: <strong className="text-foreground">{worker.availability}</strong>
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 truncate">
            <MapPin className="size-3.5 text-muted-foreground shrink-0" />
            <span className="truncate">
              {worker.location?.city || "Location"}, {worker.location?.state || ""}
            </span>
          </div>
        </div>

        {/* Documents summary tags */}
        <div className="flex items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] text-muted-foreground font-medium">
            Documents:
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/40 text-[11px] text-foreground font-medium border border-border/60">
            <FileText className="size-3 text-accent" /> ID Proof
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/40 text-[11px] text-foreground font-medium border border-border/60">
            <ShieldCheck className="size-3 text-accent" /> Trade Cert
          </span>
        </div>

        {/* Rejection Note banner if rejected */}
        {isRejected && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-1.5">
            <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
            <span className="truncate">
              Reason: {worker.verificationDocuments?.identity?.rejectionReason || "Requirements not met"}
            </span>
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onReview(worker)}
            className="rounded-lg text-xs h-8 gap-1.5 border-border/80 cursor-pointer shadow-xs"
          >
            <Eye className="size-3.5" />
            Review Documents
          </Button>

          {isPending && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onQuickReject(worker)}
                className="rounded-lg text-xs h-8 px-3 gap-1 cursor-pointer shadow-xs"
              >
                <XCircle className="size-3.5" />
                Reject
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => onQuickApprove(worker._id)}
                className="rounded-lg text-xs h-8 px-3.5 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold cursor-pointer"
              >
                <CheckCircle2 className="size-3.5" />
                Approve
              </Button>
            </div>
          )}

          {isApproved && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="size-4" /> Active Member
            </span>
          )}

          {isRejected && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onQuickApprove(worker._id)}
              className="rounded-lg text-xs h-8 gap-1 text-emerald-600 hover:bg-emerald-500/10 border-emerald-500/30 cursor-pointer shadow-xs"
            >
              Re-approve
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
