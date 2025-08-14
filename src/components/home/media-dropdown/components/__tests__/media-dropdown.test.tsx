import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MediaDropdown } from "../media-dropdown";

// Mock the chat store
vi.mock("@/store/chat-store", () => ({
  useConversationStore: vi.fn(() => ({
    selectedConversation: {
      _id: "conv1",
      name: "Test Conversation",
      participants: ["user1", "user2"],
      isGroup: false,
    },
  })),
}));

// Mock the media upload hook
vi.mock("../api/media-upload", () => ({
  useMediaUpload: vi.fn(() => ({
    uploadImage: vi.fn(),
    uploadVideo: vi.fn(),
  })),
}));

// Mock the media image dialog
vi.mock("./media-image-dialog", () => ({
  MediaImageDialog: ({ isOpen, onClose, selectedImage, isLoading, handleSendImage }: any) =>
    isOpen ? (
      <div data-testid="media-image-dialog">
        <span data-testid="selected-image">{selectedImage?.name}</span>
        <span data-testid="loading-state">{isLoading ? "loading" : "not-loading"}</span>
        <button data-testid="send-image-btn" onClick={handleSendImage}>
          Send Image
        </button>
        <button data-testid="close-image-dialog" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

// Mock the media video dialog
vi.mock("./media-video-dialog", () => ({
  MediaVideoDialog: ({ isOpen, onClose, selectedVideo, isLoading, handleSendVideo }: any) =>
    isOpen ? (
      <div data-testid="media-video-dialog">
        <span data-testid="selected-video">{selectedVideo?.name}</span>
        <span data-testid="video-loading-state">{isLoading ? "loading" : "not-loading"}</span>
        <button data-testid="send-video-btn" onClick={handleSendVideo}>
          Send Video
        </button>
        <button data-testid="close-video-dialog" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

describe("MediaDropdown", () => {
  let mockUploadImage: ReturnType<typeof vi.fn>;
  let mockUploadVideo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUploadImage = vi.fn();
    mockUploadVideo = vi.fn();

    // Get the mocked module and set up the mock
    const mediaUpload = require("../api/media-upload");
    mediaUpload.useMediaUpload.mockReturnValue({
      uploadImage: mockUploadImage,
      uploadVideo: mockUploadVideo,
    });
  });

  it("renders dropdown trigger with plus icon", () => {
    render(<MediaDropdown />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders dropdown menu with photo and video options", async () => {
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(screen.getByText("Photo")).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
  });

  it("renders hidden file inputs", () => {
    render(<MediaDropdown />);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const videoInput = screen.getByAcceptingFiles("video/*");

    expect(imageInput).toHaveAttribute("type", "file");
    expect(videoInput).toHaveAttribute("type", "file");
    expect(imageInput).toHaveAttribute("accept", "image/*");
    expect(videoInput).toHaveAttribute("accept", "video/*");
  });

  it("opens image input when photo option is clicked", async () => {
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const photoOption = screen.getByText("Photo");
    await user.click(photoOption);

    // The file input should be triggered
    expect(screen.getByAcceptingFiles("image/*")).toBeInTheDocument();
  });

  it("opens video input when video option is clicked", async () => {
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const videoOption = screen.getByText("Video");
    await user.click(videoOption);

    // The file input should be triggered
    expect(screen.getByAcceptingFiles("video/*")).toBeInTheDocument();
  });

  it("shows image dialog when image file is selected", async () => {
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file = new File(["image content"], "test-image.jpg", { type: "image/jpeg" });

    await user.upload(imageInput, file);

    expect(screen.getByTestId("media-image-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("selected-image")).toHaveTextContent("test-image.jpg");
  });

  it("shows video dialog when video file is selected", async () => {
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const videoInput = screen.getByAcceptingFiles("video/*");
    const file = new File(["video content"], "test-video.mp4", { type: "video/mp4" });

    await user.upload(videoInput, file);

    expect(screen.getByTestId("media-video-dialog")).toBeInTheDocument();
    expect(screen.getByTestId("selected-video")).toHaveTextContent("test-video.mp4");
  });

  it("calls uploadImage when send image button is clicked", async () => {
    mockUploadImage.mockResolvedValue(true);
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file = new File(["image content"], "test-image.jpg", { type: "image/jpeg" });

    await user.upload(imageInput, file);

    const sendButton = screen.getByTestId("send-image-btn");
    await user.click(sendButton);

    expect(mockUploadImage).toHaveBeenCalledWith(file, "conv1");
  });

  it("calls uploadVideo when send video button is clicked", async () => {
    mockUploadVideo.mockResolvedValue(true);
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const videoInput = screen.getByAcceptingFiles("video/*");
    const file = new File(["video content"], "test-video.mp4", { type: "video/mp4" });

    await user.upload(videoInput, file);

    const sendButton = screen.getByTestId("send-video-btn");
    await user.click(sendButton);

    expect(mockUploadVideo).toHaveBeenCalledWith(file, "conv1");
  });

  it("clears selected image after successful upload", async () => {
    mockUploadImage.mockResolvedValue(true);
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file = new File(["image content"], "test-image.jpg", { type: "image/jpeg" });

    await user.upload(imageInput, file);
    expect(screen.getByTestId("media-image-dialog")).toBeInTheDocument();

    const sendButton = screen.getByTestId("send-image-btn");
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.queryByTestId("media-image-dialog")).not.toBeInTheDocument();
    });
  });

  it("clears selected video after successful upload", async () => {
    mockUploadVideo.mockResolvedValue(true);
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const videoInput = screen.getByAcceptingFiles("video/*");
    const file = new File(["video content"], "test-video.mp4", { type: "video/mp4" });

    await user.upload(videoInput, file);
    expect(screen.getByTestId("media-video-dialog")).toBeInTheDocument();

    const sendButton = screen.getByTestId("send-video-btn");
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.queryByTestId("media-video-dialog")).not.toBeInTheDocument();
    });
  });

  it("does not clear selected image after failed upload", async () => {
    mockUploadImage.mockResolvedValue(false);
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file = new File(["image content"], "test-image.jpg", { type: "image/jpeg" });

    await user.upload(imageInput, file);
    expect(screen.getByTestId("media-image-dialog")).toBeInTheDocument();

    const sendButton = screen.getByTestId("send-image-btn");
    await user.click(sendButton);

    // Dialog should still be visible after failed upload
    expect(screen.getByTestId("media-image-dialog")).toBeInTheDocument();
  });

  it("does not clear selected video after failed upload", async () => {
    mockUploadVideo.mockResolvedValue(false);
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const videoInput = screen.getByAcceptingFiles("video/*");
    const file = new File(["video content"], "test-video.mp4", { type: "video/mp4" });

    await user.upload(videoInput, file);
    expect(screen.getByTestId("media-video-dialog")).toBeInTheDocument();

    const sendButton = screen.getByTestId("send-video-btn");
    await user.click(sendButton);

    // Dialog should still be visible after failed upload
    expect(screen.getByTestId("media-video-dialog")).toBeInTheDocument();
  });

  it("closes image dialog when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file = new File(["image content"], "test-image.jpg", { type: "image/jpeg" });

    await user.upload(imageInput, file);
    expect(screen.getByTestId("media-image-dialog")).toBeInTheDocument();

    const closeButton = screen.getByTestId("close-image-dialog");
    await user.click(closeButton);

    expect(screen.queryByTestId("media-image-dialog")).not.toBeInTheDocument();
  });

  it("closes video dialog when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const videoInput = screen.getByAcceptingFiles("video/*");
    const file = new File(["video content"], "test-video.mp4", { type: "video/mp4" });

    await user.upload(videoInput, file);
    expect(screen.getByTestId("media-video-dialog")).toBeInTheDocument();

    const closeButton = screen.getByTestId("close-video-dialog");
    await user.click(closeButton);

    expect(screen.queryByTestId("media-video-dialog")).not.toBeInTheDocument();
  });

  it("shows loading state during image upload", async () => {
    mockUploadImage.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 100)),
    );
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file = new File(["image content"], "test-image.jpg", { type: "image/jpeg" });

    await user.upload(imageInput, file);
    const sendButton = screen.getByTestId("send-image-btn");
    await user.click(sendButton);

    expect(screen.getByTestId("loading-state")).toHaveTextContent("loading");
  });

  it("shows loading state during video upload", async () => {
    mockUploadVideo.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 100)),
    );
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const videoInput = screen.getByAcceptingFiles("video/*");
    const file = new File(["video content"], "test-video.mp4", { type: "video/mp4" });

    await user.upload(videoInput, file);
    const sendButton = screen.getByTestId("send-video-btn");
    await user.click(sendButton);

    expect(screen.getByTestId("video-loading-state")).toHaveTextContent("loading");
  });

  it("does not upload when no conversation is selected", () => {
    const chatStore = require("@/store/chat-store");
    chatStore.useConversationStore.mockReturnValue({
      selectedConversation: null,
    });

    render(<MediaDropdown />);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file = new File(["image content"], "test-image.jpg", { type: "image/jpeg" });

    fireEvent.change(imageInput, { target: { files: [file] } });

    expect(screen.queryByTestId("media-image-dialog")).not.toBeInTheDocument();
  });

  it("handles file input change event", async () => {
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file = new File(["image content"], "test-image.jpg", { type: "image/jpeg" });

    await user.upload(imageInput, file);

    expect(screen.getByTestId("media-image-dialog")).toBeInTheDocument();
  });

  it("handles multiple file selections", async () => {
    const user = userEvent.setup();
    render(<MediaDropdown />);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file1 = new File(["image content 1"], "test-image-1.jpg", { type: "image/jpeg" });
    const file2 = new File(["image content 2"], "test-image-2.jpg", { type: "image/jpeg" });

    await user.upload(imageInput, file1);
    expect(screen.getByTestId("selected-image")).toHaveTextContent("test-image-1.jpg");

    await user.upload(imageInput, file2);
    expect(screen.getByTestId("selected-image")).toHaveTextContent("test-image-2.jpg");
  });
});
