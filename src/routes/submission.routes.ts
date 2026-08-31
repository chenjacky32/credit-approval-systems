import { Router } from "express";
import { submissionController } from "../controllers/submission.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.middleware.js";
import { validateBody, validateQuery } from "../middlewares/validate.middleware.js";
import {
  CreateSubmissionSchema,
  QuerySubmissionListSchema,
  UpdateSubmissionStatusSchema,
} from "../dto/submission.dto.js";

const router = Router();

router.post("/",authenticate, requireRole("CREDIT_ADMIN"),validateBody(CreateSubmissionSchema),submissionController.create);

export default router;
