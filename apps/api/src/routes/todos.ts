import { todoCreateSchema, todoIdParamSchema, todoPatchSchema } from "@todo/shared";
import type { PrismaClient } from "@prisma/client";
import type { Request } from "express";
import { Router } from "express";
import { validateBody, validateParams } from "../middleware/validate.js";
import * as todoService from "../services/todoService.js";

type ParamsId = Request & { validatedParams: { id: string } };

/**
 * REST `/todos` router. PUT/DELETE follow in later user-story tasks.
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

  r.patch(
    "/:id",
    validateParams(todoIdParamSchema),
    validateBody(todoPatchSchema),
    async (req, res, next) => {
      try {
        const { id } = (req as ParamsId).validatedParams;
        const body = req.body as { text?: string; completed?: boolean };
        const todo = await todoService.updateTodoPatch(prisma, id, body);
        res.json(todo);
      } catch (e) {
        next(e);
      }
    },
  );

  return r;
}
