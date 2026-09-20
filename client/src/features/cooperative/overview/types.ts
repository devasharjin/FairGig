export interface CooperativeProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  verificationStatus: "Pending" | "Approved" | "Rejected";
  logo?: string;
  certificate?: string;
  rejectedReason?: string;
}

export interface WorkforceSummaryData {
  total: number;
  active: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface FinancialSummaryData {
  grossTurnover: number;
  cooperativeShareEarned: number;
  workerNetDisbursed: number;
  welfareReserveFund: number;
  paidTransactionsCount: number;
}

export interface GigSummaryData {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  emergency: number;
}

export interface PendingActionItemsData {
  pendingWorkersCount: number;
  pendingClaimsCount: number;
  activeEmergencyGigs: number;
}

export interface RecentBookingItem {
  _id: string;
  bookingNumber?: string;
  customer?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profilePicture?: string;
  };
  worker?: {
    _id: string;
    userId?: {
      _id: string;
      name: string;
      phone: string;
    };
  };
  service?: {
    _id: string;
    name: string;
    priceType: string;
    hourlyPrice?: number;
    cooperativeShare?: number;
  };
  status: string;
  totalAmount: number;
  isEmergency?: boolean;
  scheduledDate: string;
  createdAt: string;
}

export interface TradeCapacityItem {
  trade: string;
  workerCount: number;
}

export interface CooperativeOverviewResponse {
  cooperative: CooperativeProfileData;
  workforce: WorkforceSummaryData;
  financials: FinancialSummaryData;
  gigs: GigSummaryData;
  pendingActions: PendingActionItemsData;
  recentBookings: RecentBookingItem[];
  topTrades: TradeCapacityItem[];
}
