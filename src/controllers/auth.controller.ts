import { Request, Response, NextFunction } from "express";
import { authService, AuthService } from "../services/auth.service.js";
import { HttpResponse } from "../utils/response.js";
import { LoginDTO, RegisterDTO } from "../dto/auth.dto.js";

export class AuthController {
  constructor(
    private service: AuthService = authService
  ) {}

  login = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.login(_req.body as LoginDTO);
      return HttpResponse.success(res, 200, "Login Successfull", data);
    } catch (error) {
      next(error);
    }
  };

  register = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.register(_req.body as RegisterDTO);
      return HttpResponse.success(
        res,
        201,
        result.message
      );
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
