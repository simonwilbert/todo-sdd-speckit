import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app.ts";
import { prisma } from "../../src/db/client.ts";

const runIntegration = Boolean(process.env.DATABASE_URL);

describe.skipIf(!runIntegration)("US3 integration: DELETE /todos/:id", () => {
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

  it("DELETE returns 204 and removes the todo", async () => {
    const created = await request(app).post("/todos").send({ text: "Remove me" });
    expect(created.status).toBe(201);
    const id = created.body.id as string;

    const del = await request(app).delete(`/todos/${id}`);
    expect(del.status).toBe(204);
    expect(del.text).toBe("");

    const list = await request(app).get("/todos");
    expect(list.status).toBe(200);
    expect(list.body).toEqual([]);
  });

  it("DELETE returns 404 for unknown id (idempotent semantics)", async () => {
    const res = await request(app).delete("/todos/00000000-0000-4000-8000-000000000099");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("not_found");
  });

  it("DELETE returns 400 for invalid id", async () => {
    const res = await request(app).delete("/todos/not-a-uuid");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("validation_failed");
  });
});
