import { apiPost } from "@/lib/api";
import type { VoiceProcessRequest, VoiceProcessResponse } from "./types";

export async function processVoiceQuery(payload: VoiceProcessRequest): Promise<VoiceProcessResponse> {
  return apiPost<VoiceProcessResponse, VoiceProcessRequest>("/api/voice-assistant/process", payload);
}
