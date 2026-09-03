import { Request, Response } from "express";
import { fail, ok } from "../../shared/envelope";
import { hashPassword } from "../../utils/password";
import User, { UserRole } from "../../models/user.model";
import { generateAuthTokens } from "../../utils/jwt.utils";

export async function userRegister(req: Request, res: Response) {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return fail(res, "Missing required fields", null, 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return fail(res, "Invalid email format", null, 400);
  }

  if (password.length < 8) {
    return fail(res, "Password must be at least 8 characters long", null, 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return fail(res, "User already exists", null, 400);
  }

  const hashedPassword = await hashPassword(password);

  const customer = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role: [UserRole.CUSTOMER],
  });
  
  const tokens = generateAuthTokens(customer);

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
    maxAge: 15 * 60 * 1000,
  });

  // Set Refresh Token in HTTP-Only Cookie
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  const userResponse = {
    _id: customer._id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    role: customer.role,
    accountStatus: customer.accountStatus,
    profilePicture: customer.profilePicture,
  };

  return ok(
    res,
    { user: userResponse, tokens },
    "Customer registered successfully"
  );
}