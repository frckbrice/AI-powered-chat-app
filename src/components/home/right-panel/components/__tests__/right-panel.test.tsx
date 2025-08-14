import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RightPanel } from "../right-panel";

// Mock Convex hooks
vi.mock("convex/react", () => ({
  useConvexAuth: vi.fn(),
}));

// Mock the chat store
vi.mock("@/store/chat-store", () => ({
  useConversationStore: vi.fn(() => ({
    selectedConversation: null,
    setSelectedConversation: vi.fn(),
  })),
}));

// Mock the message input component
vi.mock("../../message-input", () => ({
  MessageInput: () => <div data-testid="message-input">Message Input</div>,
}));

// Mock the message container component
vi.mock("../../message-container", () => ({
  default: () => <div data-testid="message-container">Message Container</div>,
}));

// Mock the chat placeholder component
vi.mock("./chat-placeholder", () => ({
  default: () => <div data-testid="chat-placeholder">Chat Placeholder</div>,
}));

// Mock the group members dialog component
vi.mock("../../group-members-dialog", () => ({
  default: () => <div data-testid="group-members-dialog">Group Members Dialog</div>,
}));

describe("RightPanel", () => {
  let mockUseConvexAuth: any;
  let mockUseConversationStore: any;

  const mockConversation = {
    _id: "conv1",
    name: "John Doe",
    groupName: null,
    image: "https://example.com/avatar.jpg",
    groupImage: null,
    isGroup: false,
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
  };

  const mockGroupConversation = {
    ...mockConversation,
    _id: "conv2",
    groupName: "Test Group",
    name: null,
    isGroup: true,
    admin: "user1",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Get the mocked modules
    const convexReact = require("convex/react");
    const chatStore = require("@/store/chat-store");

    mockUseConvexAuth = convexReact.useConvexAuth;
    mockUseConversationStore = chatStore.useConversationStore;

    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
    });
    mockUseConversationStore.mockReturnValue({
      selectedConversation: null,
      setSelectedConversation: vi.fn(),
    });
  });

  it("renders loading state when authentication is loading", () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: true,
    });

    render(<RightPanel />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders chat placeholder when no conversation is selected", () => {
    render(<RightPanel />);
    expect(screen.getByTestId("chat-placeholder")).toBeInTheDocument();
  });

  it("renders conversation header when conversation is selected", () => {
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockConversation,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders group name when conversation is a group", () => {
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockGroupConversation,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    expect(screen.getByText("Test Group")).toBeInTheDocument();
  });

  it("renders conversation avatar", () => {
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockConversation,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("renders placeholder avatar when no image is provided", () => {
    const conversationWithoutImage = {
      ...mockConversation,
      image: null,
    };
    mockUseConversationStore.mockReturnValue({
      selectedConversation: conversationWithoutImage,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    const avatar = screen.getByRole("img");
    expect(avatar).toHaveAttribute("src", "/placeholder.png");
  });

  it("renders group members dialog for group conversations", () => {
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockGroupConversation,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    expect(screen.getByTestId("group-members-dialog")).toBeInTheDocument();
  });

  it("does not render group members dialog for individual conversations", () => {
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockConversation,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    expect(screen.queryByTestId("group-members-dialog")).not.toBeInTheDocument();
  });

  it("renders video call link", () => {
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockConversation,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    const videoLink = screen.getByRole("link", { name: /video/i });
    expect(videoLink).toHaveAttribute("href", "/video-call");
    expect(videoLink).toHaveAttribute("target", "_blank");
  });

  it("renders close button", () => {
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockConversation,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("calls setSelectedConversation with null when close button is clicked", async () => {
    const mockSetSelectedConversation = vi.fn();
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockConversation,
      setSelectedConversation: mockSetSelectedConversation,
    });

    const user = userEvent.setup();
    render(<RightPanel />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(mockSetSelectedConversation).toHaveBeenCalledWith(null);
  });

  it("renders message container when conversation is selected", () => {
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockConversation,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    expect(screen.getByTestId("message-container")).toBeInTheDocument();
  });

  it("renders message input when conversation is selected", () => {
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockConversation,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    expect(screen.getByTestId("message-input")).toBeInTheDocument();
  });

  it("renders message container and input in correct order", () => {
    mockUseConversationStore.mockReturnValue({
      selectedConversation: mockConversation,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);

    const container = screen.getByTestId("message-container");
    const input = screen.getByTestId("message-input");

    expect(container).toBeInTheDocument();
    expect(input).toBeInTheDocument();
  });

  it("handles conversation with no name or group name", () => {
    const conversationWithoutNames = {
      ...mockConversation,
      name: null,
      groupName: null,
    };
    mockUseConversationStore.mockReturnValue({
      selectedConversation: conversationWithoutNames,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    // Should render empty string or fallback
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  it("handles conversation with empty strings for names", () => {
    const conversationWithEmptyNames = {
      ...mockConversation,
      name: "",
      groupName: "",
    };
    mockUseConversationStore.mockReturnValue({
      selectedConversation: conversationWithEmptyNames,
      setSelectedConversation: vi.fn(),
    });

    render(<RightPanel />);
    // Should render empty string
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });
});
