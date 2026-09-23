import React from "react";
import { useTranslation } from "react-i18next";
import { Phone, Mail, Star, ShieldCheck, Radio, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  BookingWorkerInfo,
  BookingStatus,
} from "@/features/customer/bookings/types";

export interface BookingWorkerCardProps {
  worker?: BookingWorkerInfo;
  status: BookingStatus;
  className?: string;
}

export const BookingWorkerCard: React.FC<BookingWorkerCardProps> = ({
  worker,
  status,
  className,
}) => {
  const { t } = useTranslation();
  const isCancelled = status === "CANCELLED" || status === "REJECTED";

  if (!worker) {
    return (
      <div
        className={cn(
          "rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6 shadow-xs space-y-4",
          className
        )}
      >
        <div className="flex items-start gap-4">
          <div className="relative size-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            {!isCancelled ? (
              <>
                <Radio className="size-6 animate-pulse" />
                <span className="absolute -top-1 -right-1 size-3 rounded-full bg-amber-500 animate-ping" />
              </>
            ) : (
              <Radio className="size-6 opacity-50" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                {isCancelled
                  ? t("bookingDetails.workerCard.dispatchTerminated")
                  : t("bookingDetails.workerCard.broadcasting")}
              </h3>
              {!isCancelled && (
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px]"
                >
                  {t("bookingDetails.workerCard.searchingNearby")}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isCancelled
                ? t("bookingDetails.workerCard.cancelledDesc")
                : t("bookingDetails.workerCard.broadcastingDesc")}
            </p>
          </div>
        </div>

        {!isCancelled && (
          <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>{t("bookingDetails.workerCard.screened")}</span>
            </div>
            <span>{t("bookingDetails.workerCard.estAcceptance")}</span>
          </div>
        )}
      </div>
    );
  }

  const workerUser = worker.userId;
  const initial = workerUser?.name?.charAt(0).toUpperCase() || "W";

  return (
    <div
      className={cn(
        "rounded-3xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="size-4 text-primary" />
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            {t("bookingDetails.workerCard.assignedTitle")}
          </h3>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold"
        >
          {t("bookingDetails.workerCard.verifiedPartner")}
        </Badge>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60">
        <div className="flex items-center gap-3.5">
          {workerUser?.profilePicture ? (
            <img
              src={workerUser.profilePicture}
              alt={workerUser.name}
              className="size-14 rounded-2xl object-cover ring-2 ring-primary/20 shrink-0"
            />
          ) : (
            <div className="size-14 rounded-2xl bg-primary/15 text-primary text-xl font-extrabold flex items-center justify-center shrink-0 shadow-xs">
              {initial}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-base font-bold text-foreground">
                {workerUser?.name || t("bookingDetails.workerCard.assignedWorker")}
              </h4>
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                <Star className="size-3 fill-amber-500" />
                {worker.rating > 0 ? worker.rating.toFixed(1) : t("bookingDetails.workerCard.newRating")}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              {t("bookingDetails.workerCard.certifiedTrade")} • {worker.totalJobsCompleted === 1
                ? t("bookingDetails.workerCard.fulfilled_one", { count: worker.totalJobsCompleted })
                : t("bookingDetails.workerCard.fulfilled_other", { count: worker.totalJobsCompleted })}
            </p>
          </div>
        </div>

        {/* Contact actions */}
        <div className="flex items-center gap-2 sm:self-center shrink-0">
          {workerUser?.phone && (
            <a
              href={`tel:${workerUser.phone}`}
              className="flex-1 sm:flex-initial"
            >
              <Button
                size="sm"
                className="w-full sm:w-auto rounded-xl h-9 px-3.5 gap-2 text-xs font-semibold cursor-pointer shadow-xs bg-primary text-primary-foreground"
              >
                <Phone className="size-3.5" />
                <span>{t("bookingDetails.workerCard.call")} ({workerUser.phone})</span>
              </Button>
            </a>
          )}

          {workerUser?.email && (
            <a
              href={`mailto:${workerUser.email}`}
              title={`Email: ${workerUser.email}`}
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl size-9 p-0 cursor-pointer"
              >
                <Mail className="size-3.5 text-muted-foreground" />
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-3 rounded-2xl border border-primary/10">
        <ShieldCheck className="size-4 text-primary shrink-0" />
        <span>
          {t("bookingDetails.workerCard.insuranceNotice")}
        </span>
      </div>
    </div>
  );
};

export default BookingWorkerCard;
