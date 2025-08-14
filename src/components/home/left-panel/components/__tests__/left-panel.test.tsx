import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeftPanel } from "../left-panel";

// Mock Convex hooks
vi.mock("convex/react", () => ({
  useConvexAuth: vi.fn(),
  useQuery: vi.fn(),
}));

// Mock the chat store
vi.mock("@/store/chat-store", () => ({
  useConversationStore: vi.fn(() => ({
    selectedConversation: null,
    setSelectedConversation: vi.fn(),
  })),
}));

// Mock Clerk components
vi.mock("@clerk/nextjs", () => ({
  UserButton: () => <div data-testid="user-button">User Button</div>,
}));

// Mock the theme switcher
vi.mock("../../../providers/theme/theme-switcher", () => ({
  default: () => <div data-testid="theme-switcher">Theme Switcher</div>,
}));

// Mock the user list dialog
vi.mock("../../user-list-dialog", () => ({
  default: () => <div data-testid="user-list-dialog">User List Dialog</div>,
}));

// Mock the conversation component
vi.mock("../../conversation", () => ({
  Conversation: ({ conversation }: { conversation: any }) => (
    <div data-testid={`conversation-${conversation._id}`}>
      {conversation.groupName || conversation.name}
    </div>
  ),
}));

describe("LeftPanel", () => {
  let mockUseConvexAuth: any;
  let mockUseQuery: any;
  let mockUseConversationStore: any;

  const mockConversations = [
    {
      _id: "conv1",
      groupName: "Group A",
      participants: ["user1", "user2"],
      _creationTime: Date.now(),
      lastMessage: {
        _id: "msg1",
        messageType: "text" as const,
        content: "Hello",
        sender: "user1",
        _creationTime: Date.now(),
      },
      sender: "user1",
      isOnline: true,
      isGroup: true,
    },
    {
      _id: "conv2",
      name: "John Doe",
      participants: ["user1", "user3"],
      _creationTime: Date.now() - 1000,
      lastMessage: {
        _id: "msg2",
        messageType: "text" as const,
        content: "Hi there",
        sender: "user3",
        _creationTime: Date.now() - 1000,
      },
      sender: "user1",
      isOnline: false,
      isGroup: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Get the mocked modules
    const convexReact = require("convex/react");
    const chatStore = require("@/store/chat-store");

    mockUseConvexAuth = convexReact.useConvexAuth;
    mockUseQuery = convexReact.useQuery;
    mockUseConversationStore = chatStore.useConversationStore;

    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });
    mockUseQuery.mockReturnValue(mockConversations);
    mockUseConversationStore.mockReturnValue({
      selectedConversation: null,
      setSelectedConversation: vi.fn(),
    });
  });

  it("renders loading state when authentication is loading", () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(<LeftPanel />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders user button and theme switcher in header", () => {
    render(<LeftPanel />);
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
    expect(screen.getByTestId("theme-switcher")).toBeInTheDocument();
  });

  it("renders user list dialog in header", () => {
    render(<LeftPanel />);
    expect(screen.getByTestId("user-list-dialog")).toBeInTheDocument();
  });

  it("renders search input with placeholder", () => {
    render(<LeftPanel />);
    expect(screen.getByPlaceholderText("Search or start a new chat")).toBeInTheDocument();
  });

  it("renders filter icon", () => {
    render(<LeftPanel />);
    expect(screen.getByTestId("filter-icon")).toBeInTheDocument();
  });

  it("renders conversations when authenticated", () => {
    render(<LeftPanel />);
    expect(screen.getByTestId("conversation-conv1")).toBeInTheDocument();
    expect(screen.getByTestId("conversation-conv2")).toBeInTheDocument();
  });

  it("filters conversations by group name", async () => {
    const user = userEvent.setup();
    render(<LeftPanel />);

    const searchInput = screen.getByPlaceholderText("Search or start a new chat");
    await user.type(searchInput, "Group");

    expect(screen.getByTestId("conversation-conv1")).toBeInTheDocument();
    expect(screen.queryByTestId("conversation-conv2")).not.toBeInTheDocument();
  });

  it("filters conversations by participant name", async () => {
    const user = userEvent.setup();
    render(<LeftPanel />);

    const searchInput = screen.getByPlaceholderText("Search or start a new chat");
    await user.type(searchInput, "John");

    expect(screen.getByTestId("conversation-conv2")).toBeInTheDocument();
    expect(screen.queryByTestId("conversation-conv1")).not.toBeInTheDocument();
  });

  it("shows no conversations message when filtered results are empty", async () => {
    const user = userEvent.setup();
    render(<LeftPanel />);

    const searchInput = screen.getByPlaceholderText("Search or start a new chat");
    await user.type(searchInput, "Nonexistent");

    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
    expect(screen.getByText(/We understand you're an introvert/)).toBeInTheDocument();
  });

  it("shows no conversations message when no conversations exist", () => {
    mockUseQuery.mockReturnValue([]);

    render(<LeftPanel />);
    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
    expect(screen.getByText(/We understand you're an introvert/)).toBeInTheDocument();
  });

  it("skips query when not authenticated", () => {
    mockUseConvexAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(<LeftPanel />);
    expect(mockUseQuery).toHaveBeenCalledWith(expect.any(String), "skip");
  });

  it("clears selected conversation when it no longer exists", () => {
    const mockSetSelectedConversation = vi.fn();
    mockUseConversationStore.mockReturnValue({
      selectedConversation: { _id: "old-conv" },
      setSelectedConversation: mockSetSelectedConversation,
    });

    render(<LeftPanel />);

    expect(mockSetSelectedConversation).toHaveBeenCalledWith(null);
  });

  it("does not clear selected conversation when it still exists", () => {
    const mockSetSelectedConversation = vi.fn();
    mockUseConversationStore.mockReturnValue({
      selectedConversation: { _id: "conv1" },
      setSelectedConversation: mockSetSelectedConversation,
    });

    render(<LeftPanel />);

    expect(mockSetSelectedConversation).not.toHaveBeenCalled();
  });

  it("handles search case insensitively", async () => {
    const user = userEvent.setup();
    render(<LeftPanel />);

    const searchInput = screen.getByPlaceholderText("Search or start a new chat");
    await user.type(searchInput, "group");

    expect(screen.getByTestId("conversation-conv1")).toBeInTheDocument();
    expect(screen.queryByTestId("conversation-conv2")).not.toBeInTheDocument();
  });

  it("updates search query state", async () => {
    const user = userEvent.setup();
    render(<LeftPanel />);

    const searchInput = screen.getByPlaceholderText("Search or start a new chat");
    await user.type(searchInput, "test");

    expect(searchInput).toHaveValue("test");
  });
});
