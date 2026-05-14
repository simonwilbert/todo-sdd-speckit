import type { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestIdMiddleware } from "./middleware/requestId.js";
import { securityHeaders } from "./middleware/securityHeaders.js";
import { createHealthRouter } from "./routes/health.js";
import { createTodosRouter } from "./routes/todos.js";

export function createApp(prisma: PrismaClient) {
  const app = express();
  app.disable("x-powered-by");
  app.use(securityHeaders);
  app.use(requestIdMiddleware);
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()) ?? true,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "32kb" }));

  app.use(createHealthRouter(prisma));
  app.use("/todos", createTodosRouter(prisma));

  app.use(errorHandler);
  return app;
}
