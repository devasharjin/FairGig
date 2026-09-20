export type ContractStatus =
  | "OPEN"
  | "BID_SUBMITTED"
  | "AWARDED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type BidStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface BidRecord {
  _id?: string;
  cooperative: string;
  proposedAmount: number;
  proposedWorkersCount: number;
  proposalNotes: string;
  status: BidStatus;
  submittedAt: string;
}

export interface InstitutionalContractItem {
  _id: string;
  contractNumber: string;
  title: string;
  clientName: string;
  clientType:
    | "Residential Society"
    | "Corporate / Commercial"
    | "Government / Municipal"
    | "Educational Institution"
    | "Other";
  category?: {
    _id: string;
    name: string;
    icon?: string;
    slug?: string;
  };
  description: string;
  scopeOfWork: string[];
  location: string;
  budget: number;
  requiredWorkers: number;
  tradeRequired: string;
  durationDays: number;
  deadlineDate: string;
  startDate?: string;
  status: ContractStatus;
  bids: BidRecord[];
  awardedCooperative?: string;
  allocatedWorkers?: Array<{
    _id: string;
    userId?: {
      _id: string;
      name: string;
      phone: string;
      email: string;
      profilePicture?: string;
    };
  }>;
  hasSubmittedBid?: boolean;
  myBid?: BidRecord | null;
  totalBidsCount?: number;
  isAwardedToMe?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContractBidStats {
  openTendersCount: number;
  submittedBidsCount: number;
  wonContractsCount: number;
  activeProjectsCount: number;
  totalContractRevenue: number;
  mobilizedWorkersCount: number;
}
