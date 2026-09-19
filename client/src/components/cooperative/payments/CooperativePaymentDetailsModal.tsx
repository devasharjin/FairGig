import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  Check,
  User,
  Wrench,
  Receipt,
  CreditCard,
  Calendar,
  Wallet,
} from "lucide-react";
import type { CooperativePaymentItem } from "@/features/cooperative/payments/types";

interface CooperativePaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: CooperativePaymentItem | null;
}

export const CooperativePaymentDetailsModal: React.FC<
  CooperativePaymentDetailsModalProps
> = ({ isOpen, onClose, payment }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!payment) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1.5 font-semibold text-xs px-2.5 py-0.5">
            <CheckCircle2 className="size-3.5" />
            Settled to Worker
          </Badge>
        );
      case "CREATED":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1.5 font-semibold text-xs px-2.5 py-0.5">
            <Clock className="size-3.5" />
            Awaiting Customer Payment
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1.5 font-semibold text-xs px-2.5 py-0.5">
            <XCircle className="size-3.5" />
            Payment Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Receipt className="size-5 text-primary" />
              Member Service Payout Receipt
            </DialogTitle>
            {getStatusBadge(payment.status)}
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Cooperative settlement details and member earnings breakdown.
          </DialogDescription>
        </DialogHeader>

        {/* Payout & Turnover Banner */}
        <div className="rounded-xl bg-muted/60 border p-4 text-center my-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Gross Gig Amount
          </p>
          <div className="text-3xl font-extrabold text-foreground mt-1">
            ₹{payment.amount.toLocaleString("en-IN")}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mt-2 border border-emerald-500/20">
            <Wallet className="size-3.5" />
            Worker Member Earnings: ₹{payment.amount.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {/* Member & Customer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg border bg-card p-3 space-y-1">
              <span className="font-semibold text-muted-foreground flex items-center gap-1">
                <Wrench className="size-3 text-emerald-500" /> Member Worker
              </span>
              <p className="font-semibold text-foreground text-sm">
                {payment.worker?.userId?.name || "Assigned Member"}
              </p>
              {payment.worker?.userId?.phone && (
                <p className="text-muted-foreground text-[11px]">
                  Phone: {payment.worker?.userId?.phone}
                </p>
              )}
              {payment.worker?.userId?.email && (
                <p className="text-muted-foreground text-[11px] truncate">
                  {payment.worker?.userId?.email}
                </p>
              )}
            </div>

            <div className="rounded-lg border bg-card p-3 space-y-1">
              <span className="font-semibold text-muted-foreground flex items-center gap-1">
                <User className="size-3 text-blue-500" /> Customer
              </span>
              <p className="font-semibold text-foreground text-sm">
                {payment.customer?.name || "Customer"}
              </p>
              {payment.customer?.phone && (
                <p className="text-muted-foreground text-[11px]">
                  Phone: {payment.customer?.phone}
                </p>
              )}
              {payment.customer?.email && (
                <p className="text-muted-foreground text-[11px] truncate">
                  {payment.customer?.email}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Service Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="size-3.5" /> Service Record
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs rounded-lg border bg-card p-3">
              <div>
                <span className="text-muted-foreground block">Booking Code</span>
                <span className="font-semibold text-foreground">
                  {payment.booking?.bookingNumber || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Service</span>
                <span className="font-semibold text-foreground">
                  {payment.booking?.service?.name || "Standard Gig"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Category</span>
                <span className="text-foreground">
                  {payment.booking?.category?.name || "General"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Pricing Mode</span>
                <span className="capitalize text-foreground">
                  {payment.booking?.priceType || "Standard"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Gateway Identification */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="size-3.5" /> Razorpay Transaction Info
            </h4>
            <div className="rounded-lg border bg-card p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Order ID:</span>
                <div className="flex items-center gap-1 font-mono">
                  <span>{payment.razorpayOrderId}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 text-muted-foreground hover:text-foreground"
                    onClick={() => handleCopy(payment.razorpayOrderId, "orderId")}
                  >
                    {copiedKey === "orderId" ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </div>
              </div>

              {payment.razorpayPaymentId && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <div className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>{payment.razorpayPaymentId}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-5 text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        handleCopy(payment.razorpayPaymentId!, "paymentId")
                      }
                    >
                      {copiedKey === "paymentId" ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timestamp */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Settlement Date:
            </span>
            <span className="font-medium text-foreground">
              {new Date(payment.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
