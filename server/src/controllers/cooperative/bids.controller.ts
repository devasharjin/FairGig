import { Request, Response } from "express";
import mongoose from "mongoose";
import InstitutionalContract, {
  ContractStatus,
  BidStatus,
} from "../../models/contractBid.model";
import Cooperative from "../../models/auth/cooperative.model";
import Worker, { VerificationStatus } from "../../models/auth/worker.model";
import { fail, ok } from "../../shared/envelope";

/**
 * List all available institutional tenders open for collective bidding
 */
export async function getAvailableContracts(req: Request, res: Response) {
  if (!req.user || typeof req.user === "string") {
    return fail(res, "Unauthorized", null, 401);
  }

  const userId = req.user.userId || (req.user as any)?.id;
  const cooperative = await Cooperative.findOne({ userId });
  if (!cooperative) {
    return fail(res, "Cooperative profile not found", null, 404);
  }

  const coopId = cooperative._id as mongoose.Types.ObjectId;

  const { search, trade, clientType } = req.query;

  const query: Record<string, any> = {
    status: { $in: [ContractStatus.OPEN, ContractStatus.BID_SUBMITTED] },
    deadlineDate: { $gte: new Date() },
  };

  if (trade && trade !== "ALL") {
    query.tradeRequired = new RegExp(String(trade).trim(), "i");
  }

  if (clientType && clientType !== "ALL") {
    query.clientType = clientType;
  }

  if (search && typeof search === "string" && search.trim()) {
    const s = search.trim();
    const regex = new RegExp(s, "i");
    query.$or = [
      { title: regex },
      { clientName: regex },
      { description: regex },
      { location: regex },
      { contractNumber: regex },
    ];
  }

  const contracts = await InstitutionalContract.find(query)
    .populate("category", "name icon slug")
    .sort({ deadlineDate: 1 })
    .lean();

  // Attach a helper flag indicating whether the current cooperative has placed a bid
  const enriched = contracts.map((c) => {
    const myBid = c.bids.find(
      (b: any) => String(b.cooperative) === String(coopId)
    );
    return {
      ...c,
      hasSubmittedBid: Boolean(myBid),
      myBid: myBid || null,
      totalBidsCount: c.bids.length,
    };
  });

  return ok(res, enriched, "Available tenders retrieved successfully");
}

/**
 * List all contracts where the authenticated cooperative has submitted a bid or been awarded
 */
export async function getMyCooperativeBids(req: Request, res: Response) {
  if (!req.user || typeof req.user === "string") {
    return fail(res, "Unauthorized", null, 401);
  }

  const userId = req.user.userId || (req.user as any)?.id;
  const cooperative = await Cooperative.findOne({ userId });
  if (!cooperative) {
    return fail(res, "Cooperative profile not found", null, 404);
  }

  const coopId = cooperative._id as mongoose.Types.ObjectId;

  const contracts = await InstitutionalContract.find({
    $or: [{ "bids.cooperative": coopId }, { awardedCooperative: coopId }],
  })
    .populate("category", "name icon slug")
    .populate({
      path: "allocatedWorkers",
      populate: { path: "userId", select: "name email phone profilePicture" },
    })
    .sort({ updatedAt: -1 })
    .lean();

  const enriched = contracts.map((c) => {
    const myBid = c.bids.find(
      (b: any) => String(b.cooperative) === String(coopId)
    );
    const isAwardedToMe =
      String(c.awardedCooperative) === String(coopId) ||
      myBid?.status === BidStatus.ACCEPTED;

    return {
      ...c,
      myBid: myBid || null,
      isAwardedToMe,
    };
  });

  return ok(res, enriched, "Cooperative bids and contracts retrieved successfully");
}

/**
 * Submit a collective bid for an institutional tender
 */
export async function submitContractBid(req: Request, res: Response) {
  if (!req.user || typeof req.user === "string") {
    return fail(res, "Unauthorized", null, 401);
  }

  const userId = req.user.userId || (req.user as any)?.id;
  const cooperative = await Cooperative.findOne({ userId });
  if (!cooperative) {
    return fail(res, "Cooperative profile not found", null, 404);
  }

  const coopId = cooperative._id as mongoose.Types.ObjectId;

  const { contractId, proposedAmount, proposedWorkersCount, proposalNotes } =
    req.body;

  if (!contractId || !mongoose.Types.ObjectId.isValid(contractId)) {
    return fail(res, "Invalid contract ID", null, 400);
  }

  const quote = Number(proposedAmount);
  const workers = Number(proposedWorkersCount);

  if (isNaN(quote) || quote <= 0) {
    return fail(res, "Please provide a valid proposed contract amount (₹)", null, 400);
  }

  if (isNaN(workers) || workers < 1) {
    return fail(res, "Please specify the number of member workers to mobilize", null, 400);
  }

  if (!proposalNotes || typeof proposalNotes !== "string" || !proposalNotes.trim()) {
    return fail(res, "Please provide proposal details or society execution notes", null, 400);
  }

  const contract = await InstitutionalContract.findById(contractId);
  if (!contract) {
    return fail(res, "Contract tender not found", null, 404);
  }

  if (
    contract.status !== ContractStatus.OPEN &&
    contract.status !== ContractStatus.BID_SUBMITTED
  ) {
    return fail(res, "This contract tender is no longer open for bidding", null, 400);
  }

  if (new Date(contract.deadlineDate).getTime() < Date.now()) {
    return fail(res, "The bidding deadline for this tender has already passed", null, 400);
  }

  // Check if cooperative already submitted a bid
  const existingBidIndex = contract.bids.findIndex(
    (b) => String(b.cooperative) === String(coopId)
  );

  if (existingBidIndex > -1) {
    // Update existing proposal
    contract.bids[existingBidIndex].proposedAmount = quote;
    contract.bids[existingBidIndex].proposedWorkersCount = workers;
    contract.bids[existingBidIndex].proposalNotes = proposalNotes.trim();
    contract.bids[existingBidIndex].submittedAt = new Date();
  } else {
    // Add new bid
    contract.bids.push({
      cooperative: coopId,
      proposedAmount: quote,
      proposedWorkersCount: workers,
      proposalNotes: proposalNotes.trim(),
      status: BidStatus.PENDING,
      submittedAt: new Date(),
    });
  }

  if (contract.status === ContractStatus.OPEN) {
    contract.status = ContractStatus.BID_SUBMITTED;
  }

  await contract.save();

  return ok(
    res,
    contract,
    existingBidIndex > -1
      ? "Society proposal updated successfully"
      : "Society tender bid submitted successfully!"
  );
}

