import { apiGet, apiPost } from "@/lib/api";
import type {
  InstitutionalContractItem,
  ContractBidStats,
} from "./types";

export interface GetContractsParams {
  search?: string;
  trade?: string;
  clientType?: string;
}

export async function getAvailableContracts(
  params?: GetContractsParams
): Promise<InstitutionalContractItem[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.trade && params.trade !== "ALL") query.append("trade", params.trade);
  if (params?.clientType && params.clientType !== "ALL")
    query.append("clientType", params.clientType);

  const url = `/api/cooperative/bids/contracts${
    query.toString() ? `?${query.toString()}` : ""
  }`;
  return apiGet<InstitutionalContractItem[]>(url);
}

export async function getMyCooperativeBids(): Promise<InstitutionalContractItem[]> {
  return apiGet<InstitutionalContractItem[]>("/api/cooperative/bids/my-bids");
}

export async function getContractBidStats(): Promise<ContractBidStats> {
  return apiGet<ContractBidStats>("/api/cooperative/bids/stats");
}

export async function submitContractBid(payload: {
  contractId: string;
  proposedAmount: number;
  proposedWorkersCount: number;
  proposalNotes: string;
}): Promise<any> {
  return apiPost<any>("/api/cooperative/bids/submit", payload);
}

export async function allocateWorkersToContract(
  contractId: string,
  workerIds: string[]
): Promise<InstitutionalContractItem> {
  return apiPost<InstitutionalContractItem>(
    `/api/cooperative/bids/${contractId}/allocate`,
    { workerIds }
  );
}
