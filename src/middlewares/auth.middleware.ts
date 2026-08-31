import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpResponse } from "../utils/response.js";

export interface TokenPayload {
  id: number;
  email: string;
  fullname: string;
  role: "CREDIT_ADMIN" | "CREDIT_ANALYST";
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = (_req: Request, res: Response, next: NextFunction) => {
  const authHeader = _req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return HttpResponse.fail(res, 401, "Invalid credentials");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return HttpResponse.fail(res, 401, "Invalid credentials");
  }

  try {
    const secret = process.env.JWT_SECRET || "defaultsecret";
    const decoded = jwt.verify(token, secret) as TokenPayload;
    _req.user = decoded;
    next();
  } catch {
    return HttpResponse.fail(res, 401, "Invalid credentials");
  }
};

export const requireRole = (...allowedRoles: Array<"CREDIT_ADMIN" | "CREDIT_ANALYST">) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    if (!_req.user) {
      return HttpResponse.fail(res, 401, "Invalid credentials");
    }

    if (!allowedRoles.includes(_req.user.role)) {
      return HttpResponse.fail(res, 403, "You don't have permission to access this resource");
    }

    next();
  };
};
