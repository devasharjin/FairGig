import "express";
import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  userId?: string;
  id?: string;
  email?: string;
  name?: string;
  role?: string[] | string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload | string;
    }
  }
}