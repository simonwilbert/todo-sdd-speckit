import type { Todo, TodoCreate, TodoPatch } from "@todo/shared";

function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL;
  const b = typeof base === "string" && base.length > 0 ? base.replace(/\/$/, "") : "";
  const p = path.startsWith("/") ? path : `/${path}`;
  return b ? `${b}${p}` : p;
}

export async function listTodosRequest(): Promise<Todo[]> {
  const res = await fetch(apiUrl("/todos"));
  if (!res.ok) {
    throw new Error(`Could not load todos (${res.status})`);
  }
  return res.json() as Promise<Todo[]>;
}

export async function createTodoRequest(body: TodoCreate): Promise<Todo> {
  const res = await fetch(apiUrl("/todos"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `Could not create todo (${res.status})`;
    try {
      const envelope = (await res.json()) as { error?: { message?: string } };
      if (envelope?.error?.message) {
        message = envelope.error.message;
      }
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<Todo>;
}

export async function patchTodoRequest(id: string, body: TodoPatch): Promise<Todo> {
  const res = await fetch(apiUrl(`/todos/${encodeURIComponent(id)}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `Could not update todo (${res.status})`;
    try {
      const envelope = (await res.json()) as { error?: { message?: string } };
      if (envelope?.error?.message) {
        message = envelope.error.message;
      }
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json() as Promise<Todo>;
}
