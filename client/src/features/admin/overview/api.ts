import { apiGet } from "@/lib/api";
import type { PlatformOverviewData } from "./types";

export async function getAdminPlatformOverview(): Promise<PlatformOverviewData> {
  return apiGet<PlatformOverviewData>("/api/admin/overview");
}
