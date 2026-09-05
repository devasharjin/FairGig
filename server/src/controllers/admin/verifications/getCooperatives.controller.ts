import { Request, Response } from "express";
import Cooperative from "../../../models/auth/cooperative.model";
import User from "../../../models/auth/user.model";
import { VerificationStatus } from "../../../models/auth/worker.model";
import { ok } from "../../../shared/envelope";

/**
 * Get all cooperatives for admin verification with status filter, search & pagination
 */
export async function getAdminCooperatives(req: Request, res: Response) {
  const { status, search, page = 1, limit = 20 } = req.query;

  const query: Record<string, any> = {};

  // Filter by verification status if specified and not 'All'
  if (
    status &&
    typeof status === "string" &&
    status !== "All" &&
    Object.values(VerificationStatus).includes(status as VerificationStatus)
  ) {
    query.verificationStatus = status;
  }

  // Search by cooperative name, email, phone, address, or applicant name
  if (search && typeof search === "string" && search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    // Also match associated user names/emails
    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } },
      ],
    }).select("_id");

    const matchingUserIds = matchingUsers.map((u) => u._id);

    query.$or = [
      { cooperativeName: { $regex: searchRegex } },
      { cooperativeEmail: { $regex: searchRegex } },
      { cooperativePhone: { $regex: searchRegex } },
      { cooperativeAddress: { $regex: searchRegex } },
      { userId: { $in: matchingUserIds } },
    ];
  }

  // Count statistics for tabs
  const [totalCount, pendingCount, approvedCount, rejectedCount] =
    await Promise.all([
      Cooperative.countDocuments({}),
      Cooperative.countDocuments({
        verificationStatus: VerificationStatus.PENDING,
      }),
      Cooperative.countDocuments({
        verificationStatus: VerificationStatus.APPROVED,
      }),
      Cooperative.countDocuments({
        verificationStatus: VerificationStatus.REJECTED,
      }),
    ]);

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  // Fetch cooperatives populated with applicant user details
  const cooperatives = await Cooperative.find(query)
    .populate("userId", "name email phone profilePicture accountStatus createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  const filteredTotal = await Cooperative.countDocuments(query);
  const totalPages = Math.ceil(filteredTotal / limitNum);

  return ok(
    res,
    {
      cooperatives,
      counts: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems: filteredTotal,
        totalPages,
      },
    },
    "Cooperatives retrieved successfully"
  );
}
