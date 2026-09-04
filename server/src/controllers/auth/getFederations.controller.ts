import { Request, Response } from "express";
import Federative from "../../models/auth/federative.model";
import { ok } from "../../shared/envelope";

export const getFederations = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  const federations = await Federative.find(
    {},
    "_id federativeName federativeDescription federativeAddress federativePhone services verificationStatus"
  ).sort({ federativeName: 1 });

  return ok(res, federations, "Federations retrieved successfully");
};
