import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const id = (req.headers["x-request-id"] as string | undefined) ?? randomUUID();
  res.setHeader("X-Request-Id", id);
  (req as Request & { requestId: string }).requestId = id;
  next();
}
