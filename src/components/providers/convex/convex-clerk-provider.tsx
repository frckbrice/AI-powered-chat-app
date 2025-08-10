"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { CLERK_PUBLIC_KEY } from "../../../lib/constantes";
import { ConvexClerkProvider } from "./convex-client-provider";

if (!CLERK_PUBLIC_KEY) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file or NO public clerk public key");
}

export function ClerkConvexProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLIC_KEY}>
      <ConvexClerkProvider>{children}</ConvexClerkProvider>
    </ClerkProvider>
  );
}
