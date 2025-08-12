// Environment variables for Next.js
// These should be available on both server and client sides
export const CLERK_PUBLIC_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
export const CLERK_JWT_ISSUER_DOMAIN = process.env.NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN;
export const CONVEX_PUBLIC = process.env.NEXT_PUBLIC_CONVEX_URL;

// Validation function for required env vars
export function validateEnvVars() {
  if (!CLERK_PUBLIC_KEY) {
    throw new Error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }
  if (!CLERK_JWT_ISSUER_DOMAIN) {
    throw new Error("Missing NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN");
  }
  if (!CONVEX_PUBLIC) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL");
  }
}
