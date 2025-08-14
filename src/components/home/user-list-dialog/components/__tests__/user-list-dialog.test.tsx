import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserListDialog } from "../user-list-dialog";

// Mock Convex hooks
vi.mock("convex/react", () => ({
  useMutation: vi.fn(),
  useQuery: vi.fn(),
}));

// Mock the chat store
vi.mock("@/store/chat-store", () => ({
  useConversationStore: vi.fn(() => ({
    setSelectedConversation: vi.fn(),
  })),
}));

// Mock the toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock the API
vi.mock("../../../../../convex/_generated/api", () => ({
  api: {
    conversations: {
      createConversation: "createConversation",
      generateUploadUrl: "generateUploadUrl",
    },
    users: {
      getMe: "getMe",
      getUsers: "getUsers",
    },
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe("UserListDialog", () => {
  let mockCreateConversation: ReturnType<typeof vi.fn>;
  let mockGenerateUploadUrl: ReturnType<typeof vi.fn>;
  let mockSetSelectedConversation: ReturnType<typeof vi.fn>;

  const mockUsers = [
    {
      _id: "user1",
      name: "John Doe",
      email: "john@example.com",
      image: "https://example.com/john.jpg",
      tokenIdentifier: "token1",
      _creationTime: Date.now(),
      isOnline: true,
    },
    {
      _id: "user2",
      name: "Jane Smith",
      email: "jane@example.com",
      image: "https://example.com/jane.jpg",
      tokenIdentifier: "token2",
      _creationTime: Date.now(),
      isOnline: false,
    },
    {
      _id: "user3",
      name: "Bob Wilson",
      email: "bob@example.com",
      image: "https://example.com/bob.jpg",
      tokenIdentifier: "token3",
      _creationTime: Date.now(),
      isOnline: true,
    },
  ];

  const mockMe = {
    _id: "me",
    name: "Current User",
    email: "me@example.com",
    image: "https://example.com/me.jpg",
    tokenIdentifier: "token-me",
    _creationTime: Date.now(),
    isOnline: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateConversation = vi.fn();
    mockGenerateUploadUrl = vi.fn();
    mockSetSelectedConversation = vi.fn();

    // Get the mocked modules
    const convexReact = require("convex/react");
    const chatStore = require("@/store/chat-store");

    convexReact.useMutation.mockImplementation((mutation: string) => {
      if (mutation === "createConversation") {
        return mockCreateConversation;
      }
      if (mutation === "generateUploadUrl") {
        return mockGenerateUploadUrl;
      }
      return vi.fn();
    });

    convexReact.useQuery.mockImplementation((query: string) => {
      if (query === "getMe") {
        return mockMe;
      }
      if (query === "getUsers") {
        return mockUsers;
      }
      return null;
    });

    chatStore.useConversationStore.mockReturnValue({
      setSelectedConversation: mockSetSelectedConversation,
    });

    vi.mocked(global.fetch).mockResolvedValue({
      json: () => Promise.resolve({ storageId: "storage123" }),
    } as any);
  });

  it("renders dialog trigger", () => {
    render(<UserListDialog />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(screen.getByText("Start a new conversation")).toBeInTheDocument();
  });

  it("displays list of users", async () => {
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
  });

  it("allows selecting users", async () => {
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    await user.click(johnCheckbox);

    expect(johnCheckbox).toBeChecked();
  });

  it("allows selecting multiple users", async () => {
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    const janeCheckbox = screen.getByLabelText("Select Jane Smith");

    await user.click(johnCheckbox);
    await user.click(janeCheckbox);

    expect(johnCheckbox).toBeChecked();
    expect(janeCheckbox).toBeChecked();
  });

  it("creates individual conversation when one user is selected", async () => {
    mockCreateConversation.mockResolvedValue("conv123");
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    await user.click(johnCheckbox);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    expect(mockCreateConversation).toHaveBeenCalledWith({
      participants: ["user1", "me"],
      isGroup: false,
    });
  });

  it("creates group conversation when multiple users are selected", async () => {
    mockCreateConversation.mockResolvedValue("conv456");
    mockGenerateUploadUrl.mockResolvedValue("https://upload.url");
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    const janeCheckbox = screen.getByLabelText("Select Jane Smith");

    await user.click(johnCheckbox);
    await user.click(janeCheckbox);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    expect(mockCreateConversation).toHaveBeenCalledWith({
      participants: ["user1", "user2", "me"],
      isGroup: true,
      admin: "me",
      groupName: "",
      groupImage: "storage123",
    });
  });

  it("requires group image for group conversations", async () => {
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    const janeCheckbox = screen.getByLabelText("Select Jane Smith");

    await user.click(johnCheckbox);
    await user.click(janeCheckbox);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    expect(require("sonner").toast.error).toHaveBeenCalledWith(
      "Please select an image for the group",
    );
  });

  it("allows setting group name for group conversations", async () => {
    mockCreateConversation.mockResolvedValue("conv789");
    mockGenerateUploadUrl.mockResolvedValue("https://upload.url");
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    const janeCheckbox = screen.getByLabelText("Select Jane Smith");

    await user.click(johnCheckbox);
    await user.click(janeCheckbox);

    const groupNameInput = screen.getByPlaceholderText("Group name");
    await user.type(groupNameInput, "Test Group");

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    expect(mockCreateConversation).toHaveBeenCalledWith({
      participants: ["user1", "user2", "me"],
      isGroup: true,
      admin: "me",
      groupName: "Test Group",
      groupImage: "storage123",
    });
  });

  it("handles image selection for group conversations", async () => {
    mockCreateConversation.mockResolvedValue("conv101");
    mockGenerateUploadUrl.mockResolvedValue("https://upload.url");
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    const janeCheckbox = screen.getByLabelText("Select Jane Smith");

    await user.click(johnCheckbox);
    await user.click(janeCheckbox);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file = new File(["image content"], "group-image.jpg", { type: "image/jpeg" });

    await user.upload(imageInput, file);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    expect(mockCreateConversation).toHaveBeenCalledWith({
      participants: ["user1", "user2", "me"],
      isGroup: true,
      admin: "me",
      groupName: "",
      groupImage: "storage123",
    });
  });

  it("uploads image to storage before creating group conversation", async () => {
    mockCreateConversation.mockResolvedValue("conv202");
    mockGenerateUploadUrl.mockResolvedValue("https://upload.url");
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    const janeCheckbox = screen.getByLabelText("Select Jane Smith");

    await user.click(johnCheckbox);
    await user.click(janeCheckbox);

    const imageInput = screen.getByAcceptingFiles("image/*");
    const file = new File(["image content"], "group-image.jpg", { type: "image/jpeg" });

    await user.upload(imageInput, file);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    expect(mockGenerateUploadUrl).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith("https://upload.url", {
      method: "POST",
      headers: { "Content-Type": "image/jpeg" },
      body: file,
    });
  });

  it("sets selected conversation after successful creation", async () => {
    mockCreateConversation.mockResolvedValue("conv303");
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    await user.click(johnCheckbox);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    expect(mockSetSelectedConversation).toHaveBeenCalledWith({
      _id: "conv303",
      participants: ["user1"],
      isGroup: false,
      image: "https://example.com/john.jpg",
      name: "John Doe",
      admin: "me",
    });
  });

  it("closes dialog after successful conversation creation", async () => {
    mockCreateConversation.mockResolvedValue("conv404");
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    await user.click(johnCheckbox);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    await waitFor(() => {
      expect(screen.queryByText("Start a new conversation")).not.toBeInTheDocument();
    });
  });

  it("resets form after successful conversation creation", async () => {
    mockCreateConversation.mockResolvedValue("conv505");
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    await user.click(johnCheckbox);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    // Reopen dialog to check if form is reset
    await user.click(trigger);

    expect(screen.getByLabelText("Select John Doe")).not.toBeChecked();
  });

  it("handles conversation creation failure", async () => {
    mockCreateConversation.mockRejectedValue(new Error("Creation failed"));
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    await user.click(johnCheckbox);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    expect(require("sonner").toast.error).toHaveBeenCalledWith("Failed to create conversation");
  });

  it("disables start button when no users are selected", async () => {
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    expect(startButton).toBeDisabled();
  });

  it("enables start button when users are selected", async () => {
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    await user.click(johnCheckbox);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    expect(startButton).not.toBeDisabled();
  });

  it("shows loading state during conversation creation", async () => {
    mockCreateConversation.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve("conv606"), 100)),
    );
    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    const johnCheckbox = screen.getByLabelText("Select John Doe");
    await user.click(johnCheckbox);

    const startButton = screen.getByRole("button", { name: /start conversation/i });
    await user.click(startButton);

    expect(startButton).toBeDisabled();
    expect(startButton).toHaveTextContent(/loading/i);
  });

  it("handles users without names", async () => {
    const usersWithoutNames = [
      {
        ...mockUsers[0],
        name: null,
      },
    ];

    const convexReact = require("convex/react");
    convexReact.useQuery.mockImplementation((query: string) => {
      if (query === "getMe") {
        return mockMe;
      }
      if (query === "getUsers") {
        return usersWithoutNames;
      }
      return null;
    });

    const user = userEvent.setup();
    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    await user.click(trigger);

    // Should display email when name is not available
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("handles empty users array", () => {
    const convexReact = require("convex/react");
    convexReact.useQuery.mockImplementation((query: string) => {
      if (query === "getMe") {
        return mockMe;
      }
      if (query === "getUsers") {
        return [];
      }
      return null;
    });

    render(<UserListDialog />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });
});
