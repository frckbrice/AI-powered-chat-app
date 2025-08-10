"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode, useEffect } from "react";
import { CONVEX_PUBLIC } from "../../../lib/constantes";

import { ConvexReactClient } from "convex/react";

if (!CONVEX_PUBLIC) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file or NO public clerk public key");
}
const convex = new ConvexReactClient(CONVEX_PUBLIC, { verbose: true });

export function ConvexClerkProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    convex.setAuth(async () => {
      const token = await getToken({ template: "convex" });

      console.log("token from clerk: ", token);
      return token;
    });
  }, [getToken]);

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
