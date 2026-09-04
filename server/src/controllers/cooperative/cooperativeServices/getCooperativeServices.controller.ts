import { Request, Response } from "express";
import mongoose from "mongoose";
import CooperativeService from "../../../models/cooperative/cooperativeService.model";
import Cooperative from "../../../models/auth/cooperative.model";
import { UserRole } from "../../../models/auth/user.model";
import { fail, ok } from "../../../shared/envelope";

/**
 * Get cooperative services list with optional filtering
 * GET /api/cooperative/services
 */
export async function getCooperativeServices(req: Request, res: Response) {
  const { cooperative, isActive, priceType, search, sortBy = "createdAt", order = "desc" } = req.query;

  const filter: Record<string, any> = {};

  // If user is a COOPERATIVE, default to their own services unless explicitly searching another (if permitted)
  if (req.user && typeof req.user !== "string") {
    const userRoles = Array.isArray(req.user.role)
      ? req.user.role
      : typeof req.user.role === "string"
        ? [req.user.role]
        : [];

    if (userRoles.includes(UserRole.COOPERATIVE)) {
      const myCoop = await Cooperative.findOne({ userId: req.user.userId });
      if (myCoop) {
        filter.cooperative = myCoop._id;
      }
    }
  }

  // If cooperative is explicitly requested in query
  if (cooperative && typeof cooperative === "string" && mongoose.Types.ObjectId.isValid(cooperative)) {
    filter.cooperative = new mongoose.Types.ObjectId(cooperative);
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  if (priceType && typeof priceType === "string") {
    filter.priceType = priceType.toLowerCase().trim();
  }

  const sortDirection = order === "asc" ? 1 : -1;
  const sortField = typeof sortBy === "string" ? sortBy : "createdAt";

  let query = CooperativeService.find(filter)
    .populate({
      path: "service",
      select: "name description category isActive",
      populate: { path: "category", select: "name slug icon" },
    })
    .populate({
      path: "cooperative",
      select: "cooperativeName cooperativeEmail cooperativePhone",
    })
    .sort({ [sortField]: sortDirection });

  let results = await query;

  // Filter by service name or description if search term is provided
  if (typeof search === "string" && search.trim()) {
    const searchLower = search.trim().toLowerCase();
    results = results.filter((item: any) => {
      const serviceName = item.service?.name?.toLowerCase() || "";
      const serviceDesc = item.service?.description?.toLowerCase() || "";
      return serviceName.includes(searchLower) || serviceDesc.includes(searchLower);
    });
  }

  return ok(res, results, "Cooperative services retrieved successfully");
}

/**
 * Get single cooperative service by ID
 * GET /api/cooperative/services/:id
 */
export async function getCooperativeServiceById(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, "Invalid cooperative service ID", null, 400);
  }

  const coopService = await CooperativeService.findById(id)
    .populate({
      path: "service",
      select: "name description category isActive",
      populate: { path: "category", select: "name slug icon" },
    })
    .populate({
      path: "cooperative",
      select: "cooperativeName cooperativeEmail cooperativePhone",
    });

  if (!coopService) {
    return fail(res, "Cooperative service not found", null, 404);
  }

  return ok(res, coopService, "Cooperative service retrieved successfully");
}
