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

}
