import { useState, useEffect } from "react";
import {
  Briefcase,
  Search,
  IndianRupee,
  Users,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Plus,
  Wrench,
  Sparkles,
  ShieldCheck,
  FileText,
  BadgeCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAvailableContracts,
  getMyCooperativeBids,
  getContractBidStats,
} from "@/features/cooperative/bids/api";
import type {
  InstitutionalContractItem,
  ContractBidStats,
} from "@/features/cooperative/bids/types";
import { SubmitBidModal } from "@/components/cooperative/bids/SubmitBidModal";
import { AllocateWorkersModal } from "@/components/cooperative/bids/AllocateWorkersModal";

export default function CooperativeBids() {
  const [activeTab, setActiveTab] = useState<"available" | "my-bids">("available");
  const [availableContracts, setAvailableContracts] = useState<
    InstitutionalContractItem[]
  >([]);
  const [myBids, setMyBids] = useState<InstitutionalContractItem[]>([]);
  const [stats, setStats] = useState<ContractBidStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [clientTypeFilter, setClientTypeFilter] = useState("ALL");

  // Modals state
  const [selectedContractForBid, setSelectedContractForBid] =
    useState<InstitutionalContractItem | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const [selectedContractForAllocation, setSelectedContractForAllocation] =
    useState<InstitutionalContractItem | null>(null);
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [contractsRes, myBidsRes, statsRes] = await Promise.all([
        getAvailableContracts({
          search: searchQuery.trim() || undefined,
          clientType: clientTypeFilter,
        }),
        getMyCooperativeBids(),
        getContractBidStats(),
      ]);

      setAvailableContracts(contractsRes || []);
      setMyBids(myBidsRes || []);
      setStats(statsRes);
    } catch (err: any) {
      toast.error(err.message || "Failed to load contracts data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clientTypeFilter]);

  const handleOpenBidModal = (contract: InstitutionalContractItem) => {
    setSelectedContractForBid(contract);
    setIsBidModalOpen(true);
  };

  const handleOpenAllocationModal = (contract: InstitutionalContractItem) => {
    setSelectedContractForAllocation(contract);
    setIsAllocationModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
            >
              <Briefcase className="size-3.5 mr-1" />
              Collective Gig Economy
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Contracts & Collective Bidding
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Bid on institutional contracts and commercial tenders with pooled society member capacity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="rounded-xl gap-1.5 text-xs h-9"
          >
            <RefreshCw className="size-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs text-center">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Open Tenders
            </p>
            <p className="text-2xl font-black text-foreground mt-1">
              {stats.openTendersCount}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs text-center">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Submitted Bids
            </p>
            <p className="text-2xl font-black text-primary mt-1">
              {stats.submittedBidsCount}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs text-center">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Contracts Won
            </p>
            <p className="text-2xl font-black text-emerald-500 mt-1">
              {stats.wonContractsCount}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs text-center">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Mobilized Workers
            </p>
            <p className="text-2xl font-black text-indigo-500 mt-1">
              {stats.mobilizedWorkersCount}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs text-center col-span-2 sm:col-span-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Contract Revenue
            </p>
            <p className="text-2xl font-black text-foreground mt-1">
              ₹{stats.totalContractRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      )}

      {/* Tab Navigation & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-2xl border border-border/60 w-fit">
          <Button
            variant={activeTab === "available" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("available")}
            className="rounded-xl text-xs font-semibold h-8 px-4"
          >
            Available Tenders ({availableContracts.length})
          </Button>
          <Button
            variant={activeTab === "my-bids" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("my-bids")}
            className="rounded-xl text-xs font-semibold h-8 px-4"
          >
            Our Society Bids & Projects ({myBids.length})
          </Button>
        </div>

        {activeTab === "available" && (
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tenders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9 rounded-xl"
              />
            </div>
            <Select value={clientTypeFilter} onValueChange={setClientTypeFilter}>
              <SelectTrigger className="w-40 text-xs h-9 rounded-xl">
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Clients</SelectItem>
                <SelectItem value="Residential Society">Residential Society</SelectItem>
                <SelectItem value="Corporate / Commercial">Commercial / IT</SelectItem>
                <SelectItem value="Government / Municipal">Municipal / Govt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* TAB 1: AVAILABLE TENDERS */}
      {activeTab === "available" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {availableContracts.length === 0 ? (
            <div className="col-span-full p-12 text-center text-xs text-muted-foreground space-y-2 border border-border/70 rounded-2xl bg-card">
              <Briefcase className="size-8 mx-auto opacity-40 text-primary" />
              <p className="font-semibold text-foreground">No institutional tenders open currently</p>
              <p>Check back soon for bulk municipal, commercial, and society maintenance contracts.</p>
            </div>
          ) : (
            availableContracts.map((contract) => (
              <Card
                key={contract._id}
                className="rounded-2xl border-border/80 hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold uppercase tracking-wider rounded-md"
                    >
                      {contract.contractNumber}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] rounded-md">
                      {contract.clientType}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground line-clamp-2">
                    {contract.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Building2 className="size-3 text-primary shrink-0" />
                    {contract.clientName}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {/* Budget & Headcount Specs */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-input/20 border border-border/60 text-xs">
                    <div>
                      <span className="text-[11px] text-muted-foreground">Contract Budget</span>
                      <p className="font-bold text-foreground text-sm mt-0.5">
                        ₹{contract.budget.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground">Required Workers</span>
                      <p className="font-bold text-foreground text-sm mt-0.5">
                        {contract.requiredWorkers} ({contract.tradeRequired})
                      </p>
                    </div>
                  </div>

                  {/* Description & Scope */}
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {contract.description}
                  </p>

                  {/* Scope bullets */}
                  {contract.scopeOfWork && contract.scopeOfWork.length > 0 && (
                    <div className="space-y-1">
                      {contract.scopeOfWork.slice(0, 2).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 text-[11px] text-foreground font-medium"
                        >
                          <CheckCircle2 className="size-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Timeline & Bidding Action */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Clock className="size-3" />
                      Closes {new Date(contract.deadlineDate).toLocaleDateString("en-IN")}
                    </span>

                    <Button
                      size="sm"
                      onClick={() => handleOpenBidModal(contract)}
                      variant={contract.hasSubmittedBid ? "outline" : "default"}
                      className="rounded-xl text-xs h-8 px-3 gap-1"
                    >
                      {contract.hasSubmittedBid ? (
                        <>
                          <BadgeCheck className="size-3.5 text-emerald-500" />
                          Proposal Active
                        </>
                      ) : (
                        <>
                          <Briefcase className="size-3.5" />
                          Submit Society Bid
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* TAB 2: OUR SOCIETY BIDS & CONTRACTS */}
      {activeTab === "my-bids" && (
        <div className="space-y-4">
          {myBids.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground space-y-2 border border-border/70 rounded-2xl bg-card">
              <Briefcase className="size-8 mx-auto opacity-40 text-primary" />
              <p className="font-semibold text-foreground">No active proposals or contracts</p>
              <p>Explore available tenders in the previous tab to submit collective bids.</p>
            </div>
          ) : (
            myBids.map((contract) => (
              <Card
                key={contract._id}
                className="rounded-2xl border-border/80 hover:border-primary/40 transition-all shadow-xs"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-bold uppercase tracking-wider rounded-md"
                        >
                          {contract.contractNumber}
                        </Badge>
                        <span className="text-xs text-muted-foreground">• {contract.clientName}</span>
                        {contract.isAwardedToMe ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold">
                            AWARDED TO US
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px]">
                            Proposal: {contract.myBid?.status || "Pending"}
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-foreground">
                        {contract.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {contract.description}
                      </p>

                      {contract.myBid && (
                        <div className="pt-2 flex items-center gap-4 text-xs">
                          <span className="text-muted-foreground">
                            Our Quote:{" "}
                            <strong className="text-foreground">
                              ₹{contract.myBid.proposedAmount.toLocaleString("en-IN")}
                            </strong>
                          </span>
                          <span className="text-muted-foreground">
                            Target Team:{" "}
                            <strong className="text-foreground">
                              {contract.myBid.proposedWorkersCount} Workers
                            </strong>
                          </span>
                          <span className="text-muted-foreground">
                            Allocated:{" "}
                            <strong className="text-foreground">
                              {(contract.allocatedWorkers || []).length} /{" "}
                              {contract.requiredWorkers}
                            </strong>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                      {contract.isAwardedToMe ? (
                        <Button
                          size="sm"
                          onClick={() => handleOpenAllocationModal(contract)}
                          className="rounded-xl text-xs h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Users className="size-3.5" />
                          Mobilize Members ({(contract.allocatedWorkers || []).length})
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenBidModal(contract)}
                          className="rounded-xl text-xs h-9 gap-1.5"
                        >
                          <Briefcase className="size-3.5" />
                          Edit Quote
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <SubmitBidModal
        contract={selectedContractForBid}
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        onSuccess={fetchData}
      />

      <AllocateWorkersModal
        contract={selectedContractForAllocation}
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
