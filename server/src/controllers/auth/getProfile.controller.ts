import { Request, Response } from "express";
import User, { UserRole } from "../../models/auth/user.model";
import Worker from "../../models/auth/worker.model";
import Cooperative from "../../models/auth/cooperative.model";
import { fail, ok } from "../../shared/envelope";

export async function getProfile(req: Request, res: Response) {
  // 1. Verify user payload from auth middleware
  if (!req.user || typeof req.user === "string") {
    return fail(res, "Unauthorized", null, 401);
  }

  const userId = (req.user as any).userId || (req.user as any).id;

  // 2. Fetch base user document
  const user = await User.findById(userId);
  if (!user) {
    return fail(res, "User not found", null, 404);
  }

  let worker: any = null;
  let cooperative: any = null;

  // 3. Fetch role-specific profile details
  if (user.role.includes(UserRole.WORKER) || user.role.includes(UserRole.CUSTOMER)) {
    worker = await Worker.findOne({ userId }).populate("cooperativeId");
  }

  if (user.role.includes(UserRole.COOPERATIVE)) {
    cooperative = await Cooperative.findOne({ userId }).populate("members");
  }

  const profile = worker || cooperative || null;

  return ok(
    res,
    {
      user,
      worker,
      cooperative,
      profile,
    },
    "User profile retrieved successfully"
  );
}
