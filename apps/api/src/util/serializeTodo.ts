import type { Todo } from "@todo/shared";
import type { Todo as PrismaTodo } from "@prisma/client";

export function serializeTodo(row: PrismaTodo): Todo {
  return {
    id: row.id,
    text: row.text,
    completed: row.completed,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
