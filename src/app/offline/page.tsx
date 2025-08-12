import Link from "next/link";
import RetryButton from "./retry-button";

export const metadata = {
  title: "Offline | WhatsApp Clone",
  description: "You're offline. Some features may be unavailable.",
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-sm w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">You’re offline</h1>
        <p className="text-sm opacity-80">
          It looks like your device is not connected to the internet. You can still view some cached
          pages. Please reconnect to use real-time features.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="px-4 py-2 rounded-md bg-primary text-primary-foreground">
            Go Home
          </Link>
          <RetryButton />
        </div>
      </div>
    </main>
  );
}
