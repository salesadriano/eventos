/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/presentation/design-system/components/**/*.tsx"],
      exclude: [
        "src/presentation/design-system/components/**/*.stories.tsx",
        "src/presentation/design-system/components/**/*.test.tsx",
      ],
    },
  },
});
