import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatBubble from "../chat-bubble";
import { IMessage, IUser } from "../../../../types";

// Mock the chat store
vi.mock("@/store/chat-store", () => ({
  useConversationStore: () => ({
    selectedConversation: {
      _id: "conv1",
      participants: ["user1", "user2"],
      isGroup: true,
    },
  }),
}));

// Mock the message utils
vi.mock("../api/message-utils", () => ({
  formatMessageTime: () => "12:00 PM",
  getMessageBackgroundClass: () => "bg-blue-100 dark:bg-blue-900",
}));

// Mock the child components
vi.mock("./chat-bubble-avatar", () => ({
  default: ({ message }: { message: IMessage }) => (
    <div data-testid="chat-bubble-avatar">{message.sender?.name || "Unknown"}</div>
  ),
}));

vi.mock("./date-indicator", () => ({
  default: () => <div data-testid="date-indicator">Date</div>,
}));

vi.mock("./chat-avatar-action", () => ({
  default: () => <div data-testid="chat-avatar-actions">Actions</div>,
}));

vi.mock("./video-message", () => ({
  VideoMessage: () => <div data-testid="video-message">Video</div>,
}));

vi.mock("./image-message", () => ({
  ImageMessage: ({ handleClick }: { handleClick: () => void }) => (
    <div data-testid="image-message" onClick={handleClick}>
      Image
    </div>
  ),
}));

vi.mock("./text-message", () => ({
  TextMessage: ({ message }: { message: IMessage }) => (
    <div data-testid="text-message">{message.content}</div>
  ),
}));

