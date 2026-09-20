import { apiGet, apiPatch } from "@/lib/api";
import type {
  CooperativeMembersResponse,
  MemberDossierResponse,
  CooperativeMember,
} from "./types";

export interface GetMembersParams {
  search?: string;
  status?: string;
  availability?: string;
  skill?: string;
  page?: number;
  limit?: number;
}

export async function getCooperativeMembers(
  params?: GetMembersParams
): Promise<CooperativeMembersResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.status && params.status !== "ALL") query.append("status", params.status);
  if (params?.availability && params.availability !== "ALL")
    query.append("availability", params.availability);
  if (params?.skill && params.skill !== "ALL") query.append("skill", params.skill);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));

  const url = `/api/cooperative/members${query.toString() ? `?${query.toString()}` : ""}`;
  return apiGet<CooperativeMembersResponse>(url);
}

export async function toggleMemberStatus(
  memberId: string,
  payload: { isActive?: boolean; availability?: string }
): Promise<CooperativeMember> {
  return apiPatch<CooperativeMember>(
    `/api/cooperative/members/${memberId}/status`,
    payload
  );
}

export async function getMemberDossier(
  memberId: string
): Promise<MemberDossierResponse> {
  return apiGet<MemberDossierResponse>(`/api/cooperative/members/${memberId}`);
}
