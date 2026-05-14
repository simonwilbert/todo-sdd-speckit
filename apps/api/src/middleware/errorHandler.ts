import type { ApiErrorEnvelope } from "@todo/shared";
import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  void _next;
  console.error(err);

  if (res.headersSent) {
    return;
  }

  const code = getCode(err);
  const status = getStatus(code);

  const body: ApiErrorEnvelope = {
    error: {
      code,
      message: getMessage(err, code),
      ...getDetails(err),
    },
  };

  res.status(status).json(body);
}

function getCode(
  err: unknown,
):
  | "validation_failed"
  | "not_found"
  | "unsupported_field"
  | "persistence_unavailable"
  | "internal_error" {
  if (isPrismaRecordNotFound(err)) {
    return "not_found";
  }
  if (isPrismaConnectivity(err)) {
    return "persistence_unavailable";
  }
  if (err && typeof err === "object" && "code" in err) {
    const c = (err as { code: string }).code;
    if (
      c === "validation_failed" ||
      c === "not_found" ||
      c === "unsupported_field" ||
      c === "persistence_unavailable"
    ) {
      return c;
    }
  }
  return "internal_error";
}

function getStatus(
  code:
    | "validation_failed"
    | "not_found"
    | "unsupported_field"
    | "persistence_unavailable"
    | "internal_error",
): number {
  switch (code) {
    case "validation_failed":
    case "unsupported_field":
      return 400;
    case "not_found":
      return 404;
    case "persistence_unavailable":
      return 503;
    default:
      return 500;
  }
}

function getMessage(
  err: unknown,
  code:
    | "validation_failed"
    | "not_found"
    | "unsupported_field"
    | "persistence_unavailable"
    | "internal_error",
): string {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  if (code === "not_found") {
    return "Resource not found";
  }
  if (code === "persistence_unavailable") {
    return "Database unavailable";
  }
  return "Internal server error";
}

function getDetails(err: unknown): { details?: Record<string, unknown> } {
  if (err && typeof err === "object" && "details" in err) {
    const d = (err as { details: unknown }).details;
    if (d && typeof d === "object") {
      return { details: d as Record<string, unknown> };
    }
  }
  return {};
}

function isPrismaRecordNotFound(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "P2025"
  );
}

function isPrismaConnectivity(err: unknown): boolean {
  if (typeof err !== "object" || err === null) {
    return false;
  }
  const code = "code" in err ? String((err as { code: unknown }).code) : "";
  return (
    code === "P1001" ||
    code === "P1002" ||
    code === "P1017" ||
    (err instanceof Error && /connect|ECONNREFUSED/i.test(err.message))
  );
}
