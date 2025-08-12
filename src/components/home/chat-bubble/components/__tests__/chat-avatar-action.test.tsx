import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ChatAvatarActions from "../chat-avatar-action";
import { IMessage, IUser } from "../../../../types";

// Mock the store
vi.mock("@/store/chat-store", () => ({
  useConversationStore: vi.fn(() => ({
    selectedConversation: {
      _id: "conv1",
      name: "Test Group",
      participants: ["user1", "user2"],
      isGroup: true,
      admin: "user1"
    },
    setSelectedConversation: vi.fn()
  }))
}));

// Mock convex mutations
vi.mock("convex/react", () => ({
  useMutation: vi.fn(() => vi.fn())
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn()
  }
}));

describe("ChatAvatarActions", () => {
  const mockMe: IUser = {
    _id: "user1",
    name: "Test User",
    email: "test@example.com",
    image: "https://example.com/avatar.jpg",
    isOnline: true
  };

  const mockMessage: IMessage = {
    _id: "1",
    content: "Hello world",
    messageType: "text",
    sender: { 
      _id: "user2", 
      name: "Another User",
      image: "https://example.com/avatar2.jpg",
      isOnline: true
    },
    conversationId: "conv1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user name when in group", () => {
    render(<ChatAvatarActions message={mockMessage} me={mockMe} />);
    
    expect(screen.getByText("Another User")).toBeInTheDocument();
  });

  it("shows kick icon when user is admin and hovering over member", () => {
    render(<ChatAvatarActions message={mockMessage} me={mockMe} />);
    
    const kickIcon = document.querySelector(".text-red-500.opacity-0");
    expect(kickIcon).toBeInTheDocument();
  });

  it("applies correct styling to container", () => {
    const { container } = render(<ChatAvatarActions message={mockMessage} me={mockMe} />);
    
    const actionContainer = container.firstChild as HTMLElement;
    expect(actionContainer).toHaveClass(
      "text-[11px]",
      "flex",
      "gap-4",
      "justify-between",
      "font-bold",
      "cursor-pointer",
      "group"
    );
  });

  it("handles AI messages", () => {
    const aiMessage: IMessage = {
      ...mockMessage,
      sender: { ...mockMessage.sender, name: "ChatGPT" }
    };

    render(<ChatAvatarActions message={aiMessage} me={mockMe} />);
    
    // Should still render the container
    const actionContainer = document.querySelector('[class*="text-[11px]"]');
    expect(actionContainer).toBeInTheDocument();
  });
});
