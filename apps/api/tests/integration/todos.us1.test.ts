import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app.ts";
import { prisma } from "../../src/db/client.ts";

const runIntegration = Boolean(process.env.DATABASE_URL);

describe.skipIf(!runIntegration)("US1 integration: list + create + persistence", () => {
  const app = createApp(prisma);

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.todo.deleteMany();
  });

  it("GET /todos returns empty array when there are no todos", async () => {
    const res = await request(app).get("/todos");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("POST /todos persists trimmed text and GET /todos returns it newest-first", async () => {
    const create = await request(app).post("/todos").send({ text: "  first task  " });
    expect(create.status).toBe(201);
    expect(create.body.text).toBe("first task");
    expect(create.body.completed).toBe(false);
    expect(typeof create.body.id).toBe("string");

    const list1 = await request(app).get("/todos");
    expect(list1.status).toBe(200);
    expect(list1.body).toHaveLength(1);
    expect(list1.body[0].id).toBe(create.body.id);
    expect(list1.body[0].text).toBe("first task");

    const create2 = await request(app).post("/todos").send({ text: "second" });
    expect(create2.status).toBe(201);

    const list2 = await request(app).get("/todos");
    expect(list2.status).toBe(200);
    expect(list2.body).toHaveLength(2);
    expect(list2.body[0].text).toBe("second");
    expect(list2.body[1].text).toBe("first task");
  });

  it("POST /todos rejects empty / whitespace-only text", async () => {
    const res = await request(app).post("/todos").send({ text: "   " });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("validation_failed");
  });

  it("POST /todos rejects text longer than 500 characters", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ text: "x".repeat(501) });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("validation_failed");
  });
});
