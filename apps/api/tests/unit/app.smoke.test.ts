import request from "supertest";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../src/app.ts";
import type { PrismaClient } from "@prisma/client";

function mockPrisma(): PrismaClient {
  return {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $queryRaw: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
    todo: {
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({
        id: "00000000-0000-4000-8000-000000000001",
        text: "mock",
        completed: false,
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-01-01T00:00:00.000Z"),
      }),
      update: vi.fn().mockResolvedValue({
        id: "00000000-0000-4000-8000-000000000001",
        text: "mock",
        completed: true,
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-06-03T12:00:00.000Z"),
      }),
      delete: vi.fn().mockResolvedValue({
        id: "00000000-0000-4000-8000-000000000001",
        text: "mock",
        completed: false,
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
        updatedAt: new Date("2025-01-01T00:00:00.000Z"),
      }),
    },
  } as unknown as PrismaClient;
}

describe("createApp (mocked prisma)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("GET /health returns ok", async () => {
    const app = createApp(mockPrisma());
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("GET /todos returns JSON array", async () => {
    const app = createApp(mockPrisma());
    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("GET /health includes version when APP_VERSION is set", async () => {
    vi.stubEnv("APP_VERSION", "9.9.9");
    const app = createApp(mockPrisma());
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok", version: "9.9.9" });
  });

  it("GET /health returns 503 when database query fails", async () => {
    const prisma = mockPrisma();
    vi.mocked(prisma.$queryRaw).mockRejectedValueOnce(new Error("db down"));
    const app = createApp(prisma);
    const res = await request(app).get("/health");
    expect(res.status).toBe(503);
    expect(res.body.error.code).toBe("persistence_unavailable");
  });

  it("GET /todos serializes persisted rows", async () => {
    const prisma = mockPrisma();
    const row = {
      id: "00000000-0000-4000-8000-000000000002",
      text: "from-db",
      completed: true,
      createdAt: new Date("2025-06-01T12:00:00.000Z"),
      updatedAt: new Date("2025-06-02T12:00:00.000Z"),
    };
    vi.mocked(prisma.todo.findMany).mockResolvedValueOnce([row]);
    const app = createApp(prisma);
    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: row.id,
        text: row.text,
        completed: true,
        createdAt: "2025-06-01T12:00:00.000Z",
        updatedAt: "2025-06-02T12:00:00.000Z",
      },
    ]);
  });

  it("POST /todos creates and returns 201", async () => {
    const app = createApp(mockPrisma());
    const res = await request(app).post("/todos").send({ text: "hello" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      text: "mock",
      completed: false,
      id: "00000000-0000-4000-8000-000000000001",
    });
  });

  it("POST /todos validates body", async () => {
    const app = createApp(mockPrisma());
    const res = await request(app).post("/todos").send({ text: "   " });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("validation_failed");
  });

  it("PATCH /todos/:id updates completed", async () => {
    const app = createApp(mockPrisma());
    const res = await request(app)
      .patch("/todos/00000000-0000-4000-8000-000000000001")
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
    expect(res.body.text).toBe("mock");
  });

  it("DELETE /todos/:id returns 204", async () => {
    const app = createApp(mockPrisma());
    const res = await request(app).delete("/todos/00000000-0000-4000-8000-000000000001");
    expect(res.status).toBe(204);
    expect(res.text).toBe("");
  });
});
