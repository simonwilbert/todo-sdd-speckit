import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts", "src/api.ts", "src/todo.ts"],
    },
  },
});
