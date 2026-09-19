import { apiGet, apiPost } from "@/lib/api";
import type {
  CooperativeForecastOverview,
  CategoryDemandItem,
  ZoneAllocationItem,
  WorkforceRebalancePlan,
  FairRotationMetrics,
  WorkerHotspot,
  SmartShiftAdvice,
  PlatformMacroForecast,
  CrossCooperativeExchange,
  EngineHealth,
} from "./types";

// ==========================================
// COOPERATIVE FORECASTING APIS
// ==========================================

export async function getCooperativeForecastOverview(): Promise<CooperativeForecastOverview> {
  return apiGet<CooperativeForecastOverview>("/api/cooperative/forecasting/overview");
}

export async function getCategoryDemandBreakdown(): Promise<CategoryDemandItem[]> {
  return apiGet<CategoryDemandItem[]>("/api/cooperative/forecasting/category-breakdown");
}

export async function getZoneAllocationMatrix(): Promise<ZoneAllocationItem[]> {
  return apiGet<ZoneAllocationItem[]>("/api/cooperative/forecasting/zone-matrix");
}

export async function getRebalancePlans(): Promise<WorkforceRebalancePlan[]> {
  return apiGet<WorkforceRebalancePlan[]>("/api/cooperative/forecasting/rebalance-plans");
}

export async function executeRebalancePlan(planId: string): Promise<WorkforceRebalancePlan> {
  return apiPost<WorkforceRebalancePlan>(`/api/cooperative/forecasting/rebalance-plans/${planId}/execute`, {});
}

export async function getFairRotationMetrics(): Promise<FairRotationMetrics> {
  return apiGet<FairRotationMetrics>("/api/cooperative/forecasting/fair-rotation");
}

// ==========================================
// SUPER ADMIN MACRO FORECASTING APIS
// ==========================================

export async function getPlatformForecastingMatrix(): Promise<PlatformMacroForecast> {
  return apiGet<PlatformMacroForecast>("/api/admin/forecasting/matrix");
}

export async function getCrossCooperativeExchanges(): Promise<CrossCooperativeExchange[]> {
  return apiGet<CrossCooperativeExchange[]>("/api/admin/forecasting/cross-cooperative-exchange");
}

export async function getEngineHealth(): Promise<EngineHealth> {
  return apiGet<EngineHealth>("/api/admin/forecasting/engine-health");
}

export async function retrainForecastingModel(): Promise<{
  status: string;
  recalibratedAt: string;
  accuracyScore: number;
  mapeScore: number;
  processedHistoricalBookings: number;
  activePriorZones: number;
  message: string;
}> {
  return apiPost("/api/admin/forecasting/retrain", {});
}

// ==========================================
// WORKER DEMAND & SMART SHIFT APIS
// ==========================================

export async function getWorkerDemandHotspots(): Promise<WorkerHotspot[]> {
  return apiGet<WorkerHotspot[]>("/api/worker/forecasting/hotspots");
}

export async function getWorkerSmartShifts(): Promise<SmartShiftAdvice> {
  return apiGet<SmartShiftAdvice>("/api/worker/forecasting/smart-shifts");
}
