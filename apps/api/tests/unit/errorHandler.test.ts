import type { NextFunction, Request, Response } from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { errorHandler } from "../../src/middleware/errorHandler.ts";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

function mockRes() {
  const res = {
    headersSent: false,
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as unknown as Response;
}

describe("errorHandler", () => {
  it("maps P2025 to not_found without Error message", () => {
    const res = mockRes();
    errorHandler({ code: "P2025" }, {} as Request, res, vi.fn() as NextFunction);
    expect(res.statusCode).toBe(404);
    expect(
      (res as unknown as { body: { error: { message: string } } }).body.error.message,
    ).toBe("Resource not found");
  });

  it("maps P1001 to persistence_unavailable", () => {
    const res = mockRes();
    errorHandler({ code: "P1001" }, {} as Request, res, vi.fn() as NextFunction);
    expect(res.statusCode).toBe(503);
    expect(
      (res as unknown as { body: { error: { message: string } } }).body.error.message,
    ).toBe("Database unavailable");
  });

  it("maps ECONNREFUSED Error to persistence_unavailable", () => {
    const res = mockRes();
    errorHandler(new Error("ECONNREFUSED"), {} as Request, res, vi.fn() as NextFunction);
    expect(res.statusCode).toBe(503);
  });

  it("preserves validation_failed details", () => {
    const res = mockRes();
    const err = Object.assign(new Error("Invalid request body"), {
      code: "validation_failed" as const,
      details: { fields: { text: ["bad"] } },
    });
    errorHandler(err, {} as Request, res, vi.fn() as NextFunction);
    expect(res.statusCode).toBe(400);
    const body = (res as unknown as { body: { error: { details: unknown } } }).body;
    expect(body.error.details).toEqual({ fields: { text: ["bad"] } });
  });

  it("maps unsupported_field to 400", () => {
    const res = mockRes();
    errorHandler(
      Object.assign(new Error("nope"), { code: "unsupported_field" }),
      {} as Request,
      res,
      vi.fn() as NextFunction,
    );
    expect(res.statusCode).toBe(400);
  });

  it("returns internal_error for unknown codes", () => {
    const res = mockRes();
    errorHandler(
      Object.assign(new Error("oops"), { code: "weird" }),
      {} as Request,
      res,
      vi.fn() as NextFunction,
    );
    expect(res.statusCode).toBe(500);
  });

  it("omits details when details is not an object", () => {
    const res = mockRes();
    const err = Object.assign(new Error("x"), {
      code: "validation_failed",
      details: "nope",
    });
    errorHandler(err, {} as Request, res, vi.fn() as NextFunction);
    const body = (res as unknown as { body: { error: Record<string, unknown> } }).body;
    expect(body.error.details).toBeUndefined();
  });

  it("does not respond when headers already sent", () => {
    const status = vi.fn();
    const json = vi.fn();
    const res = { headersSent: true, status, json } as unknown as Response;
    errorHandler(new Error("late"), {} as Request, res, vi.fn() as NextFunction);
    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
  });
});
