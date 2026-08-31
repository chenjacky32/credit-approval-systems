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
router.get("/",authenticate,requireRole("CREDIT_ADMIN","CREDIT_ANALYST"),validateQuery(QuerySubmissionListSchema),submissionController.getList);
router.get("/:id", authenticate,requireRole("CREDIT_ADMIN","CREDIT_ANALYST"),submissionController.getDetail);
router.patch("/:id/status",authenticate,requireRole("CREDIT_ANALYST"),validateBody(UpdateSubmissionStatusSchema),submissionController.updateStatus);

export default router;
