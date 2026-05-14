import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    fileParallelism: false,
    poolOptions: {
      threads: { singleThread: true },
    },
    coverage: {
      provider: "v8",
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
      include: ["src/**/*.ts"],
      exclude: ["src/server.ts"],
    },
  },
});
