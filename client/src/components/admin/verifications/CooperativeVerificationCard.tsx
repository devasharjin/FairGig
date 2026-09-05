import React from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Eye,
  FileCheck,
  ImageIcon,
  AlertTriangle,
  User,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AdminCooperative } from "@/features/admin/verifications/types";

interface CooperativeVerificationCardProps {
  cooperative: AdminCooperative;
  onReview: (cooperative: AdminCooperative) => void;
  onQuickApprove: (id: string) => void;
  onQuickReject: (cooperative: AdminCooperative) => void;
}

export const CooperativeVerificationCard: React.FC<CooperativeVerificationCardProps> = ({
  cooperative,
  onReview,
  onQuickApprove,
  onQuickReject,
}) => {
  const applicant = cooperative.userId;
  const isPending = cooperative.verificationStatus === "Pending";
  const isApproved = cooperative.verificationStatus === "Approved";
  const isRejected = cooperative.verificationStatus === "Rejected";

  return (
    <Card className="border border-border/70 bg-card/90 shadow-sm hover:shadow-md transition-all rounded-3xl overflow-hidden backdrop-blur-xs flex flex-col justify-between">
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Top Header: Society Logo, Name & Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {cooperative.cooperativeLogo?.url ? (
              <img
                src={cooperative.cooperativeLogo.url}
                alt={cooperative.cooperativeName}
                className="size-12 sm:size-14 rounded-2xl object-cover border border-border/80 bg-background shadow-xs shrink-0"
              />
            ) : (
              <div className="size-12 sm:size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0 border border-primary/20">
                <Building2 className="size-6" />
              </div>
            )}

            <div className="min-w-0">
              <h4 className="text-base sm:text-lg font-bold text-foreground truncate" title={cooperative.cooperativeName}>
                {cooperative.cooperativeName}
              </h4>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 truncate">
                <Calendar className="size-3 text-muted-foreground shrink-0" />
                <span>Applied {new Date(cooperative.createdAt).toLocaleDateString()}</span>
                {applicant?.name && (
                  <>
                    <span className="opacity-40">•</span>
                    <span className="truncate">by {applicant.name}</span>
                  </>
                )}
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
            className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase shrink-0 border ${
              isApproved
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : isPending
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
            }`}
          >
            {cooperative.verificationStatus}
          </Badge>
        </div>

        {/* Contact Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground bg-muted/20 p-3 rounded-2xl border border-border/50">
          <div className="flex items-center gap-2 text-foreground font-medium truncate">
            <Mail className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{cooperative.cooperativeEmail}</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium truncate">
            <Phone className="size-3.5 text-primary shrink-0" />
            <span className="truncate">{cooperative.cooperativePhone}</span>
          </div>
        </div>

        {/* Headquarters Address */}
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
          <span className="line-clamp-2 text-foreground/90 font-normal">
            {cooperative.cooperativeAddress}
          </span>
        </div>

        {/* Document Badges */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50">
            <ImageIcon className="size-3 text-primary" />
            <span>Logo Uploaded</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50">
            <FileCheck className="size-3 text-primary" />
            <span>Certificate Uploaded</span>
          </div>
        </div>

        {/* Rejection Reason (If Rejected) */}
        {isRejected && cooperative.rejectedReason && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
            <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-[11px] uppercase tracking-wider">
                Rejection Reason:
              </span>
              <p className="mt-0.5">{cooperative.rejectedReason}</p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Action Footer */}
      <div className="p-4 sm:p-5 pt-0 border-t border-border/40 bg-muted/5 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReview(cooperative)}
          className="flex-1 rounded-xl text-xs font-semibold border-border/80 hover:bg-muted/50 cursor-pointer"
        >
          <Eye className="size-3.5 mr-1.5 text-primary" />
          Review Documents
        </Button>

        {isPending && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onQuickReject(cooperative)}
              className="rounded-xl text-xs font-semibold text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
            >
              <XCircle className="size-3.5 mr-1" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => onQuickApprove(cooperative._id)}
              className="rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="size-3.5 mr-1" />
              Approve
            </Button>
          </div>
        )}

        {isRejected && (
          <Button
            size="sm"
            onClick={() => onQuickApprove(cooperative._id)}
            className="rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="size-3.5 mr-1" />
            Re-Approve
          </Button>
        )}

        {isApproved && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onQuickReject(cooperative)}
            className="rounded-xl text-xs font-semibold text-rose-600 border-rose-500/30 hover:bg-rose-500/10 cursor-pointer"
          >
            <XCircle className="size-3.5 mr-1" />
            Revoke
          </Button>
        )}
      </div>
    </Card>
  );
};
