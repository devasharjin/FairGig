import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Wrench,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { allocateWorkersToContract } from "@/features/cooperative/bids/api";
import { getCooperativeMembers } from "@/features/cooperative/members/api";
import type { InstitutionalContractItem } from "@/features/cooperative/bids/types";
import type { CooperativeMember } from "@/features/cooperative/members/types";

interface AllocateWorkersModalProps {
  contract: InstitutionalContractItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AllocateWorkersModal = ({
  contract,
  isOpen,
  onClose,
  onSuccess,
}: AllocateWorkersModalProps) => {
  const [members, setMembers] = useState<CooperativeMember[]>([]);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && contract) {
      setIsLoadingMembers(true);
      // Pre-select already allocated workers
      const preselected = (contract.allocatedWorkers || []).map((w) =>
        typeof w === "string" ? w : w._id
      );
      setSelectedWorkerIds(preselected);

      getCooperativeMembers({ status: "Approved" })
        .then((res) => {
          setMembers(res.members || []);
        })
        .catch(() => {
          setMembers([]);
        })
        .finally(() => {
          setIsLoadingMembers(false);
        });
    }
  }, [isOpen, contract]);

  const toggleWorker = (workerId: string) => {
    setSelectedWorkerIds((prev) =>
      prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId]
    );
  };

  const handleSelectAll = () => {
    const approvedIds = members.map((m) => m._id);
    setSelectedWorkerIds(approvedIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;

    if (selectedWorkerIds.length === 0) {
      toast.error("Please select at least one verified worker to allocate");
      return;
    }

    setIsSubmitting(true);
    try {
      await allocateWorkersToContract(contract._id, selectedWorkerIds);
      toast.success(
        `${selectedWorkerIds.length} member workers mobilized for this contract!`
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to allocate workers");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contract) return null;

  const filteredMembers = members.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.userId?.name?.toLowerCase().includes(q) ||
      m.userId?.phone?.includes(q) ||
      m.skills?.some((s) => s.name?.toLowerCase().includes(q))
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 rounded-2xl bg-card border-border/80 shadow-2xl">
        <div className="bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent p-6 border-b border-border/60">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 rounded-md"
            >
              Awarded Contract
            </Badge>
            <span className="text-xs text-muted-foreground">• {contract.tradeRequired}</span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            Mobilize Member Workforce
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {contract.title}
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Capacity vs Selected */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-input/20 border border-border/60 text-xs">
            <div>
              <span className="text-muted-foreground">Required Headcount:</span>
              <p className="font-bold text-foreground text-sm mt-0.5">
                {contract.requiredWorkers} Workers
              </p>
            </div>
            <div className="text-right">
              <span className="text-muted-foreground">Currently Selected:</span>
              <p
                className={`font-bold text-sm mt-0.5 ${
                  selectedWorkerIds.length >= contract.requiredWorkers
                    ? "text-emerald-500"
                    : "text-amber-500"
                }`}
              >
                {selectedWorkerIds.length} / {contract.requiredWorkers} Workers
              </p>
            </div>
          </div>

          {/* Search Member Workers */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search verified members by name or trade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 text-xs h-9 rounded-xl"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs h-9 rounded-xl"
            >
              Select All
            </Button>
          </div>

          {/* Member Selection List */}
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {isLoadingMembers ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground text-xs gap-2">
                <Loader2 className="size-4 animate-spin" /> Loading approved member roster...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground text-xs">
                No approved workers found matching your search.
              </div>
            ) : (
              filteredMembers.map((member) => {
                const isSelected = selectedWorkerIds.includes(member._id);
                return (
                  <div
                    key={member._id}
                    onClick={() => toggleWorker(member._id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none text-xs ${
                      isSelected
                        ? "bg-primary/10 border-primary/40 shadow-sm"
                        : "bg-input/20 border-border/60 hover:bg-input/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-5 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/40 bg-background"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="size-3.5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {member.userId?.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {member.userId?.phone} • {member.availability}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end max-w-xs">
                      {member.skills?.slice(0, 2).map((s) => (
                        <Badge
                          key={s._id}
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                        >
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl text-xs h-9"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl text-xs h-9 gap-1.5"
              disabled={isSubmitting || selectedWorkerIds.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Mobilizing...
                </>
              ) : (
                <>
                  <Users className="size-3.5" /> Confirm Allocation ({selectedWorkerIds.length})
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
