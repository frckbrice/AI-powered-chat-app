import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Constants", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Environment variables", () => {
    it("exports CLERK_PUBLIC_KEY from environment", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "test-clerk-key";

      // Re-import to get fresh values
      const { CLERK_PUBLIC_KEY } = await import("../constants");
      expect(CLERK_PUBLIC_KEY).toBe("test-clerk-key");
    });

    it("exports CLERK_JWT_ISSUER_DOMAIN from environment", async () => {
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";

      // Re-import to get fresh values
      const { CLERK_JWT_ISSUER_DOMAIN } = await import("../constants");
      expect(CLERK_JWT_ISSUER_DOMAIN).toBe("test-domain.com");
    });

    it("exports CONVEX_PUBLIC from environment", async () => {
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { CONVEX_PUBLIC } = await import("../constants");
      expect(CONVEX_PUBLIC).toBe("https://test-convex.com");
    });

    it("handles undefined environment variables", async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      delete process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN;
      delete process.env.NEXT_PUBLIC_CONVEX_URL;

      // Re-import to get fresh values
      const { CLERK_PUBLIC_KEY, CLERK_JWT_ISSUER_DOMAIN, CONVEX_PUBLIC } = await import(
        "../constants"
      );
      expect(CLERK_PUBLIC_KEY).toBeUndefined();
      expect(CLERK_JWT_ISSUER_DOMAIN).toBeUndefined();
      expect(CONVEX_PUBLIC).toBeUndefined();
    });

    it("handles empty string environment variables", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "";
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "";
      process.env.NEXT_PUBLIC_CONVEX_URL = "";

      // Re-import to get fresh values
      const { CLERK_PUBLIC_KEY, CLERK_JWT_ISSUER_DOMAIN, CONVEX_PUBLIC } = await import(
        "../constants"
      );
      expect(CLERK_PUBLIC_KEY).toBe("");
      expect(CLERK_JWT_ISSUER_DOMAIN).toBe("");
      expect(CONVEX_PUBLIC).toBe("");
    });
  });

  describe("validateEnvVars function", () => {
    it("does not throw when all environment variables are present", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "test-clerk-key";
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).not.toThrow();
    });

    it("throws error when CLERK_PUBLIC_KEY is missing", async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).toThrow("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
    });

    it("throws error when CLERK_JWT_ISSUER_DOMAIN is missing", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "test-clerk-key";
      delete process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN;
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).toThrow("Missing NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN");
    });

    it("throws error when CONVEX_PUBLIC is missing", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "test-clerk-key";
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      delete process.env.NEXT_PUBLIC_CONVEX_URL;

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).toThrow("Missing NEXT_PUBLIC_CONVEX_URL");
    });

    it("throws error when multiple environment variables are missing", async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      delete process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN;
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).toThrow("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
    });

    it("throws error when all environment variables are missing", async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      delete process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN;
      delete process.env.NEXT_PUBLIC_CONVEX_URL;

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).toThrow("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
    });

    it("handles empty string environment variables as missing", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "";
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).toThrow("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
    });

    it("handles whitespace-only environment variables as present", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "   ";
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).not.toThrow();
    });

    it("provides correct error message for missing CLERK_PUBLIC_KEY", async () => {
      delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      try {
        validateEnvVars();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
      }
    });

    it("provides correct error message for missing CLERK_JWT_ISSUER_DOMAIN", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "test-clerk-key";
      delete process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN;
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      try {
        validateEnvVars();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Missing NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN");
      }
    });

    it("provides correct error message for missing CONVEX_PUBLIC", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "test-clerk-key";
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      delete process.env.NEXT_PUBLIC_CONVEX_URL;

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      try {
        validateEnvVars();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Missing NEXT_PUBLIC_CONVEX_URL");
      }
    });
  });

  describe("Edge cases", () => {
    it("handles null environment variables", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = null as any;
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).toThrow("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
    });

    it("handles undefined environment variables", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = undefined as any;
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).toThrow("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
    });

    it("handles boolean environment variables", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "false";
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).not.toThrow();
    });

    it("handles numeric environment variables", async () => {
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "12345";
      process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN = "test-domain.com";
      process.env.NEXT_PUBLIC_CONVEX_URL = "https://test-convex.com";

      // Re-import to get fresh values
      const { validateEnvVars } = await import("../constants");
      expect(() => validateEnvVars()).not.toThrow();
    });
  });
});
