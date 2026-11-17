import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 4173,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    pool: "threads",
    maxWorkers: 1,
    fileParallelism: false,
    isolate: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/ai/**/*.ts", "src/services/**/*.ts"],
    },
  },
});
