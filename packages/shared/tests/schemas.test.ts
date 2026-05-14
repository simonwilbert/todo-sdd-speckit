import { describe, expect, it } from "vitest";
import {
  todoCreateSchema,
  todoPatchSchema,
  todoReplaceSchema,
} from "../src/schemas/todo.zod.js";

describe("todoCreateSchema", () => {
  it("accepts valid text", () => {
    expect(todoCreateSchema.parse({ text: "  Buy milk  " })).toEqual({
      text: "Buy milk",
    });
  });

  it("rejects empty after trim", () => {
    expect(() => todoCreateSchema.parse({ text: "   " })).toThrow();
  });
});

describe("todoPatchSchema", () => {
  it("requires at least one field", () => {
    expect(() => todoPatchSchema.parse({})).toThrow();
  });

  it("accepts completed only", () => {
    expect(todoPatchSchema.parse({ completed: true })).toEqual({
      completed: true,
    });
  });
});

describe("todoReplaceSchema", () => {
  it("requires both fields", () => {
    expect(() => todoReplaceSchema.parse({ text: "a" })).toThrow();
  });
});
