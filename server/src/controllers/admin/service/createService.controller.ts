import { Request, Response } from "express";
import mongoose from "mongoose";
import Service from "../../../models/service/service.model";
import Category from "../../../models/service/category.model";
import { fail, ok } from "../../../shared/envelope";

export async function createService(req: Request, res: Response) {
  const { name, description, category, isActive } = req.body;

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

  if (description.trim().length > 500) {
    return fail(res, "Service description cannot exceed 500 characters", null, 400);
  }

  if (!category || typeof category !== "string" || !mongoose.Types.ObjectId.isValid(category)) {
    return fail(res, "A valid category ID is required", null, 400);
  }

  // Verify category exists
  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return fail(res, "Category not found", null, 404);
  }

  // Check for duplicate service name (case-insensitive)
  const existingService = await Service.findOne({
    name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
  });

  if (existingService) {
    return fail(res, "Service with this name already exists", null, 409);
  }

  const newService = await Service.create({
    name: trimmedName,
    description: description.trim(),
    category,
    isActive: typeof isActive === "boolean" ? isActive : true,
  });

  await newService.populate("category", "name slug icon");

  return ok(res, newService, "Service created successfully");
}
