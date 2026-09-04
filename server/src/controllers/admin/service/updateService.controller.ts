import { Request, Response } from "express";
import mongoose from "mongoose";
import Service from "../../../models/service/service.model";
import Category from "../../../models/service/category.model";
import { fail, ok } from "../../../shared/envelope";

export async function updateService(req: Request, res: Response) {
  const id = req.params.id as string;

  if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return fail(res, "Invalid service ID", null, 400);
  }

  const service = await Service.findById(id);
  if (!service) {
    return fail(res, "Service not found", null, 404);
  }

  const { name, description, category, isActive } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return fail(res, "Service name cannot be empty", null, 400);
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return fail(res, "Service name must be between 2 and 100 characters", null, 400);
    }

    const existingService = await Service.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${trimmedName}$`, "i") },
    });

    if (existingService) {
      return fail(res, "Service with this name already exists", null, 409);
    }

    service.name = trimmedName;
  }

  if (description !== undefined) {
    if (typeof description !== "string" || !description.trim()) {
      return fail(res, "Service description cannot be empty", null, 400);
    }

    if (description.trim().length > 500) {
      return fail(res, "Service description cannot exceed 500 characters", null, 400);
    }

    service.description = description.trim();
  }

  if (category !== undefined) {
    if (!category || typeof category !== "string" || !mongoose.Types.ObjectId.isValid(category)) {
      return fail(res, "A valid category ID is required", null, 400);
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return fail(res, "Category not found", null, 404);
    }

    service.category = new mongoose.Types.ObjectId(category);
  }

  if (isActive !== undefined) {
    service.isActive = Boolean(isActive);
  }

  await service.save();
  await service.populate("category", "name slug icon isActive");

  return ok(res, service, "Service updated successfully");
}
