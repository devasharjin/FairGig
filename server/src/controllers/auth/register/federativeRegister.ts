import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { UserRole } from "../../../models/auth/user.model";
import Federative from "../../../models/auth/federative.model";
import { VerificationStatus } from "../../../models/auth/worker.model";
import { fail, ok } from "../../../shared/envelope";
import { generateAuthTokens } from "../../../utils/jwt.utils";

export const federativeRegister = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // User ID attached by authentication middleware
  if (!req.user || typeof req.user === "string") {
    return fail(res, "Unauthorized", null, 401);
  }

  const userId = req.user.id || (req.user as any).userId;

  const {
    federativeName,
    federativeDescription,
    federativeAddress,
    federativePhone,
    federativeEmail,
    federativeLogo,
    members,
    services,
  } = req.body;

  // Check if federative profile already exists for this user
  const existingFederative = await Federative.findOne({ userId });
  if (existingFederative) {
    return fail(
      res,
      "Federative profile already exists for this user",
      null,
      409
    );
  }

  // Validate required fields
  if (
    !federativeName ||
    typeof federativeName !== "string" ||
    !federativeName.trim()
  ) {
    return fail(res, "Federative name is required", null, 400);
  }

  // Validate email format if provided
  if (federativeEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(federativeEmail)) {
      return fail(res, "Invalid federative email format", null, 400);
    }
  }

  // Validate members array if provided (references Cooperative ObjectIds)
  if (members !== undefined) {
    if (!Array.isArray(members)) {
      return fail(
        res,
        "Members must be an array of cooperative IDs",
        null,
        400
      );
    }
    const hasInvalidMember = members.some(
      (id: string) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (hasInvalidMember) {
      return fail(res, "One or more cooperative member IDs are invalid", null, 400);
    }
  }

  // Validate services array if provided
  if (services !== undefined && !Array.isArray(services)) {
    return fail(res, "Services must be an array of strings", null, 400);
  }

  // Create federative record
  const federative = await Federative.create({
    userId,
    federativeName: federativeName.trim(),
    federativeDescription: federativeDescription?.trim() || undefined,
    federativeAddress: federativeAddress?.trim() || undefined,
    federativePhone: federativePhone?.trim() || undefined,
    federativeEmail: federativeEmail?.trim() || undefined,
    federativeLogo: federativeLogo?.trim() || undefined,
    members: members || [],
    services: services || [],
    verificationStatus: VerificationStatus.PENDING,
  });

  // Add FEDERATION role to user's role array and retrieve updated user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { role: UserRole.FEDERATION } },
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
    { federative, user: updatedUser, tokens },
    "Federative registration submitted successfully"
  );
};
