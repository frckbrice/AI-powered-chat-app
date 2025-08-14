import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MessageContainer } from "../message-container";

// Mock Convex hooks
vi.mock("convex/react", () => ({
  useConvexAuth: vi.fn(),
  useQuery: vi.fn(),
}));

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

// Mock the chat bubble component
vi.mock("../../chat-bubble/components/chat-bubble", () => ({
  default: ({ message, me, previousMessage }: any) => (
    <div data-testid={`chat-bubble-${message._id}`}>
      {message.content}
      <span data-testid="sender">{message.sender}</span>
      <span data-testid="me">{me?._id}</span>
      <span data-testid="previous">{previousMessage?._id || "none"}</span>
    </div>
  ),
}));

// Mock the API
vi.mock("../../../../../convex/_generated/api", () => ({
  api: {
    messages: {
      getMessages: "getMessages",
    },
    users: {
      getMe: "getMe",
    },
  },
}));

describe("MessageContainer", () => {
  let mockUseConvexAuth: any;
  let mockUseQuery: any;

  const mockMessages = [
    {
      _id: "msg1",
      content: "Hello world",
      messageType: "text" as const,
      sender: "user1",
      _creationTime: Date.now() - 2000,
    },
    {
      _id: "msg2",
      content: "Hi there!",
      messageType: "text" as const,
      sender: "user2",
      _creationTime: Date.now() - 1000,
    },
    {
      _id: "msg3",
      content: "How are you?",
      messageType: "text" as const,
      sender: "user1",
      _creationTime: Date.now(),
    },
  ];

  const mockMe = {
    _id: "user1",
    name: "Test User",
    email: "test@example.com",
    image: "https://example.com/avatar.jpg",
    tokenIdentifier: "test-token",
    _creationTime: Date.now(),
    isOnline: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Get the mocked modules
    const convexReact = require("convex/react");
    mockUseConvexAuth = convexReact.useConvexAuth;
    mockUseQuery = convexReact.useQuery;

    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: true,
    });
    mockUseQuery.mockImplementation((query: string) => {
      if (query === "getMessages") {
        return mockMessages;
      }
      if (query === "getMe") {
        return mockMe;
      }
      return null;
    });
  });

  it("renders messages when conversation is selected", () => {
    render(<MessageContainer />);

    expect(screen.getByTestId("chat-bubble-msg1")).toBeInTheDocument();
    expect(screen.getByTestId("chat-bubble-msg2")).toBeInTheDocument();
    expect(screen.getByTestId("chat-bubble-msg3")).toBeInTheDocument();
  });

  it("displays message content correctly", () => {
    render(<MessageContainer />);

    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
    expect(screen.getByText("How are you?")).toBeInTheDocument();
  });

  it("passes correct props to chat bubble components", () => {
    render(<MessageContainer />);

    const firstBubble = screen.getByTestId("chat-bubble-msg1");
    expect(firstBubble.querySelector('[data-testid="sender"]')).toHaveTextContent("user1");
    expect(firstBubble.querySelector('[data-testid="me"]')).toHaveTextContent("user1");
    expect(firstBubble.querySelector('[data-testid="previous"]')).toHaveTextContent("none");

    const secondBubble = screen.getByTestId("chat-bubble-msg2");
    expect(secondBubble.querySelector('[data-testid="sender"]')).toHaveTextContent("user2");
    expect(secondBubble.querySelector('[data-testid="me"]')).toHaveTextContent("user1");
    expect(secondBubble.querySelector('[data-testid="previous"]')).toHaveTextContent("msg1");
  });

  it("handles empty messages array", () => {
    mockUseQuery.mockImplementation((query: string) => {
      if (query === "getMessages") {
        return [];
      }
      if (query === "getMe") {
        return mockMe;
      }
      return null;
    });

    render(<MessageContainer />);

    expect(screen.queryByTestId(/chat-bubble-/)).not.toBeInTheDocument();
  });

  it("handles null messages", () => {
    mockUseQuery.mockImplementation((query: string) => {
      if (query === "getMessages") {
        return null;
      }
      if (query === "getMe") {
        return mockMe;
      }
      return null;
    });

    render(<MessageContainer />);

    expect(screen.queryByTestId(/chat-bubble-/)).not.toBeInTheDocument();
  });

  it("handles undefined messages", () => {
    mockUseQuery.mockImplementation((query: string) => {
      if (query === "getMessages") {
        return undefined;
      }
      if (query === "getMe") {
        return mockMe;
      }
      return null;
    });

    render(<MessageContainer />);

    expect(screen.queryByTestId(/chat-bubble-/)).not.toBeInTheDocument();
  });

  it("handles null user data", () => {
    mockUseQuery.mockImplementation((query: string) => {
      if (query === "getMessages") {
        return mockMessages;
      }
      if (query === "getMe") {
        return null;
      }
      return null;
    });

    render(<MessageContainer />);

    // Should still render messages even without user data
    expect(screen.getByTestId("chat-bubble-msg1")).toBeInTheDocument();
  });

  it("skips user query when not authenticated", () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
    });

    render(<MessageContainer />);

    expect(mockUseQuery).toHaveBeenCalledWith("getMe", "skip");
  });

  it("calls getMessages with correct conversation ID", () => {
    render(<MessageContainer />);

    expect(mockUseQuery).toHaveBeenCalledWith("getMessages", {
      conversation: "conv1",
    });
  });

  it("renders messages in correct order", () => {
    render(<MessageContainer />);

    const bubbles = screen.getAllByTestId(/chat-bubble-/);
    expect(bubbles).toHaveLength(3);

    // Check order by content
    expect(bubbles[0]).toHaveTextContent("Hello world");
    expect(bubbles[1]).toHaveTextContent("Hi there!");
    expect(bubbles[2]).toHaveTextContent("How are you?");
  });

  it("applies correct CSS classes to container", () => {
    render(<MessageContainer />);

    const container = screen.getByTestId("message-container");
    expect(container).toHaveClass(
      "relative",
      "p-3",
      "flex-1",
      "overflow-auto",
      "h-full",
      "bg-chat-tile-light",
      "dark:bg-chat-tile-dark",
    );
  });

  it("applies correct CSS classes to messages wrapper", () => {
    render(<MessageContainer />);

    const messagesWrapper = screen.getByTestId("messages-wrapper");
    expect(messagesWrapper).toHaveClass("mx-12", "flex", "flex-col", "gap-3");
  });

  it("handles messages with different message types", () => {
    const mixedMessages = [
      {
        _id: "msg1",
        content: "Hello",
        messageType: "text" as const,
        sender: "user1",
        _creationTime: Date.now(),
      },
      {
        _id: "msg2",
        content: "image.jpg",
        messageType: "image" as const,
        sender: "user2",
        _creationTime: Date.now(),
      },
      {
        _id: "msg3",
        content: "video.mp4",
        messageType: "video" as const,
        sender: "user1",
        _creationTime: Date.now(),
      },
    ];

    mockUseQuery.mockImplementation((query: string) => {
      if (query === "getMessages") {
        return mixedMessages;
      }
      if (query === "getMe") {
        return mockMe;
      }
      return null;
    });

    render(<MessageContainer />);

    expect(screen.getByTestId("chat-bubble-msg1")).toBeInTheDocument();
    expect(screen.getByTestId("chat-bubble-msg2")).toBeInTheDocument();
    expect(screen.getByTestId("chat-bubble-msg3")).toBeInTheDocument();
  });

  it("handles messages without content", () => {
    const messagesWithoutContent = [
      {
        _id: "msg1",
        content: "",
        messageType: "text" as const,
        sender: "user1",
        _creationTime: Date.now(),
      },
    ];

    mockUseQuery.mockImplementation((query: string) => {
      if (query === "getMessages") {
        return messagesWithoutContent;
      }
      if (query === "getMe") {
        return mockMe;
      }
      return null;
    });

    render(<MessageContainer />);

    expect(screen.getByTestId("chat-bubble-msg1")).toBeInTheDocument();
  });

  it("handles messages with very long content", () => {
    const longMessage = {
      _id: "msg1",
      content: "A".repeat(1000),
      messageType: "text" as const,
      sender: "user1",
      _creationTime: Date.now(),
    };

    mockUseQuery.mockImplementation((query: string) => {
      if (query === "getMessages") {
        return [longMessage];
      }
      if (query === "getMe") {
        return mockMe;
      }
      return null;
    });

    render(<MessageContainer />);

    expect(screen.getByTestId("chat-bubble-msg1")).toBeInTheDocument();
    expect(screen.getByText("A".repeat(1000))).toBeInTheDocument();
  });
});