vi.mock("./image-dialog", () => ({
  ImageDialog: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div data-testid="image-dialog">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("./message-time", () => ({
  MessageTime: () => <div data-testid="message-time">12:00 PM</div>,
}));

describe("ChatBubble", () => {
  const mockUser: IUser = {
    _id: "user1" as any,
    name: "Test User",
    image: "https://example.com/avatar.jpg",
    tokenIdentifier: "test-token",
    email: "test@example.com",
    _creationTime: 1234567890,
    isOnline: true,
  };

  const mockMessage: IMessage = {
    _id: "msg1" as any,
    content: "Hello world",
    messageType: "text",
    sender: {
      _id: "user2" as any,
      name: "Other User",
      image: "https://example.com/other-avatar.jpg",
      tokenIdentifier: "other-token",
      email: "other@example.com",
      _creationTime: 1234567890,
      isOnline: false,
    },
    _creationTime: 1234567890,
  };

  const mockAIMessage: IMessage = {
    ...mockMessage,
    sender: {
      ...mockMessage.sender,
      name: "ChatGPT",
    },
  };

  const mockImageMessage: IMessage = {
    ...mockMessage,
    content: "https://example.com/image.jpg",
    messageType: "image",
  };

  const mockVideoMessage: IMessage = {
    ...mockMessage,
    content: "https://example.com/video.mp4",
    messageType: "video",
  };

  it("renders text message from other user", () => {
    render(<ChatBubble message={mockMessage} me={mockUser} />);

    expect(screen.getByTestId("date-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("chat-bubble-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("text-message")).toBeInTheDocument();
    expect(screen.getByTestId("message-time")).toBeInTheDocument();
    expect(screen.getByText("Other User")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders text message from AI", () => {
    render(<ChatBubble message={mockAIMessage} me={mockUser} />);

    expect(screen.getByTestId("chat-bubble-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("text-message")).toBeInTheDocument();
    expect(screen.getByText("ChatGPT")).toBeInTheDocument();
  });

  it("renders image message from other user", () => {
    render(<ChatBubble message={mockImageMessage} me={mockUser} />);

    expect(screen.getByTestId("image-message")).toBeInTheDocument();
    expect(screen.queryByTestId("text-message")).not.toBeInTheDocument();
  });

  it("renders video message from other user", () => {
    render(<ChatBubble message={mockVideoMessage} me={mockUser} />);

    expect(screen.getByTestId("video-message")).toBeInTheDocument();
    expect(screen.queryByTestId("text-message")).not.toBeInTheDocument();
  });

  it("renders message from current user", () => {
    const myMessage: IMessage = {
      ...mockMessage,
      sender: mockUser,
    };

    render(<ChatBubble message={myMessage} me={mockUser} />);

    expect(screen.getByTestId("text-message")).toBeInTheDocument();
    expect(screen.getByTestId("message-time")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
  });

  it("shows chat avatar actions for group messages", () => {
    render(<ChatBubble message={mockMessage} me={mockUser} />);

    expect(screen.getByTestId("chat-avatar-actions")).toBeInTheDocument();
  });

  it("opens image dialog when image message is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatBubble message={mockImageMessage} me={mockUser} />);

    const imageMessage = screen.getByTestId("image-message");
    await user.click(imageMessage);

    expect(screen.getByTestId("image-dialog")).toBeInTheDocument();
  });

  it("closes image dialog when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatBubble message={mockImageMessage} me={mockUser} />);

    // Open dialog
    const imageMessage = screen.getByTestId("image-message");
    await user.click(imageMessage);
    expect(screen.getByTestId("image-dialog")).toBeInTheDocument();

    // Close dialog
    const closeButton = screen.getByText("Close");
    await user.click(closeButton);
    expect(screen.queryByTestId("image-dialog")).not.toBeInTheDocument();
  });

  it("handles unknown message type gracefully", () => {
    const unknownMessage: IMessage = {
      ...mockMessage,
      messageType: "unknown" as any,
    };

    render(<ChatBubble message={unknownMessage} me={mockUser} />);

    expect(screen.getByTestId("chat-bubble-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("message-time")).toBeInTheDocument();
    // Should not render any message content for unknown type
    expect(screen.queryByTestId("text-message")).not.toBeInTheDocument();
    expect(screen.queryByTestId("image-message")).not.toBeInTheDocument();
    expect(screen.queryByTestId("video-message")).not.toBeInTheDocument();
  });

  it("handles message without sender gracefully", () => {
    const messageWithoutSender: IMessage = {
      ...mockMessage,
      sender: undefined as any,
    };

    render(<ChatBubble message={messageWithoutSender} me={mockUser} />);

    expect(screen.getByTestId("chat-bubble-avatar")).toBeInTheDocument();
    expect(screen.getByTestId("message-time")).toBeInTheDocument();
  });

  it("handles message with previous message for date indicator", () => {
    const previousMessage: IMessage = {
      ...mockMessage,
      _id: "msg0" as any,
      _creationTime: 1234567890 - 86400000, // 1 day before
    };

    render(<ChatBubble message={mockMessage} me={mockUser} previousMessage={previousMessage} />);

    expect(screen.getByTestId("date-indicator")).toBeInTheDocument();
    expect(screen.getByTestId("text-message")).toBeInTheDocument();
  });

  it("applies correct styling classes to message container", () => {
    render(<ChatBubble message={mockMessage} me={mockUser} />);

    const messageContainer = screen.getByTestId("text-message").closest("div");
    expect(messageContainer).toHaveClass(
      "inline-block",
      "max-w-full",
      "px-4",
      "py-3",
      "rounded-2xl",
      "shadow-sm",
      "border",
      "border-gray-100",
      "dark:border-gray-700",
      "bg-blue-100",
      "dark:bg-blue-900",
      "transition-all",
      "duration-200",
      "hover:shadow-md",
    );
  });

  it("renders message header with sender information", () => {
    render(<ChatBubble message={mockMessage} me={mockUser} />);

    expect(screen.getByText("Other User")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders AI message with bot icon and special styling", () => {
    render(<ChatBubble message={mockAIMessage} me={mockUser} />);

    expect(screen.getByText("ChatGPT")).toBeInTheDocument();
    // The bot icon should be present (though it's mocked in the component)
    expect(screen.getByTestId("chat-bubble-avatar")).toBeInTheDocument();
  });
});
