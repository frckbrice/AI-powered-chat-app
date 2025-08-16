import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import ReactPlayer from "react-player";

interface MediaVideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: File;
  isLoading: boolean;
  handleSendVideo: () => void;
}

export const MediaVideoDialog = ({
  isOpen,
  onClose,
  selectedVideo,
  isLoading,
  handleSendVideo,
}: MediaVideoDialogProps) => {
  const [renderedVideo, setRenderedVideo] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (!selectedVideo) return;

    setIsVideoLoading(true);
    setVideoError(null);
    setIsVideoPlaying(false);

    try {
      // Create blob URL for the video file
      const videoUrl = URL.createObjectURL(selectedVideo);
      console.log("Created video blob URL:", videoUrl);

      setRenderedVideo(videoUrl);
      setVideoError(null);
      setIsVideoLoading(false);

      // Cleanup function to revoke object URL when component unmounts or video changes
      return () => {
        console.log("Revoking video blob URL:", videoUrl);
        URL.revokeObjectURL(videoUrl);
      };
    } catch (error) {
      console.error("Error creating video URL:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setVideoError(`Failed to create video URL: ${errorMessage}`);
      setRenderedVideo(null);
      setIsVideoLoading(false);
      setIsVideoPlaying(false);
    }
  }, [selectedVideo]);

  // Cleanup on dialog close
  useEffect(() => {
    if (!isOpen && renderedVideo) {
      URL.revokeObjectURL(renderedVideo);
      setRenderedVideo(null);
      setVideoError(null);
      setIsVideoLoading(false);
      setIsVideoPlaying(false);
    }
  }, [isOpen, renderedVideo]);

  const handleVideoError = (error: Error) => {
    console.error("Video playback error:", error);
    setVideoError("Video playback failed");
    setIsVideoLoading(false);
    setIsVideoPlaying(false);
  };

  const handleVideoReady = () => {
    setVideoError(null);
    setIsVideoLoading(false);
  };

  const handleVideoStart = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="flex-1 w-full min-h-[500px] max-w-[90vw] max-h-[80vh]">
        <DialogTitle>Send Video</DialogTitle>
        <DialogDescription>Video</DialogDescription>
        <div className="w-full">
          {videoError ? (
            <div className="text-red-500 text-center py-4">
              <div className="mb-2">{videoError}</div>
              <div className="text-xs text-gray-500">Check console for more details</div>
            </div>
          ) : isVideoLoading ? (
            <div className="text-center py-4 text-gray-500">
              <div className="mb-2">Loading video...</div>
              <div className="text-xs">Creating video preview...</div>
            </div>
          ) : renderedVideo ? (
            <div className="relative">
              <div className="w-full max-h-[400px] flex justify-center">
                <ReactPlayer
                  url={renderedVideo}
                  controls
                  width="100%"
                  height="auto"
                  style={{ maxHeight: "400px" }}
                  onError={handleVideoError}
                  onReady={handleVideoReady}
                  onStart={handleVideoStart}
                  onPause={handleVideoPause}
                  onEnded={handleVideoEnd}
                  playing={false}
                  loop={false}
                  muted={false}
                  volume={1}
                  playbackRate={1}
                  config={{
                    file: {
                      attributes: {
                        controlsList: "nodownload",
                        preload: "metadata",
                        crossOrigin: "anonymous",
                      },
                      forceVideo: true,
                    },
                  }}
                />

                {/* Fallback video element in case ReactPlayer fails */}
                <video
                  src={renderedVideo}
                  controls
                  className="hidden"
                  onError={(e) => {
                    console.log("Fallback video element error:", e);
                  }}
                  onLoadedMetadata={() => {
                    console.log("Fallback video metadata loaded");
                  }}
                />
              </div>

              <div className="mt-2 text-center">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isVideoPlaying
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {isVideoPlaying ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Playing
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      Paused
                    </>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <div>Video Type: {selectedVideo.type}</div>
                <div>Video Size: {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB</div>
                <div
                  className={`font-medium ${isVideoPlaying ? "text-green-600" : "text-gray-600"}`}
                >
                  Status: {isVideoPlaying ? "▶️ Playing" : "⏸️ Paused"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No video selected</div>
          )}
        </div>
        <Button
          className="w-full"
          disabled={isLoading || !renderedVideo || !!videoError || isVideoLoading}
          onClick={handleSendVideo}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
