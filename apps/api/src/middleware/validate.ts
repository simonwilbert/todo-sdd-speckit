import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const err = Object.assign(new Error("Invalid request body"), {
        code: "validation_failed" as const,
        details: {
          fields: parsed.error.flatten().fieldErrors,
        },
      });
      return next(err);
    }
    req.body = parsed.data;
    next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.params);
    if (!parsed.success) {
      const err = Object.assign(new Error("Invalid path parameters"), {
        code: "validation_failed" as const,
        details: { fields: parsed.error.flatten().fieldErrors },
      });
      return next(err);
    }
    (req as Request & { validatedParams: T }).validatedParams = parsed.data;
    next();
  };
}
