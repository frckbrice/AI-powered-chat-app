// fail fast on missing env vars and provide strong typing
export function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const CLERK_PUBLIC_KEY = requiredEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
export const CLERK_JWT_ISSUER_DOMAIN = requiredEnv("NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN");
export const CONVEX_PUBLIC = requiredEnv("NEXT_PUBLIC_CONVEX_URL");
