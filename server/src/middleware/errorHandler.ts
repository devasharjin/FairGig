
import type { NextFunction, Request, Response } from "express";
import { fail } from "../shared/envelope";
import { AppError } from "../shared/appError";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppError) {
        return fail(res, err.message, null, err.statusCode)
    }
    else {
        return fail(res, "Internal Server Error", null, 500)
    }
}   