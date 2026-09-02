import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserPayload } from "../types/express.js";
import { fail } from "../shared/envelope.js";


type Role = "admin" | "faculty" | "student" | "customer";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken;

  if (!token) {
    return fail(res, "Unauthorized", null, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
    if (!decoded) {
      throw new Error("Invalid token");
    }
    req.user = decoded;
    next();
  } catch (error) {
    return fail(res, "Forbidden", null, 403);
  }
}


export function requireRole(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.user ||
      typeof req.user === "string" ||
      !allowedRoles.includes(req.user.role as Role)
    ) {
      return fail(res, "Forbidden", null, 403);
    }

    next();
  };
}
