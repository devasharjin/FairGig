import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { UserRole } from "../../models/user.model";
import Worker, {
  AvailabilityStatus,
  VerificationStatus,
} from "../../models/worker.model";
import { fail, ok } from "../../shared/envelope";
import { generateAuthTokens } from "../../utils/jwt.utils";


export const workerRegister = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // User ID should be attached by authentication middleware
  if (!req.user || typeof req.user === "string") {
    return fail(res, "Unauthorized", null, 401);
  }

  const userId = req.user.id || (req.user as any).userId;

  const {
    cooperativeId,
    federationId,
    skills,
    availability,
    yearsOfExperience,
    address,
  } = req.body;

  // Check if worker profile already exists
  const existingWorker = await Worker.findOne({ userId });

  if (existingWorker) {
    return fail(
      res,
      "Worker profile already exists for this user",
      null,
      409
    );
  }

  // Validate skills
  if (!Array.isArray(skills) || skills.length === 0) {
    return fail(res, "At least one skill is required", null, 400);
  }

  // Validate availability
  if (
    availability &&
    !Object.values(AvailabilityStatus).includes(availability)
  ) {
    return fail(res, "Invalid availability status", null, 400);
  }

  // Validate experience
  if (
    yearsOfExperience !== undefined &&
    (typeof yearsOfExperience !== "number" || yearsOfExperience < 0)
  ) {
    return fail(
      res,
      "Years of experience must be a non-negative number",
      null,
      400
    );
  }

  // Validate ObjectIds if provided
  if (
    cooperativeId &&
    !mongoose.Types.ObjectId.isValid(cooperativeId)
  ) {
    return fail(res, "Invalid cooperative ID", null, 400);
  }

  if (
    federationId &&
    !mongoose.Types.ObjectId.isValid(federationId)
  ) {
    return fail(res, "Invalid federation ID", null, 400);
  }

  // Create worker
  const worker = await Worker.create({
    userId,
    cooperativeId: cooperativeId || undefined,
    federationId: federationId || undefined,
    skills,
    availability: availability || AvailabilityStatus.FULL_TIME,
    yearsOfExperience: yearsOfExperience ?? 0,
    verificationStatus: VerificationStatus.PENDING,
    rating: 0,
    address: address || undefined,
  });

  // Add WORKER role to user's role array and retrieve updated user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { role: UserRole.WORKER } },
    { new: true }
  );

  let tokens;
  if (updatedUser) {
    tokens = generateAuthTokens(updatedUser);
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      path: "/",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  return ok(
    res,
    { worker, user: updatedUser, tokens },
    "Worker registration submitted successfully"
  );
};