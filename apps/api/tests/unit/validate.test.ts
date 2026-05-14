import express from "express";
import request from "supertest";
import { z } from "zod";
import { describe, expect, it } from "vitest";
import { validateBody, validateParams } from "../../src/middleware/validate.ts";

describe("validate middleware", () => {
  it("validateBody passes parsed data to handler", async () => {
    const app = express();
    app.use(express.json());
    app.post("/", validateBody(z.object({ text: z.string().min(1) })), (req, res) => {
      res.json({ text: (req.body as { text: string }).text });
    });

    const res = await request(app).post("/").send({ text: "ok" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ text: "ok" });
  });

  it("validateParams passes parsed params", async () => {
    const app = express();
    const id = "00000000-0000-4000-8000-000000000001";
    app.get("/:id", validateParams(z.object({ id: z.string().uuid() })), (req, res) => {
      type Req = express.Request & { validatedParams: { id: string } };
      res.json({ id: (req as Req).validatedParams.id });
    });

    const res = await request(app).get(`/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id });
  });

  it("validateParams rejects invalid params", async () => {
    const app = express();
    app.get("/:id", validateParams(z.object({ id: z.string().uuid() })), (_req, res) => {
      res.json({ ok: true });
    });
    app.use(
      (
        err: unknown,
        _req: express.Request,
        res: express.Response,
        next: express.NextFunction,
      ) => {
        void next;
        const code =
          err && typeof err === "object" && "code" in err
            ? (err as { code: string }).code
            : "error";
        res.status(400).json({ code });
      },
    );

    const res = await request(app).get("/not-a-uuid");
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("validation_failed");
  });
});
