import { Request, Response } from "express";
import mongoose from "mongoose";
import Service from "../../../models/service.model";
import Category from "../../../models/category.model";
import { fail, ok } from "../../../shared/envelope";

export async function createService(req: Request, res: Response) {
  const { name, description, category, priceType, hourlyPrice, metersPrice, isActive } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return fail(res, "Service name is required", null, 400);
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return fail(res, "Service name must be between 2 and 100 characters", null, 400);
  }

  if (!description || typeof description !== "string" || !description.trim()) {
    return fail(res, "Service description is required", null, 400);
  }

  if (description.trim().length > 1000) {
    return fail(res, "Service description cannot exceed 1000 characters", null, 400);
  }

  if (!category || typeof category !== "string" || !mongoose.Types.ObjectId.isValid(category)) {
    return fail(res, "A valid category ID is required", null, 400);
  }

  if (!priceType || !["hourly", "meters"].includes(priceType)) {
    return fail(res, "Price type must be either 'hourly' or 'meters'", null, 400);
  }

  const parsedHourlyPrice = hourlyPrice !== undefined && hourlyPrice !== null ? Number(hourlyPrice) : undefined;
  const parsedMetersPrice = metersPrice !== undefined && metersPrice !== null ? Number(metersPrice) : undefined;

  if (priceType === "hourly") {
    if (parsedHourlyPrice === undefined || isNaN(parsedHourlyPrice) || parsedHourlyPrice < 0) {
      return fail(res, "A valid non-negative hourly price is required", null, 400);
    }
  }

  if (priceType === "meters") {
    if (parsedMetersPrice === undefined || isNaN(parsedMetersPrice) || parsedMetersPrice < 0) {
      return fail(res, "A valid non-negative meters price is required", null, 400);
    }
  }

  // Verify category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return fail(res, "Category not found", null, 404);
  }

  // Check for duplicate service name within the same category (case-insensitive)
  const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const existingService = await Service.findOne({
    category,
    name: { $regex: new RegExp(`^${escapedName}$`, "i") },
  });

  if (existingService) {
    return fail(res, "Service with this name already exists in this category", null, 409);
  }

  try {
    const newService = await Service.create({
      name: trimmedName,
      description: description.trim(),
      category,
      priceType,
      hourlyPrice: priceType === "hourly" ? parsedHourlyPrice : undefined,
      metersPrice: priceType === "meters" ? parsedMetersPrice : undefined,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    await newService.populate("category", "name slug icon isActive");

    return ok(res, newService, "Service created successfully");
  } catch (err: any) {
    if (err?.code === 11000) {
      return fail(res, "Service with this name already exists in this category", null, 409);
    }
    if (err?.name === "ValidationError") {
      const message = Object.values(err.errors || {})
        .map((e: any) => e.message)
        .join(", ");
      return fail(res, message || "Service validation failed", null, 400);
    }
    throw err;
  }
}
