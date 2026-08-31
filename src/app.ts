import express, { Express, Request, Response } from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { HttpResponse } from "./utils/response.js";

const app: Express = express();

// Middleware Setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes Setup
app.use("/api", apiRouter);

// Error 404 Handler Setup
app.use((_req: Request, res: Response) => {
  HttpResponse.fail(res, 404, "Endpoint not found");
});

// Global Error Handler Setup
app.use(errorHandler);

export default app;
