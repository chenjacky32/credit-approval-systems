import express, { Express } from "express";
import cors from "cors";

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export default app;
