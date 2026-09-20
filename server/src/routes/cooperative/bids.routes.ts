import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/authMiddleware";
import { UserRole } from "../../models/auth/user.model";
import { asyncHandler } from "../../shared/asyncHandler";
import {
  getAvailableContracts,
  getMyCooperativeBids,
  submitContractBid,
  allocateWorkersToContract,
  getContractBidStats,
} from "../../controllers/cooperative/bids.controller";

const router = Router();

// Protect all cooperative bidding endpoints with authentication and COOPERATIVE role
router.use(requireAuth, requireRole(UserRole.COOPERATIVE));

// GET /api/cooperative/bids/contracts - List open institutional tenders available for bidding
router.get("/contracts", asyncHandler(getAvailableContracts));

// GET /api/cooperative/bids/my-bids - List bids and awarded contracts for the authenticated cooperative
router.get("/my-bids", asyncHandler(getMyCooperativeBids));

// GET /api/cooperative/bids/stats - Summary KPI metrics for bidding operations
router.get("/stats", asyncHandler(getContractBidStats));

// POST /api/cooperative/bids/submit - Submit quote & proposal for a contract
router.post("/submit", asyncHandler(submitContractBid));

// POST /api/cooperative/bids/:contractId/allocate - Mobilize verified member workers for an awarded contract
router.post("/:contractId/allocate", asyncHandler(allocateWorkersToContract));

export default router;