/**
 * Allocate verified member workers to an awarded contract
 */
export async function allocateWorkersToContract(req: Request, res: Response) {
  if (!req.user || typeof req.user === "string") {
    return fail(res, "Unauthorized", null, 401);
  }

  const userId = req.user.userId || (req.user as any)?.id;
  const cooperative = await Cooperative.findOne({ userId });
  if (!cooperative) {
    return fail(res, "Cooperative profile not found", null, 404);
  }

  const coopId = cooperative._id as mongoose.Types.ObjectId;
  const contractId = String(req.params.contractId);

  if (!contractId || !mongoose.Types.ObjectId.isValid(contractId)) {
    return fail(res, "Invalid contract ID", null, 400);
  }

  const { workerIds } = req.body;
  if (!Array.isArray(workerIds) || workerIds.length === 0) {
    return fail(res, "Please select at least one member worker to allocate", null, 400);
  }

  const contract = await InstitutionalContract.findById(contractId);
  if (!contract) {
    return fail(res, "Contract tender not found", null, 404);
  }

  // Verify that the contract is awarded to this cooperative
  const isAwarded =
    String(contract.awardedCooperative) === String(coopId) ||
    contract.bids.some(
      (b) => String(b.cooperative) === String(coopId) && b.status === BidStatus.ACCEPTED
    );

  if (!isAwarded) {
    return fail(
      res,
      "Worker allocation is only permitted for contracts awarded to your cooperative",
      null,
      403
    );
  }

  // Validate that all workers belong to this cooperative and are approved
  const validWorkers = await Worker.find({
    _id: { $in: workerIds },
    cooperativeId: coopId,
    verificationStatus: VerificationStatus.APPROVED,
  }).select("_id");

  if (validWorkers.length === 0) {
    return fail(
      res,
      "None of the selected workers are verified members of your cooperative",
      null,
      400
    );
  }

  contract.allocatedWorkers = validWorkers.map(
    (w) => w._id as mongoose.Types.ObjectId
  );
  if (contract.status === ContractStatus.AWARDED) {
    contract.status = ContractStatus.IN_PROGRESS;
    contract.startDate = new Date();
  }

  await contract.save();

  const populated = await InstitutionalContract.findById(contract._id)
    .populate({
      path: "allocatedWorkers",
      populate: { path: "userId", select: "name phone email profilePicture" },
    })
    .lean();

  return ok(
    res,
    populated,
    `${validWorkers.length} member workers successfully mobilized for this contract!`
  );
}

/**
 * Summary metrics for collective tenders and bidding operations
 */
export async function getContractBidStats(req: Request, res: Response) {
  if (!req.user || typeof req.user === "string") {
    return fail(res, "Unauthorized", null, 401);
  }

  const userId = req.user.userId || (req.user as any)?.id;
  const cooperative = await Cooperative.findOne({ userId });
  if (!cooperative) {
    return fail(res, "Cooperative profile not found", null, 404);
  }

  const coopId = cooperative._id as mongoose.Types.ObjectId;

  const [
    openTendersCount,
    submittedBidsCount,
    awardedContracts,
    activeExecutingContracts,
  ] = await Promise.all([
    InstitutionalContract.countDocuments({
      status: { $in: [ContractStatus.OPEN, ContractStatus.BID_SUBMITTED] },
      deadlineDate: { $gte: new Date() },
    }),
    InstitutionalContract.countDocuments({
      "bids.cooperative": coopId,
    }),
    InstitutionalContract.find({
      $or: [
        { awardedCooperative: coopId },
        { "bids.cooperative": coopId, "bids.status": BidStatus.ACCEPTED },
      ],
    }).lean(),
    InstitutionalContract.find({
      status: ContractStatus.IN_PROGRESS,
      $or: [
        { awardedCooperative: coopId },
        { "bids.cooperative": coopId, "bids.status": BidStatus.ACCEPTED },
      ],
    }).lean(),
  ]);

  const totalContractRevenue = awardedContracts.reduce((sum, c) => {
    const myBid = c.bids.find(
      (b: any) => String(b.cooperative) === String(coopId)
    );
    return sum + (myBid?.proposedAmount || c.budget || 0);
  }, 0);

  // Collect unique allocated workers
  const allocatedWorkerIds = new Set<string>();
  awardedContracts.forEach((c) => {
    (c.allocatedWorkers || []).forEach((w: any) => {
      allocatedWorkerIds.add(String(w));
    });
  });

  return ok(
    res,
    {
      openTendersCount,
      submittedBidsCount,
      wonContractsCount: awardedContracts.length,
      activeProjectsCount: activeExecutingContracts.length,
      totalContractRevenue,
      mobilizedWorkersCount: allocatedWorkerIds.size,
    },
    "Contract bidding stats retrieved successfully"
  );
}
