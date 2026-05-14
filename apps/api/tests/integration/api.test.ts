import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/app.ts";
import { prisma } from "../../src/db/client.ts";

const runIntegration = Boolean(process.env.DATABASE_URL);

describe.skipIf(!runIntegration)("API integration (DATABASE_URL)", () => {
  const app = createApp(prisma);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok" });
  });

  it("GET /todos returns array", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /todos creates a todo", async () => {
    const res = await request(app).post("/todos").send({ text: "  CI smoke  " });
    expect(res.status).toBe(201);
    expect(res.body.text).toBe("CI smoke");
    expect(res.body.completed).toBe(false);
    await prisma.todo.delete({ where: { id: res.body.id } });
  });
});
