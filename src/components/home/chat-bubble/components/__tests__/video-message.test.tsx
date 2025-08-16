import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VideoMessage } from "../video-message";
import { IMessage } from "../../../../types";

// Mock fetch for proxy method
global.fetch = vi.fn();

// Mock URL.createObjectURL and URL.revokeObjectURL
global.URL.createObjectURL = vi.fn(() => "blob:mock-url");
global.URL.revokeObjectURL = vi.fn();

describe("VideoMessage", () => {
  const mockMessage: IMessage = {
    _id: "msg1" as any,
    content: "https://example.com/video.mp4",
    messageType: "video",
    sender: {
      _id: "user1" as any,
      name: "Test User",
      image: "https://example.com/avatar.jpg",
      tokenIdentifier: "test-token",
      email: "test@example.com",
      _creationTime: 1234567890,
      isOnline: true,
    },
    _creationTime: 1234567890,
  };

  it("renders video element with correct props", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", "https://example.com/video.mp4");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsInline");
    expect(video).toHaveAttribute("crossOrigin", "anonymous");
    expect(video).toHaveAttribute("preload", "metadata");
  });

  it("applies correct styling to video container", () => {
    render(<VideoMessage message={mockMessage} />);

    const container = screen.getByTestId("video-element").closest("div");
    expect(container).toHaveClass(
      "w-[350px]",
      "h-fit",
      "relative",
      "dark:bg-gray-700",
      "rounded-lg",
      "overflow-hidden",
      "p-1",
    );
  });

  it("handles empty content gracefully", () => {
    const messageWithoutContent = {
      ...mockMessage,
      content: "",
    };

    render(<VideoMessage message={messageWithoutContent} />);

    expect(screen.getByText("Invalid video URL")).toBeInTheDocument();
    // Check that the empty content div exists by looking for the parent container
    const errorContainer = screen.getByText("Invalid video URL").closest("div");
    expect(errorContainer).toBeInTheDocument();
  });

  it("handles invalid URL gracefully", () => {
    const messageWithInvalidUrl = {
      ...mockMessage,
      content: "not-a-url",
    };

    render(<VideoMessage message={messageWithInvalidUrl} />);

    expect(screen.getByText("Invalid video URL")).toBeInTheDocument();
    expect(screen.getByText("not-a-url")).toBeInTheDocument();
  });

  it("handles video load start event", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");

    // Simulate load start
    fireEvent.loadStart(video);

    // The component should handle the load start event
    expect(video).toBeInTheDocument();
  });

  it("handles video can play event", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");

    // Simulate can play
    fireEvent.canPlay(video);

    // Video should still be visible
    expect(video).toBeInTheDocument();
  });

  it("handles video loaded data event", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");

    // Simulate loaded data
    fireEvent.loadedData(video);

    // Video should still be visible
    expect(video).toBeInTheDocument();
  });

  it("handles video format error", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");

    // Create a mock error event that React can handle
    const mockErrorEvent = {
      currentTarget: {
        error: {
          code: 1,
          message: "Video format not supported",
        },
        src: "https://example.com/video.mp4",
      },
      target: {
        error: {
          code: 1,
          message: "Video format not supported",
        },
        src: "https://example.com/video.mp4",
      },
    };

    // Use fireEvent.error with the mock event
    fireEvent.error(video, mockErrorEvent);

    expect(screen.getByText("Video unavailable")).toBeInTheDocument();
    expect(screen.getByText("Video format not supported")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("handles network error", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");

    // Create a mock error event that React can handle
    const mockErrorEvent = {
      currentTarget: {
        error: {
          code: 2,
          message: "Network error",
        },
        src: "https://example.com/video.mp4",
      },
      target: {
        error: {
          code: 2,
          message: "Network error",
        },
        src: "https://example.com/video.mp4",
      },
    };

    // Use fireEvent.error with the mock event
    fireEvent.error(video, mockErrorEvent);

    expect(screen.getByText("Video unavailable")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("handles video decoding error", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");

    // Create a mock error event that React can handle
    const mockErrorEvent = {
      currentTarget: {
        error: {
          code: 3,
          message: "Video decoding failed",
        },
        src: "https://example.com/video.mp4",
      },
      target: {
        error: {
          code: 3,
          message: "Video decoding failed",
        },
        src: "https://example.com/video.mp4",
      },
    };

    // Use fireEvent.error with the mock event
    fireEvent.error(video, mockErrorEvent);

    expect(screen.getByText("Video unavailable")).toBeInTheDocument();
    expect(screen.getByText("Video decoding failed")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("handles video not available error", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");

    // Create a mock error event that React can handle
    const mockErrorEvent = {
      currentTarget: {
        error: {
          code: 4,
          message: "Video not available",
        },
        src: "https://example.com/video.mp4",
      },
      target: {
        error: {
          code: 4,
          message: "Video not available",
        },
        src: "https://example.com/video.mp4",
      },
    };

    // Use fireEvent.error with the mock event
    fireEvent.error(video, mockErrorEvent);

    expect(screen.getByText("Video unavailable")).toBeInTheDocument();
    expect(screen.getByText("Video not available")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("resets error state when retry button is clicked", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");

    // Create a mock error event that React can handle
    const mockErrorEvent = {
      currentTarget: {
        error: {
          code: 1,
          message: "Video format not supported",
        },
        src: "https://example.com/video.mp4",
      },
      target: {
        error: {
          code: 1,
          message: "Video format not supported",
        },
        src: "https://example.com/video.mp4",
      },
    };

    // Use fireEvent.error with the mock event
    fireEvent.error(video, mockErrorEvent);

    // Should show error
    expect(screen.getByText("Video format not supported")).toBeInTheDocument();

    // Click retry
    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);

    // Should show video element again
    expect(screen.getByTestId("video-element")).toBeInTheDocument();
    expect(screen.queryByText("Video format not supported")).not.toBeInTheDocument();
  });

  it("handles different video URL protocols", () => {
    const httpMessage: IMessage = {
      ...mockMessage,
      content: "http://example.com/video.mp4",
    };

    const httpsMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com/video.mp4",
    };

    // Test HTTP URL
    const { rerender } = render(<VideoMessage message={httpMessage} />);
    expect(screen.getByTestId("video-element")).toBeInTheDocument();

    // Test HTTPS URL
    rerender(<VideoMessage message={httpsMessage} />);
    expect(screen.getByTestId("video-element")).toBeInTheDocument();
  });

  it("handles video with different dimensions", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");
    expect(video).toHaveAttribute("width", "100%");
    expect(video).toHaveAttribute("height", "100%");
  });

  it("applies correct video element attributes", () => {
    render(<VideoMessage message={mockMessage} />);

    const video = screen.getByTestId("video-element");
    expect(video).toHaveClass("rounded-lg");
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("playsInline");
    expect(video).toHaveAttribute("crossOrigin", "anonymous");
    expect(video).toHaveAttribute("preload", "metadata");
  });
});
