import { z } from "zod";

const trimmedText = z
  .string()
  .transform((s) => s.trim())
  .pipe(z.string().min(1).max(500));

export const errorCodeSchema = z.enum([
  "validation_failed",
  "not_found",
  "unsupported_field",
  "persistence_unavailable",
  "internal_error",
]);

export const todoCreateSchema = z
  .object({
    text: trimmedText,
  })
  .strict();

export const todoPatchSchema = z
  .object({
    text: trimmedText.optional(),
    completed: z.boolean().optional(),
  })
  .strict()
  .refine((v) => v.text !== undefined || v.completed !== undefined, {
    message: "At least one of text or completed is required",
  });

export const todoReplaceSchema = z
  .object({
    text: trimmedText,
    completed: z.boolean(),
  })
  .strict();

export const todoIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const todoSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(500),
  completed: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const apiErrorEnvelopeSchema = z.object({
  error: z.object({
    code: errorCodeSchema,
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
});

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  version: z.string().optional(),
});
