import { todoCreateSchema } from "@todo/shared";
import type { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { validateBody } from "../middleware/validate.js";
import { serializeTodo } from "../util/serializeTodo.js";

/**
 * REST `/todos` router. PATCH/PUT/DELETE are implemented in later user-story
 * tasks; list + create are wired here so the stack is usable after Foundational.
 */
export function createTodosRouter(prisma: PrismaClient) {
  const r = Router();

  r.get("/", async (_req, res, next) => {
    try {
      const rows = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
      res.json(rows.map(serializeTodo));
    } catch (e) {
      next(e);
    }
  });

  r.post("/", validateBody(todoCreateSchema), async (req, res, next) => {
    try {
      const { text } = req.body as { text: string };
      const row = await prisma.todo.create({ data: { text } });
      res.status(201).json(serializeTodo(row));
    } catch (e) {
      next(e);
    }
  });

  return r;
}
