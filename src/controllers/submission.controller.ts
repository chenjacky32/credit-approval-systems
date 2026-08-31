import { Request, Response, NextFunction } from "express";
import { submissionService, SubmissionService } from "../services/submission.service.js";
import { HttpResponse } from "../utils/response.js";
import {
  CreateSubmissionDTO,
  QuerySubmissionListDTO,
  UpdateSubmissionStatusDTO,
} from "../dto/submission.dto.js";

export class SubmissionController {
  constructor(
    private service: SubmissionService = submissionService
  ) {}

  create = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (!_req.user) {
        return HttpResponse.fail(res, 401, "Invalid credentials");
      }
      const data = await this.service.createSubmission(
        _req.user.id,
        _req.body as CreateSubmissionDTO
      );
      return HttpResponse.success(res, 201, "Submission created successfully", data);
    } catch (error) {
      next(error);
    }
  };

  getList = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (!_req.user) {
        return HttpResponse.fail(res, 401, "Invalid credentials");
      }
      const query = _req.query as unknown as QuerySubmissionListDTO;
      
      // Filter by userId if role is CREDIT_ADMIN
      const userId = _req.user.role === "CREDIT_ADMIN" ? _req.user.id : undefined;

      const { data, meta } = await this.service.getSubmissions(query, userId);
      return HttpResponse.success(res, 200, "Submission list retrieved successfully", data, meta);
    } catch (error) {
      next(error);
    }
  };

  getDetail = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (!_req.user) {
        return HttpResponse.fail(res, 401, "Invalid credentials");
      }
      const id = Number(_req.params.id);
      if (isNaN(id)) {
        return HttpResponse.fail(res, 400, "Invalid submission ID");
      }
      const data = await this.service.getSubmissionDetail(id, { id: _req.user.id, role: _req.user.role });
      return HttpResponse.success(res, 200, "Submission detail retrieved successfully", data);
    } catch (error) {
      next(error);
    }
  };

}
