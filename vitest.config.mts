import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      ignoreConfigErrors: true,
      projects: ["./tsconfig.json"],
    }),
  ],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "json-summary"],
      include: [
        "src/lib/**/*.ts",
        "src/components/ui/**/*.tsx",
        "src/components/home/conversation.tsx",
      ],
      exclude: [
        "src/components/home/**/__tests__/**",
        "src/dummy-data/**",
        "src/test/**",
        "src/app/**",
        "**/*.test.*",
        "**/*.config.*",
        "tailwind.config.ts",
        "postcss.config.mjs",
      ],
      thresholds: {
        lines: 40,
        branches: 40,
        functions: 40,
        statements: 40,
      },
    },
  },
});


