import { todoCreateSchema } from "@todo/shared";
import type { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { validateBody } from "../middleware/validate.js";
import * as todoService from "../services/todoService.js";

/**
 * REST `/todos` router. PATCH/PUT/DELETE are implemented in later user-story
 * tasks; list + create are wired here so the stack is usable after Foundational.
 */
export function createTodosRouter(prisma: PrismaClient) {
  const r = Router();

  r.get("/", async (_req, res, next) => {
    try {
      const todos = await todoService.listTodos(prisma);
      res.json(todos);
    } catch (e) {
      next(e);
    }
  });

  r.post("/", validateBody(todoCreateSchema), async (req, res, next) => {
    try {
      const { text } = req.body as { text: string };
      const todo = await todoService.createTodo(prisma, text);
      res.status(201).json(todo);
    } catch (e) {
      next(e);
    }
  });

  return r;
}
