import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/app.ts";
import { prisma } from "../../src/db/client.ts";

const runIntegration = Boolean(process.env.DATABASE_URL);

describe.skipIf(!runIntegration)(
  "US2 integration: PATCH /todos/:id toggle completed",
  () => {
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

    it("PATCH toggles completed and survives a second PATCH", async () => {
      const created = await request(app).post("/todos").send({ text: "Toggle me" });
      expect(created.status).toBe(201);
      const id = created.body.id as string;
      expect(created.body.completed).toBe(false);

      const on = await request(app).patch(`/todos/${id}`).send({ completed: true });
      expect(on.status).toBe(200);
      expect(on.body.completed).toBe(true);
      expect(on.body.text).toBe("Toggle me");

      const off = await request(app).patch(`/todos/${id}`).send({ completed: false });
      expect(off.status).toBe(200);
      expect(off.body.completed).toBe(false);
    });

    it("PATCH returns 404 for unknown id", async () => {
      const res = await request(app)
        .patch("/todos/00000000-0000-4000-8000-000000000099")
        .send({ completed: true });
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe("not_found");
    });

    it("PATCH returns 400 for invalid id", async () => {
      const res = await request(app).patch("/todos/not-a-uuid").send({ completed: true });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("validation_failed");
    });

    it("PATCH returns 400 for empty body (no fields)", async () => {
      const created = await request(app).post("/todos").send({ text: "x" });
      const id = created.body.id as string;
      const res = await request(app).patch(`/todos/${id}`).send({});
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("validation_failed");
    });
  },
);
