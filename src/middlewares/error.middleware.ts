import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HttpError } from "../utils/custom-error.js";
import { HttpResponse } from "../utils/response.js";

export const errorHandler: ErrorRequestHandler = (
  err: Error | HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof HttpError) {
    return HttpResponse.fail(res, err.statusCode, err.message, err.errors);
  }

  console.error("Unhandled Error:", err);
  return HttpResponse.error(res, 500, "Internal server error");
};
