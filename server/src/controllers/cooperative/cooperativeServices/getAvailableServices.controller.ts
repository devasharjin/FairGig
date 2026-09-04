import { Request, Response } from "express";
import CooperativeService from "../../../models/cooperative/cooperativeService.model";
import Service from "../../../models/service/service.model";
import { ok } from "../../../shared/envelope";
import { resolveCooperativeId } from "./helper";

/**
 * Get base services that the cooperative has NOT yet added to its catalog
 * GET /api/cooperative/services/available
 */
export async function getAvailableServices(req: Request, res: Response) {
  const cooperativeId = await resolveCooperativeId(req, res);
  if (!cooperativeId) return;

  // Find IDs of services already offered by this cooperative
  const existingServices = await CooperativeService.find({
    cooperative: cooperativeId,
  }).select("service");

  const existingServiceIds = existingServices.map((cs) => cs.service);

  // Find all active base services not in existingServiceIds
  const availableServices = await Service.find({
    _id: { $nin: existingServiceIds },
    isActive: true,
  }).populate("category", "name slug icon");

  return ok(res, availableServices, "Available services retrieved successfully");
}
