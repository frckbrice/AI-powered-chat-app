"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <SignIn routing="path" path="/sign-in" redirectUrl="/" />
    </main>
  );
}
