import type { PrismaClient } from "@prisma/client";
import { Router } from "express";

export function createHealthRouter(prisma: PrismaClient) {
  const r = Router();

  r.get("/health", async (_req, res, next) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      const body = {
        status: "ok" as const,
        ...(process.env.APP_VERSION ? { version: process.env.APP_VERSION } : {}),
      };
      res.json(body);
    } catch {
      next(
        Object.assign(new Error("Database unreachable"), {
          code: "persistence_unavailable",
        }),
      );
    }
  });

  return r;
}
