import { Request, Response } from "express";
import mongoose from "mongoose";
import CooperativeService from "../../../models/cooperative/cooperativeService.model";
import Cooperative from "../../../models/auth/cooperative.model";
import { UserRole } from "../../../models/auth/user.model";
import { fail, ok } from "../../../shared/envelope";

/**
 * Delete / remove a service from cooperative's catalog
 * DELETE /api/cooperative/services/:id
 */
export async function deleteCooperativeService(req: Request, res: Response) {
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
        return fail(res, "Forbidden: You can only delete services belonging to your cooperative", null, 403);
      }
    }
  }

  await CooperativeService.findByIdAndDelete(id);

  return ok(res, null, "Cooperative service deleted successfully");
}
