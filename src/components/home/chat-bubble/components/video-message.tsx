import { useState, useEffect } from "react";
import { IMessage } from "../../../types";

interface VideoMessageProps {
  message: IMessage;
}

export const VideoMessage = ({ message }: VideoMessageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [videoBlob, setVideoBlob] = useState<string | null>(null);

  // console.log('VideoMessage render:', {
  //   content: message.content,
  //   messageType: message.messageType,
  //   isConvexStorage: message.content.includes('convex.cloud/api/storage'),
  //   urlLength: message.content?.length,
  //   urlStartsWith: message.content?.substring(0, 50)
  // });

  useEffect(() => {
    const loadVideoAsBlob = async () => {
      if (!message.content || message.messageType !== "video") return;

      try {
        // For Convex storage URLs, try direct loading first, then proxy as fallback
        if (message.content.includes("convex.cloud/api/storage")) {
          console.log("Attempting to load Convex storage video:", message.content);

          // Keep loading true initially, let the video element handle the loading state
          // Don't set videoBlob initially, let the video element try the direct URL
        } else {
          // For other URLs, keep loading true initially
          // The loading will be hidden when video events fire
        }
      } catch (error) {
        console.error("Error in video loading logic:", error);
        setErrorMessage("Failed to load video");
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadVideoAsBlob();

    // Cleanup function to revoke blob URL
    return () => {
      if (videoBlob) {
        URL.revokeObjectURL(videoBlob);
      }
    };
  }, [message.content, message.messageType, videoBlob]);

  const handleVideoError = (error: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("Video error:", error);

    // Extract more specific error information
    let specificError = "Failed to load video";

    const target = error.currentTarget;
    if (target.error) {
      const videoError = target.error;
      console.error("Video error details:", {
        code: videoError.code,
        message: videoError.message,
      });

      switch (videoError.code) {
        case 1:
          specificError = "Video format not supported";
          break;
        case 2:
          specificError = "Network error";
          break;
        case 3:
          specificError = "Video decoding failed";
          break;
        case 4:
          if (videoError.message.includes("URL safety check")) {
            specificError = "Video blocked by security policy - trying proxy method";
            // Try proxy method for Convex storage URLs
            if (message.content.includes("convex.cloud/api/storage") && !videoBlob) {
              console.log("Attempting proxy method for blocked video...");
              tryProxyMethod();
              return;
            }
          } else {
            specificError = "Video not available";
          }
          break;
        default:
          specificError = `Video error: ${videoError.message}`;
      }
    } else if (target.src) {
      console.error("Video source that failed:", target.src);
      specificError = "Video failed to load from source";

      // Try proxy method for Convex storage URLs
      if (message.content.includes("convex.cloud/api/storage") && !videoBlob) {
        console.log("Attempting proxy method for failed video...");
        tryProxyMethod();
        return;
      }
    }

    // For Convex storage URLs, try to provide more specific error information
    if (message.content.includes("convex.cloud/api/storage")) {
      console.error("Convex storage video failed to load");
      if (!videoBlob) {
        specificError = "Video failed to load from storage - CORS issue";
      } else {
        specificError = "Video failed to play after loading";
      }
    }

    setErrorMessage(specificError);
    setHasError(true);
    setIsLoading(false);
  };

  // Function to try proxy method
  const tryProxyMethod = async () => {
    if (!message.content.includes("convex.cloud/api/storage")) return;

    try {
      // Use the Next.js API route for proxying
      const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(message.content)}`;

      console.log("Trying proxy URL:", proxyUrl);

      const response = await fetch(proxyUrl, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        console.log("Proxy successful, created blob URL:", blobUrl);
        setVideoBlob(blobUrl);
        setHasError(false);
        setIsLoading(false);
      } else {
        console.error("Proxy failed:", response.status);
        setErrorMessage("Video blocked by security policy");
        setHasError(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Proxy attempt failed:", error);
      setErrorMessage("Video blocked by security policy");
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleVideoLoadStart = () => {
    // console.log('Video load started');
    setIsLoading(true);
  };

  const handleVideoCanPlay = () => {
    // console.log('Video can play');
    setIsLoading(false);
    setHasError(false);
  };

  const handleVideoLoadedData = () => {
    // console.log('Video data loaded');
    setIsLoading(false);
  };

  // Check if the video URL is valid
  const isValidVideoUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (!isValidVideoUrl(message.content)) {
    return (
      <div className="w-[350px] h-[250px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm mb-2">Invalid video URL</div>
          <div className="text-xs break-all">{message.content}</div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-[350px] h-[250px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm mb-2">Video unavailable</div>
          <div className="text-xs">{errorMessage}</div>
          <div className="flex gap-2 mt-2 justify-center">
            <button
              onClick={() => {
                setHasError(false);
                setErrorMessage("");
                setIsLoading(true);
              }}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[350px] h-fit relative  dark:bg-gray-700 rounded-lg overflow-hidden p-1">
      <video
        data-testid="video-element"
        src={videoBlob || message.content}
        width="100%"
        height="100%"
        controls={true}
        playsInline={true}
        className="rounded-lg"
        onError={handleVideoError}
        onLoadStart={handleVideoLoadStart}
        onCanPlay={handleVideoCanPlay}
        onLoadedData={handleVideoLoadedData}
        onLoadedMetadata={() => console.log("Video metadata loaded")}
        onCanPlayThrough={() => console.log("Video can play through")}
        onPlaying={() => console.log("Video playing")}
        onPause={() => console.log("Video paused")}
        onEnded={() => console.log("Video ended")}
        crossOrigin="anonymous"
        preload="metadata"
        muted={false}
        autoPlay={false}
      >
        Your browser does not support the video tag.
      </video>

      {/* Loading indicator */}
      {/* {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-sm flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Loading...
          </div>
        </div>
      )} */}
    </div>
  );
};
