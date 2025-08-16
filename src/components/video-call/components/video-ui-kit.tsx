"use client";

import { randomID } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useState, useRef, useCallback } from "react";

export function getUrlParams(url = window.location.href) {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

export default function VideoUIKit() {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useClerk();
  const zegoInstanceRef = useRef<ZegoUIKitPrebuilt | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const initializationAttemptedRef = useRef(false);
  const isInitializingRef = useRef(false);

  const resetVideoCall = useCallback(() => {
    console.log("🔄 Resetting video call...");
    if (zegoInstanceRef.current) {
      try {
        // Use destroy for cleanup - this is the correct method
        zegoInstanceRef.current.destroy();
        zegoInstanceRef.current = null;
      } catch (err) {
        console.log("⚠️ Error during reset cleanup:", err);
      }
    }
    setIsInitialized(false);
    setError(null);
    initializationAttemptedRef.current = false;
    isInitializingRef.current = false;
  }, []);

  const roomID = getUrlParams().get("roomID") || randomID(5);

  const myMeeting = useCallback(
    async (element: HTMLDivElement) => {
      // Prevent multiple initializations with multiple guards
      if (
        isInitialized ||
        zegoInstanceRef.current ||
        !element ||
        initializationAttemptedRef.current ||
        isInitializingRef.current
      ) {
        console.log("🚫 Video call initialization blocked:", {
          isInitialized,
          hasInstance: !!zegoInstanceRef.current,
          hasElement: !!element,
          isInitializing: isInitializingRef.current,
        });
        return;
      }

      console.log("🚀 Starting video call initialization...");

      // SET STRICT LOCK IMMEDIATELY
      // strictLockRef.current = true;
      isInitializingRef.current = true;
      initializationAttemptedRef.current = true;

      try {
        setIsLoading(true);
        setError(null);

        // Check media permissions first
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          // Stop the test stream - add type checking
          if (stream && typeof stream.getTracks === "function") {
            stream.getTracks().forEach((track) => {
              if (track && typeof track.stop === "function") {
                track.stop();
              }
            });
          }
          console.log("✅ Media permissions granted");
        } catch (mediaError) {
          console.warn("⚠️ Media permission error:", mediaError);
          // Don't fail the entire initialization, just log the warning
          // ZegoCloud will handle permission requests when needed
        }

        console.log("🔧 Initializing video call for user:", user?.id);
        console.log("🏠 Room ID:", roomID);

        const res = await fetch(`/api/zego-cloud?userID=${user?.id}`);
        console.log("📡 API response status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("❌ API error response:", errorText);
          throw new Error(`Failed to get ZegoCloud token: ${res.status} - ${errorText}`);
        }

        const { token, appID } = await res.json();
        console.log("✅ Received token and appID:", { hasToken: !!token, appID });

        if (!token || !appID) {
          throw new Error("Invalid response from ZegoCloud API");
        }

        const username = user?.fullName || user?.emailAddresses[0]?.emailAddress.split("@")[0];
        console.log("👤 Username for video call:", username);

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
          roomID,
          user?.id || "",
          username,
        );
        console.log("🔑 Kit token generated successfully");

        // Check if already initialized (double-check)
        if (zegoInstanceRef.current) {
          console.log("🧹 ZegoUIKit already exists, cleaning up...");
          try {
            (zegoInstanceRef.current as ZegoUIKitPrebuilt).destroy();
          } catch (err) {
            console.log("⚠️ Error during cleanup:", err);
          }
          zegoInstanceRef.current = null;
        }

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstanceRef.current = zp;
        console.log("🏗️ ZegoUIKit instance created");

        // Set initialization flag BEFORE joining room
        setIsInitialized(true);

        console.log("🚪 Joining room...");
        zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: "Personal link",
              url:
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?roomID=" +
                roomID,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
            // To implement 1-on-1 calls, modify the parameter here to
            // [ZegoUIKitPrebuilt.OneONoneCall].
          },
          showPreJoinView: true, // Show pre-join view to handle permissions
          showLeavingView: true, // Show leaving view
          showUserList: true, // Show user list
          showScreenSharingButton: true, // Show screen sharing button
          showAudioVideoSettingsButton: true, // Show audio/video settings
        });
        console.log("✅ Room joined successfully!");
      } catch (err) {
        console.error("❌ Failed to initialize video call:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize video call");
        setIsInitialized(false);
        zegoInstanceRef.current = null;
        initializationAttemptedRef.current = false;
        isInitializingRef.current = false;
        // strictLockRef.current = false;
      } finally {
        setIsLoading(false);
      }
    },
    [isInitialized, user?.id, user?.fullName, user?.emailAddresses, roomID],
  );

  // Single useEffect for all initialization logic
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    // More detailed logging to identify the blocker
    const blockers = {
      mounted,
      hasUser: !!user,
      hasContainer: !!containerRef.current,
      isInitialized,
      isInitializing: isInitializingRef.current,
      // strictLock: strictLockRef.current
    };

    console.log("🔍 Initialization effect status:", blockers);

    if (!user || !containerRef.current || isInitializingRef.current) {
      // Identify which specific condition is blocking
      const blockingReasons = [];
      if (!user) blockingReasons.push("no user");
      if (!containerRef.current) blockingReasons.push("no container");
      if (isInitializingRef.current) blockingReasons.push("currently initializing");

      console.log("🚫 Initialization effect blocked by:", blockingReasons.join(", "));
      return;
    }

    console.log("🎯 Container ready, starting initialization...");
    myMeeting(containerRef.current);
  }, [mounted, user, isInitialized, myMeeting]);

  // Simple state reset effect - runs when component mounts
  useEffect(() => {
    if (mounted && user) {
      console.log("🔄 Component ready, resetting stuck state...");

      // Clean up any existing ZegoCloud instance
      if (zegoInstanceRef.current) {
        console.log("🧹 Cleaning up existing ZegoCloud instance...");
        try {
          zegoInstanceRef.current.destroy();
          console.log("✅ Instance cleaned up successfully");
        } catch (err) {
          console.log("⚠️ Error cleaning up instance:", err);
        }
        zegoInstanceRef.current = null;
      }

      setIsInitialized(false);
      setIsLoading(false);
      setError(null);
      isInitializingRef.current = false;
      initializationAttemptedRef.current = false;
      console.log("✅ State and instance reset complete");
    }
  }, [mounted, user]);

  // Global error handlers
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (
        event.error &&
        event.error.message &&
        (event.error.message.includes("ZEGOCLOUD") ||
          event.error.message.includes("1103061") ||
          event.error.message.includes("get media fail") ||
          event.error.message.includes("removeChild") ||
          event.error.message.includes("NotFoundError") ||
          event.error.message.includes("joinRoom repeat"))
      ) {
        console.warn("🚨 Caught ZegoCloud/React DOM error:", event.error.message);
        setError(`Video call error: ${event.error.message}`);
        resetVideoCall();
        event.preventDefault();
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (
        event.reason &&
        event.reason.message &&
        (event.reason.message.includes("ZEGOCLOUD") ||
          event.reason.message.includes("1103061") ||
          event.reason.message.includes("get media fail") ||
          event.reason.message.includes("removeChild") ||
          event.reason.message.includes("NotFoundError") ||
          event.reason.message.includes("joinRoom repeat"))
      ) {
        console.warn("🚨 Caught ZegoCloud/React DOM promise rejection:", event.reason.message);
        setError(`Video call error: ${event.reason.message}`);
        resetVideoCall();
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, [resetVideoCall]);

  // Cleanup effect - runs before component unmounts
  useEffect(() => {
    return () => {
      console.log("🔄 Component unmounting, cleaning up ZegoCloud...");

      if (zegoInstanceRef.current) {
        try {
          // Use destroy for cleanup
          zegoInstanceRef.current.destroy();
        } catch (err) {
          console.log("⚠️ Error during unmount cleanup:", err);
        }
        zegoInstanceRef.current = null;
      }
    };
  }, []);

  // Reset unmounting flag when component remounts or user changes
  useEffect(() => {
    if (mounted && user) {
      // Reset flags if they were incorrectly set
      if (initializationAttemptedRef.current || isInitializingRef.current) {
        console.log("🔄 Resetting flags for new user/mount");
        initializationAttemptedRef.current = false;
        isInitializingRef.current = false;
      }
    }
  }, [mounted, user]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        Please sign in to use video calls.
      </div>
    );
  }

  if (error) {
    const isMediaError =
      error.includes("media") || error.includes("camera") || error.includes("microphone");
    const isZegoError = error.includes("ZEGOCLOUD") || error.includes("1103061");

    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 p-8">
        <div className="text-red-600 text-lg font-semibold text-center">
          {isMediaError ? "Media Access Error" : isZegoError ? "Video Call Error" : "Error"}:{" "}
          {error}
        </div>

        {isMediaError && (
          <div className="text-gray-600 text-center max-w-md">
            <p>Please check your camera and microphone permissions:</p>
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Allow camera access when prompted</li>
              <li>Allow microphone access when prompted</li>
              <li>Check if other apps are using your camera/microphone</li>
              <li>Try refreshing the page</li>
            </ul>
          </div>
        )}

        {isZegoError && (
          <div className="text-gray-600 text-center max-w-md">
            <p>Video call service error. This might be due to:</p>
            <ul className="list-disc list-inside mt-2 text-sm">
              <li>Network connectivity issues</li>
              <li>Service temporarily unavailable</li>
              <li>Invalid room configuration</li>
            </ul>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => {
              console.log("🔄 Manual reset triggered");
              resetVideoCall();
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              console.log("🔄 Manual page reload triggered");
              resetVideoCall();
              window.location.reload();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Initializing video call...</div>
      </div>
    );
  }

  // Debug panel for development
  const debugInfo = {
    mounted,
    hasUser: !!user,
    hasContainer: !!containerRef.current,
    isInitialized,
    isInitializing: isInitializingRef.current,
    hasInstance: !!zegoInstanceRef.current,
  };

  return (
    <div className="relative">
      {/* Debug Panel - Only show in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 left-4 z-50 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-xs">
          <div className="font-bold mb-2">🔍 Debug Info</div>
          {Object.entries(debugInfo).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{key}:</span>
              <span className={value ? "text-green-400" : "text-red-400"}>{String(value)}</span>
            </div>
          ))}
        </div>
      )}

      <div
        className="myCallContainer"
        ref={(element) => {
          // Only call myMeeting once when the element is first available
          if (element) {
            containerRef.current = element;
          }
        }}
        style={{ width: "100vw", height: "100vh" }}
      ></div>
    </div>
  );
}
