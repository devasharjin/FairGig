import { apiGet } from "@/lib/api";
import type { CooperativeOverviewResponse } from "./types";

export async function getCooperativeOverview(): Promise<CooperativeOverviewResponse> {
  return apiGet<CooperativeOverviewResponse>("/api/cooperative/overview");
}
