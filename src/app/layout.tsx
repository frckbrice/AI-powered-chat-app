import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";

import { Toaster } from "@/components/ui/sonner";
import { ClerkConvexProvider } from "@/components/providers/convex/convex-clerk-provider";

export const metadata: Metadata = {
  title: "WhatsApp Clone",
  description: "A WhatsApp-like chat UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkConvexProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#0b141a" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className="min-h-screen bg-background text-foreground antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="bottom-right"
              richColors
              duration={2000}
              closeButton
              theme="system"
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkConvexProvider>
  );
}
