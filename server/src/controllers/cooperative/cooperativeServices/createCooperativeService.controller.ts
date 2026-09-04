import { Request, Response } from "express";
import mongoose from "mongoose";
import CooperativeService from "../../../models/cooperative/cooperativeService.model";
import Service from "../../../models/service/service.model";
import { fail, ok } from "../../../shared/envelope";
import { resolveCooperativeId } from "./helper";

/**
 * Add a service to cooperative's catalog
 * POST /api/cooperative/services
 */
export async function createCooperativeService(req: Request, res: Response) {
  const cooperativeId = await resolveCooperativeId(req, res);
  if (!cooperativeId) return;

  const { service, priceType, HourlyPrice, hourlyPrice, price, isActive } = req.body;

  // 1. Validate service ID
  if (!service || typeof service !== "string" || !mongoose.Types.ObjectId.isValid(service)) {
    return fail(res, "A valid base service ID is required", null, 400);
  }

  const serviceExists = await Service.findById(service);
  if (!serviceExists) {
    return fail(res, "Base service not found", null, 404);
  }

  if (!serviceExists.isActive) {
    return fail(res, "Cannot add an inactive base service", null, 400);
  }

  // 2. Validate priceType
  const normalizedPriceType = typeof priceType === "string" ? priceType.toLowerCase().trim() : "";
  if (!["hourly", "fixed"].includes(normalizedPriceType)) {
    return fail(res, "priceType must be either 'hourly' or 'fixed'", null, 400);
  }

  // 3. Handle optional price (supports HourlyPrice, hourlyPrice, or price)
  const rawPrice = HourlyPrice !== undefined ? HourlyPrice : hourlyPrice !== undefined ? hourlyPrice : price;
  let finalPrice: number | undefined = undefined;

  if (rawPrice !== undefined && rawPrice !== null && rawPrice !== "") {
    const numPrice = Number(rawPrice);
    if (isNaN(numPrice) || numPrice < 0) {
      return fail(res, "Price must be a valid non-negative number", null, 400);
    }
    finalPrice = numPrice;
  }

  // 4. Prevent duplicate service for same cooperative
  const existingOffering = await CooperativeService.findOne({
    cooperative: cooperativeId,
    service,
  });

  if (existingOffering) {
    return fail(res, "This service has already been added to the cooperative catalog", null, 409);
  }

  // 5. Create cooperative service
  const newCooperativeService = await CooperativeService.create({
    cooperative: cooperativeId,
    service: new mongoose.Types.ObjectId(service),
    priceType: normalizedPriceType as "hourly" | "fixed",
    ...(finalPrice !== undefined && { HourlyPrice: finalPrice }),
    isActive: typeof isActive === "boolean" ? isActive : true,
  });

  // Populate references
  await newCooperativeService.populate([
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

  return ok(res, newCooperativeService, "Cooperative service created successfully");
}
