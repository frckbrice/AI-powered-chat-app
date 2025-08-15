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
      reporter: ["text", "lcov"],
      include: ["src/lib/**/*.ts", "src/components/ui/**/*.tsx", "src/components/home/**/*.tsx"],
      exclude: [
        "src/components/home/**/__tests__/**",
        "src/dummy-data/**",
        "src/test/**",
        "src/app/**",
        "**/*.test.*",
        "**/*.config.*",
        "tailwind.config.ts",
        "postcss.config.mts",
        "**/*.d.ts",
        "**/index.ts",
        "**/index.tsx",
      ],
      thresholds: {
        lines: 20,
        branches: 20,
        functions: 20,
        statements: 20,
      },
    },
  },
});
