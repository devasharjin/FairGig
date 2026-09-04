import { Request, Response } from "express";
import mongoose from "mongoose";
import CooperativeService from "../../../models/cooperative/cooperativeService.model";
import Cooperative from "../../../models/auth/cooperative.model";
import { UserRole } from "../../../models/auth/user.model";
import { fail, ok } from "../../../shared/envelope";

/**
 * Update cooperative service pricing / status
 * PUT /api/cooperative/services/:id
 */
export async function updateCooperativeService(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, "Invalid cooperative service ID", null, 400);
  }

  const coopService = await CooperativeService.findById(id);
  if (!coopService) {
    return fail(res, "Cooperative service not found", null, 404);
  }

  // Verify ownership if authenticated as COOPERATIVE
  if (req.user && typeof req.user !== "string") {
    const userRoles = Array.isArray(req.user.role)
      ? req.user.role
      : typeof req.user.role === "string"
        ? [req.user.role]
        : [];

    if (userRoles.includes(UserRole.COOPERATIVE)) {
      const myCoop = await Cooperative.findOne({ userId: req.user.userId });
      if (!myCoop || coopService.cooperative.toString() !== myCoop._id.toString()) {
        return fail(res, "Forbidden: You can only modify services belonging to your cooperative", null, 403);
      }
    }
  }

  const { priceType, HourlyPrice, hourlyPrice, price, isActive } = req.body;

  if (priceType !== undefined) {
    const normalizedPriceType = typeof priceType === "string" ? priceType.toLowerCase().trim() : "";
    if (!["hourly", "fixed"].includes(normalizedPriceType)) {
      return fail(res, "priceType must be either 'hourly' or 'fixed'", null, 400);
    }
    coopService.priceType = normalizedPriceType as "hourly" | "fixed";
  }

  const rawPrice = HourlyPrice !== undefined ? HourlyPrice : hourlyPrice !== undefined ? hourlyPrice : price;
  if (rawPrice !== undefined && rawPrice !== null && rawPrice !== "") {
    const numPrice = Number(rawPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      return fail(res, "Price must be a valid non-negative number", null, 400);
    }
    coopService.HourlyPrice = numPrice;
  }

  if (isActive !== undefined) {
    coopService.isActive = Boolean(isActive);
  }

  await coopService.save();

  await coopService.populate([
    {
      path: "service",
      select: "name description category isActive",
      populate: { path: "category", select: "name slug icon" },
    },
    {
      path: "cooperative",
      select: "cooperativeName cooperativeEmail cooperativePhone",
    },
  ]);

  return ok(res, coopService, "Cooperative service updated successfully");
}
