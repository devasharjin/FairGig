import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { UserRole } from "../../models/user.model";
import Cooperative from "../../models/cooperative.model";
import { VerificationStatus } from "../../models/worker.model";
import { fail, ok } from "../../shared/envelope";
import { generateAuthTokens } from "../../utils/jwt.utils";

export const cooperativeRegister = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // User ID attached by authentication middleware
  if (!req.user || typeof req.user === "string") {
    return fail(res, "Unauthorized", null, 401);
  }

  const userId = req.user.id || (req.user as any).userId;

  const {
    cooperativeName,
    cooperativeDescription,
    cooperativeAddress,
    cooperativePhone,
    cooperativeEmail,
    cooperativeLogo,
    federationId,
    members,
    services,
  } = req.body;

  // Check if cooperative profile already exists for this user
  const existingCooperative = await Cooperative.findOne({ userId });
  if (existingCooperative) {
    return fail(
      res,
      "Cooperative profile already exists for this user",
      null,
      409
    );
  }

  // Validate required fields
  if (!cooperativeName || typeof cooperativeName !== "string" || !cooperativeName.trim()) {
    return fail(res, "Cooperative name is required", null, 400);
  }

  // Validate email format if provided
  if (cooperativeEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cooperativeEmail)) {
      return fail(res, "Invalid cooperative email format", null, 400);
    }
  }

  // Validate federationId if provided
  if (federationId && !mongoose.Types.ObjectId.isValid(federationId)) {
    return fail(res, "Invalid federation ID", null, 400);
  }

  // Validate members array if provided
  if (members !== undefined) {
    if (!Array.isArray(members)) {
      return fail(res, "Members must be an array of worker IDs", null, 400);
    }
    const hasInvalidMember = members.some(
      (id: string) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (hasInvalidMember) {
      return fail(res, "One or more member IDs are invalid", null, 400);
    }
  }

  // Validate services array if provided
  if (services !== undefined && !Array.isArray(services)) {
    return fail(res, "Services must be an array of strings", null, 400);
  }

  // Create cooperative
  const cooperative = await Cooperative.create({
    userId,
    cooperativeName: cooperativeName.trim(),
    cooperativeDescription: cooperativeDescription?.trim() || undefined,
    cooperativeAddress: cooperativeAddress?.trim() || undefined,
    cooperativePhone: cooperativePhone?.trim() || undefined,
    cooperativeEmail: cooperativeEmail?.trim() || undefined,
    cooperativeLogo: cooperativeLogo?.trim() || undefined,
    federationId: federationId || undefined,
    members: members || [],
    services: services || [],
    verificationStatus: VerificationStatus.PENDING,
  });

  // Add COOPERATIVE role to user's role array and retrieve updated user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { role: UserRole.COOPERATIVE } },
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
    { cooperative, user: updatedUser, tokens },
    "Cooperative registration submitted successfully"
  );
};
