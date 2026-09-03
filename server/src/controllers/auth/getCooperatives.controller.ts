import { Request, Response } from "express";
import Cooperative from "../../models/cooperative.model";
import { ok } from "../../shared/envelope";

export const getCooperatives = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const cooperatives = await Cooperative.find(
    {},
    "_id cooperativeName cooperativeDescription cooperativeAddress cooperativePhone services verificationStatus"
  ).sort({ cooperativeName: 1 });

  return ok(res, cooperatives, "Cooperatives retrieved successfully");
};
