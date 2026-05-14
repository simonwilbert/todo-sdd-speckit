import type { Todo } from "@todo/shared";
import type { PrismaClient } from "@prisma/client";
import { serializeTodo } from "../util/serializeTodo.js";

export async function listTodos(prisma: PrismaClient): Promise<Todo[]> {
  const rows = await prisma.todo.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(serializeTodo);
}

export async function createTodo(prisma: PrismaClient, text: string): Promise<Todo> {
  const row = await prisma.todo.create({ data: { text } });
  return serializeTodo(row);
}
