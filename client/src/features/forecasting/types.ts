export interface DailyForecastPoint {
  date: string;
  dayName: string;
  predictedDemand: number;
  workerCapacity: number;
  gap: number;
  gapStatus: "OPTIMAL" | "DEFICIT" | "SURPLUS";
  surgeMultiplier: number;
  confidence: number;
}

export interface HourlyPeakPoint {
  hour: number;
  timeLabel: string;
  surgeMultiplier: number;
  isPeak: boolean;
  suggestedWorkersNeeded: number;
}

export interface CooperativeForecastOverview {
  activeWorkers: number;
  workerDailyCapacity: number;
  total7DayProjectedGigs: number;
  deficitDaysCount: number;
  todaySummary: {
    predictedDemand: number;
    currentCapacity: number;
    gapStatus: "OPTIMAL" | "DEFICIT" | "SURPLUS";
    currentSurgeMultiplier: number;
    confidenceScore: number;
  };
  dailyForecast: DailyForecastPoint[];
  tomorrowHourlyCurve: HourlyPeakPoint[];
  cooperative?: {
    id: string;
    name: string;
  };
}

export interface CategoryDemandItem {
  categoryId: string;
  categoryName: string;
  projectedGigsNext7Days: number;
  percentageShare: number;
  surgeRisk: "LOW" | "MODERATE" | "HIGH";
  surgeMultiplier: number;
  growthRatePercentage: number;
}

export interface ZoneAllocationItem {
  zoneName: string;
  predictedDemand: number;
  workerCapacity: number;
  gap: number;
  status: "OPTIMAL" | "DEFICIT" | "SURPLUS";
  recommendedAction: string;
  bountyIncentive: number;
}

export interface WorkforceRebalancePlan {
  _id: string;
  planNumber: string;
  title: string;
  targetTrade: string;
  sourceZone: string;
  targetZone: string;
  recommendedWorkersCount: number;
  surgeBonusPerWorker: number;
  status: "RECOMMENDED" | "APPROVED" | "EXECUTED" | "DISMISSED";
  aiRationale: string;
  createdAt: string;
  executedAt?: string;
}

export interface RotationWorker {
  workerId: string;
  name: string;
  category?: string;
  recentGigsCount: number;
  dispatchPriority: "HIGH" | "BALANCED" | "STANDBY";
  fairSharePercentage: number;
}

export interface FairRotationMetrics {
  fairRotationScore: number;
  totalActiveMembers: number;
  highPriorityRotationWorkersCount: number;
  rotationRoster: RotationWorker[];
}

export interface WorkerHotspot {
  zoneName: string;
  surgeFactor: number;
  peakHours: string;
  activeDemandLevel: "HIGH_SURGE" | "MODERATE" | "LOW";
  topTrade: string;
  bonusEstimate: string;
  recommendation: string;
}

export interface SmartShiftAdvice {
  workerId: string;
  recommendedShift: {
    day: string;
    timeSlot: string;
    expectedGigMultiplier: number;
    estimatedEarningsBoost: string;
    priorityStatus: string;
    reason: string;
  };
  activeSurgeBounties: Array<{
    title: string;
    zone: string;
    bonus: string;
    validUntil: string;
  }>;
}

export interface CrossCooperativeExchange {
  sourceCooperative: string;
  targetCooperative: string;
  recommendedWorkers: number;
  trade: string;
  reason: string;
  status: string;
}

export interface EngineHealth {
  accuracyScore: number;
  mapeScore: number;
  trainingSamples: number;
  modelArchitecture: string;
  lastCalibratedAt: string;
  environmentalFactorsActive: string[];
}

export interface PlatformMacroForecast {
  platformForecasted7DayTotal: number;
  activePlatformWorkforce: number;
  totalHistoricalGigsFulfilled: number;
  modelHealth: EngineHealth;
  crossCooperativeExchanges: CrossCooperativeExchange[];
}
