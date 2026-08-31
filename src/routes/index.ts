import { Router } from "express";
import authRoutes from "./auth.routes.js";
import submissionRoutes from "./submission.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/submission", submissionRoutes);

export default apiRouter;
