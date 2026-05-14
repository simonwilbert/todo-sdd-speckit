import type { Request, Response } from "express";
import { describe, expect, it } from "vitest";
import { securityHeaders } from "../../src/middleware/securityHeaders.ts";

describe("securityHeaders", () => {
  it("sets security headers and calls next", () => {
    const headers: Record<string, string> = {};
    const res = {
      setHeader(k: string, v: string) {
        headers[k] = v;
      },
    } as unknown as Response;
    let nextCalled = false;
    securityHeaders({} as Request, res, () => {
      nextCalled = true;
    });
    expect(nextCalled).toBe(true);
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  });

  it("uses Content-Security-Policy-Report-Only when CSP_REPORT_ONLY=true", () => {
    const prev = process.env.CSP_REPORT_ONLY;
    process.env.CSP_REPORT_ONLY = "true";
    try {
      const headers: Record<string, string> = {};
      const res = {
        setHeader(k: string, v: string) {
          headers[k] = v;
        },
      } as unknown as Response;
      securityHeaders({} as Request, res, () => {});
      expect(headers["Content-Security-Policy-Report-Only"]).toBeDefined();
      expect(headers["Content-Security-Policy"]).toBeUndefined();
    } finally {
      if (prev === undefined) delete process.env.CSP_REPORT_ONLY;
      else process.env.CSP_REPORT_ONLY = prev;
    }
  });
});
