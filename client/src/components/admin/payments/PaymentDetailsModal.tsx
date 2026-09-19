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
  Building2,
  User,
  Wrench,
  Receipt,
  CreditCard,
  Calendar,
} from "lucide-react";
import type { AdminPaymentItem } from "@/features/admin/payments/types";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: AdminPaymentItem | null;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  isOpen,
  onClose,
  payment,
}) => {
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
            Paid & Settled
          </Badge>
        );
      case "CREATED":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1.5 font-semibold text-xs px-2.5 py-0.5">
            <Clock className="size-3.5" />
            Payment Pending
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
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Receipt className="size-5 text-primary" />
              Transaction Audit Details
            </DialogTitle>
            {getStatusBadge(payment.status)}
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Complete transaction logs and verification record for this booking payment.
          </DialogDescription>
        </DialogHeader>

        {/* Amount Banner */}
        <div className="rounded-xl bg-muted/60 border p-4 text-center my-2">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Total Transaction Amount
          </p>
          <div className="text-3xl font-extrabold text-foreground mt-1">
            ₹{payment.amount.toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Currency: {payment.currency || "INR"}
          </p>
        </div>

        <div className="space-y-4 text-sm">
          {/* Gateway Identification */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="size-3.5" /> Razorpay Gateway Identifiers
            </h4>
            <div className="grid grid-cols-1 gap-2 rounded-lg border bg-card p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Order ID:</span>
                <div className="flex items-center gap-1.5 font-mono font-medium">
                  <span>{payment.razorpayOrderId}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-foreground"
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
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Payment ID:</span>
                  <div className="flex items-center gap-1.5 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    <span>{payment.razorpayPaymentId}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-foreground"
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

              {payment.receipt && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Receipt Ref:</span>
                  <span className="font-mono text-muted-foreground">
                    {payment.receipt}
                  </span>
                </div>
              )}

              {payment.errorDescription && (
                <div className="rounded bg-rose-500/10 border border-rose-500/20 p-2 text-xs text-rose-600 dark:text-rose-400">
                  <strong>Error:</strong> {payment.errorDescription}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Booking & Service */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="size-3.5" /> Booking & Service Information
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs rounded-lg border bg-card p-3">
              <div>
                <span className="text-muted-foreground block">Booking Number</span>
                <span className="font-semibold text-foreground">
                  {payment.booking?.bookingNumber || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Service Name</span>
                <span className="font-semibold text-foreground">
                  {payment.booking?.service?.name || "Standard Gig Service"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Category</span>
                <span className="text-foreground">
                  {payment.booking?.category?.name || "General"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Price Type</span>
                <span className="capitalize text-foreground">
                  {payment.booking?.priceType || "Standard"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Entities (Customer, Worker, Cooperative) */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="size-3.5" /> Associated Entities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="font-semibold text-muted-foreground flex items-center gap-1">
                  <User className="size-3 text-blue-500" /> Customer
                </span>
                <p className="font-medium text-foreground">
                  {payment.customer?.name || "Anonymous User"}
                </p>
                <p className="text-muted-foreground text-[11px] truncate">
                  {payment.customer?.email}
                </p>
                {payment.customer?.phone && (
                  <p className="text-muted-foreground text-[11px]">
                    {payment.customer?.phone}
                  </p>
                )}
              </div>

              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="font-semibold text-muted-foreground flex items-center gap-1">
                  <Wrench className="size-3 text-emerald-500" /> Assigned Worker
                </span>
                <p className="font-medium text-foreground">
                  {payment.worker?.userId?.name || "Not assigned"}
                </p>
                {payment.worker?.userId?.phone && (
                  <p className="text-muted-foreground text-[11px]">
                    {payment.worker?.userId?.phone}
                  </p>
                )}
              </div>

              <div className="rounded-lg border bg-card p-3 space-y-1">
                <span className="font-semibold text-muted-foreground flex items-center gap-1">
                  <Building2 className="size-3 text-purple-500" /> Cooperative
                </span>
                <p className="font-medium text-foreground">
                  {payment.cooperative?.cooperativeName || "Direct Platform"}
                </p>
                {payment.cooperative?.cooperativeEmail && (
                  <p className="text-muted-foreground text-[11px] truncate">
                    {payment.cooperative?.cooperativeEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Recorded At:
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
