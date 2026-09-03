import { apiGet, apiPost } from "@/lib/api";
import type {
  CustomerRegisterPayload,
  WorkerRegisterPayload,
  CooperativeRegisterPayload,
  FederativeRegisterPayload,
  LoginPayload,
  MeResponse,
} from "./types";

export async function loginUser(payload: LoginPayload) {
  const res = await apiPost<any, LoginPayload>("/api/auth/login", payload);
  return { ...res, user: res?.user || res };
}

export async function getMe(): Promise<MeResponse> {
  const res = await apiGet<any>("/api/auth/me");
  if (res?.user) {
    return { ...res.user, ...res };
  }
  return res;
}

export function logout() {
  return apiPost<any>("/api/auth/logout");
}

export const customerRegister = async (payload: CustomerRegisterPayload) => {
  const res = await apiPost<any, CustomerRegisterPayload>("/api/auth/register/customer", payload);
  return res;
};

export const workerRegister = async (payload: WorkerRegisterPayload) => {
  const res = await apiPost<any, WorkerRegisterPayload>("/api/auth/register/worker", payload);
  return res;
};

export const cooperativeRegister = async (payload: CooperativeRegisterPayload) => {
  const res = await apiPost<any, CooperativeRegisterPayload>("/api/auth/register/cooperative", payload);
  return res;
};

export const federativeRegister = async (payload: FederativeRegisterPayload) => {
  const res = await apiPost<any, FederativeRegisterPayload>("/api/auth/register/federation", payload);
  return res;
};

export const getCooperatives = async () => {
  const res = await apiGet<any>("/api/auth/cooperatives");
  return (res?.data || res || []) as import("./types").CooperativeOption[];
};

export const getFederations = async () => {
  const res = await apiGet<any>("/api/auth/federations");
  return (res?.data || res || []) as import("./types").FederationOption[];
};