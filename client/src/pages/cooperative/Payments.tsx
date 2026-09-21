import React, { useState } from "react";
import {
  Wallet,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Users,
  Coins,
  ChevronLeft,
  ChevronRight,
  Eye,
  Receipt,
  Wrench,
  Building2,
} from "lucide-react";
import {
  useCooperativePayments,
  useCooperativePaymentStats,
} from "@/features/cooperative/payments";
import type { CooperativePaymentItem } from "@/features/cooperative/payments/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CooperativePaymentDetailsModal } from "@/components/cooperative/payments/CooperativePaymentDetailsModal";

export default function CooperativePayments() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] =
    useState<CooperativePaymentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Queries
  const {
    data: paymentsData,
    isLoading: isLoadingPayments,
    isFetching: isFetchingPayments,
    refetch: refetchPayments,
  } = useCooperativePayments({
    status: statusFilter,
    search: searchQuery.trim() || undefined,
    page: currentPage,
    limit: 15,
  });

  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useCooperativePaymentStats();

  const handleRefresh = () => {
    refetchPayments();
    refetchStats();
  };

  const handleOpenReceipt = (payment: CooperativePaymentItem) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const payments = paymentsData?.payments || [];
  const totalItems = paymentsData?.total || 0;
  const totalPages = paymentsData?.totalPages || 1;
  const societyName = stats?.societyName || paymentsData?.cooperative?.name || "Cooperative Society";

  const statCards = [
    {
      title: "Gross Turnover",
      value: stats ? `₹${stats.totalGrossRevenue.toLocaleString("en-IN")}` : "₹0",
      subtitle: `${stats?.paidCount || 0} completed orders`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Worker Member Payouts",
      value: stats ? `₹${stats.totalWorkerPayouts.toLocaleString("en-IN")}` : "₹0",
      subtitle: `${stats?.activeWorkersWithPayouts || 0} earning members`,
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Pending Invoices",
      value: stats ? `₹${stats.pendingAmount.toLocaleString("en-IN")}` : "₹0",
      subtitle: `${stats?.pendingCount || 0} awaiting payment`,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Today's Turnover",
      value: stats ? `₹${stats.todayRevenue.toLocaleString("en-IN")}` : "₹0",
      subtitle: `${stats?.todayCount || 0} bookings today`,
      icon: Coins,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  const filterTabs = [
    { key: "ALL", label: "All Records" },
    { key: "PAID", label: "Settled / Paid" },
    { key: "PENDING", label: "Pending Payment" },
    { key: "FAILED", label: "Failed" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-md">
            <CheckCircle2 className="size-3" />
            Settled
          </Badge>
        );
      case "CREATED":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-md">
            <Clock className="size-3" />
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1 font-semibold text-[11px] px-2 py-0.5 rounded-md">
            <XCircle className="size-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline" className="rounded-md text-[11px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge
              variant="secondary"
              className="rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider bg-accent/10 text-accent border-accent/20"
            >
              <Wallet className="size-3.5 mr-1" />
              Society Financials
            </Badge>
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <Building2 className="size-3 text-accent" /> {societyName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Payments & Member Payouts
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Track customer payments received for cooperative bookings and member earnings distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetchingPayments || isLoadingStats}
            className="rounded-lg gap-2 font-medium h-9 text-xs shadow-xs"
          >
            <RotateCcw
              className={`size-3.5 ${isFetchingPayments ? "animate-spin text-accent" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`border ${stat.border} bg-card shadow-xs rounded-xl overflow-hidden`}
            >
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {stat.subtitle}
                  </p>
                </div>
                <div
                  className={`size-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
                >
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/80 shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search booking #, worker, customer..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-8 h-9 text-xs rounded-lg bg-background"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Transactions & Payouts Table */}
      <Card className="rounded-xl border border-border/80 shadow-xs overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Booking / Service</th>
                <th className="py-3 px-4">Member Worker</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Worker Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoadingPayments ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td colSpan={8} className="py-4 px-4">
                      <div className="h-5 bg-muted rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground">
                    <Receipt className="size-10 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="font-semibold text-foreground">No payments recorded yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Transactions will appear here when customers complete payments for bookings.
                    </p>
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-muted/30 transition-colors group text-xs"
                  >
                    {/* Booking / Service */}
                    <td className="py-3.5 px-4 font-medium">
                      <div className="font-semibold text-foreground">
                        {p.booking?.bookingNumber || "N/A"}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                        {p.booking?.service?.name || "Standard Gig"}
                      </div>
                    </td>

                    {/* Member Worker */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <Wrench className="size-3 text-emerald-500 shrink-0" />
                        <span className="truncate max-w-[140px]">
                          {p.worker?.userId?.name || "Unassigned"}
                        </span>
                      </div>
                      {p.worker?.userId?.phone && (
                        <div className="text-[11px] text-muted-foreground">
                          {p.worker?.userId?.phone}
                        </div>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">
                        {p.customer?.name || "Customer"}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[130px]">
                        {p.customer?.email}
                      </div>
                    </td>

                    {/* Gross Amount */}
                    <td className="py-3.5 px-4 font-bold text-sm text-foreground">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>

                    {/* Worker Payout */}
                    <td className="py-3.5 px-4 font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(p.status)}</td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    {/* Receipt Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg text-xs gap-1.5 font-medium hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleOpenReceipt(p)}
                      >
                        <Eye className="size-3.5" />
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t bg-card text-xs text-muted-foreground">
            <div>
              Showing page <strong className="text-foreground">{currentPage}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong> ({totalItems} records)
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-lg"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-lg"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detailed Receipt Modal */}
      <CooperativePaymentDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />
    </div>
  );
}
