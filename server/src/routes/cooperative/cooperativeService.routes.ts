import { Router } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import { requireAuth, requireRole } from "../../middleware/authMiddleware";
import { UserRole } from "../../models/auth/user.model";

import {
  getAvailableServices,
} from "../../controllers/cooperative/cooperativeServices/getAvailableServices.controller"
import { getCooperativeServiceById, getCooperativeServices } from "../../controllers/cooperative/cooperativeServices/getCooperativeServices.controller";
import { createCooperativeService } from "../../controllers/cooperative/cooperativeServices/createCooperativeService.controller";
import { updateCooperativeService } from "../../controllers/cooperative/cooperativeServices/updateCooperativeService.controller";
import { deleteCooperativeService } from "../../controllers/cooperative/cooperativeServices/deleteCooperativeService.controller";

const router = Router();

// Protect all cooperative service endpoints with authentication
router.use(requireAuth);

// Get global services available for the cooperative to add
router.get(
  "/available",
  requireRole(UserRole.COOPERATIVE, UserRole.SUPERADMIN),
  asyncHandler(getAvailableServices)
);

// Get list of cooperative services (supports filters: cooperative, isActive, priceType, search)
router.get("/", asyncHandler(getCooperativeServices));

// Get a specific cooperative service by ID
router.get("/:id", asyncHandler(getCooperativeServiceById));

// Add a service to the cooperative catalog
router.post(
  "/",
  requireRole(UserRole.COOPERATIVE, UserRole.SUPERADMIN),
  asyncHandler(createCooperativeService)
);

// Update pricing or status of a cooperative service
router.put(
  "/:id",
  requireRole(UserRole.COOPERATIVE, UserRole.SUPERADMIN),
  asyncHandler(updateCooperativeService)
);

// Remove a service from the cooperative catalog
router.delete(
  "/:id",
  requireRole(UserRole.COOPERATIVE, UserRole.SUPERADMIN),
  asyncHandler(deleteCooperativeService)
);

export default router;
