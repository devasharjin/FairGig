export interface PlatformOverviewKpis {
  grossGtv: number;
  platformRevenue: number;
  welfareReservePool: number;
  totalWorkerPayouts: number;
  totalBookings: number;
  completedBookings: number;
  activeBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalCooperatives: number;
  approvedCooperatives: number;
  pendingCooperatives: number;
  totalWorkers: number;
  totalCustomers: number;
  totalUsers: number;
}

export interface OrderBreakdown {
  emergencyCount: number;
  premiumCount?: number;
  onDemandCount: number;
  scheduledCount: number;
  completedPercentage: number;
}

export interface SystemHealth {
  status: string;
  databaseStatus: string;
  aiTelemetryStatus: string;
  uptimeHours: number;
  activeNodes: number;
}

export interface RecentActivityItem {
  id: string;
  bookingNumber: string;
  customerName: string;
  serviceName: string;
  cooperativeName: string;
  amount: number;
  status: string;
  bookingType: string;
  isEmergency: boolean;
  scheduledDate: string;
  createdAt: string;
}

export interface PlatformOverviewData {
  kpis: PlatformOverviewKpis;
  orderBreakdown: OrderBreakdown;
  systemHealth: SystemHealth;
  recentActivity: RecentActivityItem[];
}
