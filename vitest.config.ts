import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Unit tests cover the domain layer only — pure types, rules, and mappers with
 * no React, no DOM, and no database. That is where tests are cheapest here, so
 * the node environment is all this project needs; view and route coverage comes
 * from the browser checks in Phase 8.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/domain/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
