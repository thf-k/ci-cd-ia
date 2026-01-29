import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/ai.e2e.test.js"],
  },
});
