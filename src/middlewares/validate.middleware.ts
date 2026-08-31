import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { HttpResponse } from "../utils/response.js";

export const validateBody = (schema: ZodSchema) => {
  return async (_req: Request, res: Response, next: NextFunction) => {
    try {
      _req.body = await schema.parseAsync(_req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};
        for (const issue of error.issues) {
          const field = issue.path.join(".") || "general";
          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }
          formattedErrors[field].push(issue.message);
        }
        return HttpResponse.fail(res, 422, "Validation error", formattedErrors);
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.query);
      req.query = parsed as Record<string, any>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {};
        for (const issue of error.issues) {
          const field = issue.path.join(".") || "general";
          if (!formattedErrors[field]) {
            formattedErrors[field] = [];
          }
          formattedErrors[field].push(issue.message);
        }
        return HttpResponse.fail(res, 422, "Validation error", formattedErrors);
      }
      next(error);
    }
  };
};
