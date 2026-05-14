import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app.ts";
import { prisma } from "../../src/db/client.ts";

const runIntegration = Boolean(process.env.DATABASE_URL);

describe.skipIf(!runIntegration)("PUT /todos/:id full replace (OpenAPI)", () => {
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

  it("PUT replaces text and completed", async () => {
    const created = await request(app).post("/todos").send({ text: "Original" });
    expect(created.status).toBe(201);
    const id = created.body.id as string;

    const replaced = await request(app)
      .put(`/todos/${id}`)
      .send({ text: "Replaced text", completed: true });
    expect(replaced.status).toBe(200);
    expect(replaced.body).toMatchObject({
      id,
      text: "Replaced text",
      completed: true,
    });
    expect(replaced.body.createdAt).toBe(created.body.createdAt);
    expect(new Date(replaced.body.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(created.body.updatedAt).getTime(),
    );
  });

  it("PUT returns 404 for unknown id", async () => {
    const res = await request(app)
      .put("/todos/00000000-0000-4000-8000-000000000099")
      .send({ text: "x", completed: false });
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("not_found");
  });

  it("PUT returns 400 for invalid id", async () => {
    const res = await request(app)
      .put("/todos/not-a-uuid")
      .send({ text: "x", completed: false });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("validation_failed");
  });

  it("PUT returns 400 when body omits completed", async () => {
    const created = await request(app).post("/todos").send({ text: "y" });
    const id = created.body.id as string;
    const res = await request(app).put(`/todos/${id}`).send({ text: "only text" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("validation_failed");
  });

  it("PUT returns 400 when text is empty after trim", async () => {
    const created = await request(app).post("/todos").send({ text: "z" });
    const id = created.body.id as string;
    const res = await request(app)
      .put(`/todos/${id}`)
      .send({ text: "   ", completed: false });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("validation_failed");
  });

  it("PUT returns 400 for strict-schema extra fields", async () => {
    const created = await request(app).post("/todos").send({ text: "z" });
    const id = created.body.id as string;
    const res = await request(app)
      .put(`/todos/${id}`)
      .send({ text: "ok", completed: false, extra: 1 });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("validation_failed");
  });
});
