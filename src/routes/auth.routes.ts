import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { LoginSchema, RegisterSchema } from "../dto/auth.dto.js";

const router = Router();

router.post("/login", validateBody(LoginSchema), authController.login);
router.post("/register", validateBody(RegisterSchema), authController.register);

export default router;
