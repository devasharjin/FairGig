import React, { useState } from "react";
import {
  CreditCard,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Building2,
  Coins,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Receipt,
  Eye,
  Calendar,
} from "lucide-react";
import { useAdminPayments, useAdminPaymentStats } from "@/features/admin/payments";
import type { AdminPaymentItem } from "@/features/admin/payments/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentDetailsModal } from "@/components/admin/payments/PaymentDetailsModal";

export default function AdminPayments() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<AdminPaymentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Queries
  const {
    data: paymentsData,
    isLoading: isLoadingPayments,
    isFetching: isFetchingPayments,
    refetch: refetchPayments,
  } = useAdminPayments({
    status: statusFilter,
    search: searchQuery.trim() || undefined,
    page: currentPage,
    limit: 15,
  });

  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useAdminPaymentStats();

  const handleRefresh = () => {
    refetchPayments();
    refetchStats();
  };

  const handleOpenDetails = (payment: AdminPaymentItem) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const payments = paymentsData?.payments || [];
  const totalItems = paymentsData?.total || 0;
  const totalPages = paymentsData?.totalPages || 1;

  const statCards = [
    {
      title: "Total Platform Volume",
      value: stats ? `₹${stats.totalRevenue.toLocaleString("en-IN")}` : "₹0",
      subtitle: `${stats?.paidCount || 0} settled orders`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      title: "Pending Settlements",
      value: stats ? `₹${stats.pendingAmount.toLocaleString("en-IN")}` : "₹0",
      subtitle: `${stats?.pendingCount || 0} orders awaiting capture`,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      title: "Today's Inflow",
      value: stats ? `₹${stats.todayRevenue.toLocaleString("en-IN")}` : "₹0",
      subtitle: `${stats?.todayCount || 0} transactions today`,
      icon: Coins,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Active Societies",
      value: stats?.activeCooperativesCount || 0,
      subtitle: `Avg order ₹${stats?.avgOrderValue?.toLocaleString("en-IN") || 0}`,
      icon: Building2,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  const filterTabs = [
    { key: "ALL", label: "All Transactions" },
    { key: "PAID", label: "Paid & Settled" },
    { key: "PENDING", label: "Pending" },
    { key: "FAILED", label: "Failed" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 gap-1 font-medium text-xs px-2 py-0.5">
            <CheckCircle2 className="size-3" />
            Paid
          </Badge>
        );
      case "CREATED":
        return (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 gap-1 font-medium text-xs px-2 py-0.5">
            <Clock className="size-3" />
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 gap-1 font-medium text-xs px-2 py-0.5">
            <XCircle className="size-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
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
              className="rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20"
            >
              <CreditCard className="size-3.5 mr-1" />
              Platform Financials
            </Badge>
            {isFetchingPayments && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground animate-pulse">
                <RotateCcw className="size-3 animate-spin" /> Updating...
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Payments & Revenue Audit
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Real-time tracking of platform transactions, customer bookings, Razorpay gateway verification, and cooperative settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isFetchingPayments || isLoadingStats}
            className="rounded-xl gap-2 font-medium"
          >
            <RotateCcw className={`size-3.5 ${isFetchingPayments ? "animate-spin" : ""}`} />
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
              className={`border ${stat.border} bg-card/85 shadow-sm rounded-2xl overflow-hidden backdrop-blur-sm`}
            >
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
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
                  className={`size-10 sm:size-11 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}
                >
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card/60 p-3 rounded-2xl border">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? "bg-primary text-primary-foreground shadow-sm"
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
            placeholder="Search order, payment ID, customer..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-8 h-9 text-xs rounded-xl bg-background/80"
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

      {/* Transactions Table */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden bg-card/85">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Booking / Service</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Cooperative & Worker</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Gateway IDs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Audit</th>
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
                    <p className="font-semibold text-foreground">No payment records found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try adjusting your status filter or search keywords.
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

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground">
                        {p.customer?.name || "Anonymous"}
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                        {p.customer?.email}
                      </div>
                    </td>

                    {/* Cooperative & Worker */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-foreground flex items-center gap-1">
                        <Building2 className="size-3 text-purple-500 shrink-0" />
                        <span className="truncate max-w-[130px]">
                          {p.cooperative?.cooperativeName || "Direct"}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate max-w-[130px]">
                        Worker: {p.worker?.userId?.name || "Unassigned"}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 font-bold text-sm text-foreground">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>

                    {/* Gateway IDs */}
                    <td className="py-3.5 px-4 font-mono text-[11px] space-y-0.5">
                      <div className="text-muted-foreground truncate max-w-[130px]" title={p.razorpayOrderId}>
                        O: {p.razorpayOrderId}
                      </div>
                      {p.razorpayPaymentId && (
                        <div
                          className="text-emerald-600 dark:text-emerald-400 font-semibold truncate max-w-[130px]"
                          title={p.razorpayPaymentId}
                        >
                          P: {p.razorpayPaymentId}
                        </div>
                      )}
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

                    {/* Audit Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 rounded-lg text-xs gap-1.5 font-medium hover:bg-primary/10 hover:text-primary"
                        onClick={() => handleOpenDetails(p)}
                      >
                        <Eye className="size-3.5" />
                        View
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

      {/* Detailed Inspection Modal */}
      <PaymentDetailsModal
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
