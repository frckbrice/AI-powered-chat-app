import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MessageInput from "../message-input";

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

// Mock the message API
vi.mock("../api/message-api", () => ({
  useMessageAPI: vi.fn(() => ({
    sendTextMessage: vi.fn(),
  })),
}));

// Mock the media dropdown
vi.mock("../../media-dropdown", () => ({
  default: () => <div data-testid="media-dropdown">Media Dropdown</div>,
}));

// Mock the emoji picker
vi.mock("./emoji-picker", () => ({
  EmojiPickerComponent: ({ onEmojiSelect }: { onEmojiSelect: (emoji: string) => void }) => (
    <button data-testid="emoji-picker" onClick={() => onEmojiSelect("😊")}>
      😊
    </button>
  ),
}));

describe("MessageInput", () => {
  let mockSendTextMessage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSendTextMessage = vi.fn();

    // Get the mocked module and set up the mock
    const messageApi = require("../api/message-api");
    messageApi.useMessageAPI.mockReturnValue({
      sendTextMessage: mockSendTextMessage,
    });
  });

  it("renders message input with placeholder", () => {
    render(<MessageInput />);
    expect(screen.getByPlaceholderText("Type a message")).toBeInTheDocument();
  });

  it("renders emoji picker and media dropdown", () => {
    render(<MessageInput />);
    expect(screen.getByTestId("emoji-picker")).toBeInTheDocument();
    expect(screen.getByTestId("media-dropdown")).toBeInTheDocument();
  });

  it("shows mic button initially and send button after typing", async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    // Initially should show mic button
    expect(screen.getByTestId("mic-button")).toBeInTheDocument();
    expect(screen.queryByTestId("send-button")).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText("Type a message");
    await user.type(input, "Hello");

    // After typing, should show send button and hide mic button
    expect(screen.getByTestId("send-button")).toBeInTheDocument();
    expect(screen.queryByTestId("mic-button")).not.toBeInTheDocument();
  });

  it("shows mic icon when no text is entered", () => {
    render(<MessageInput />);

    const micButton = screen.getByTestId("mic-button");
    expect(micButton).toBeInTheDocument();
  });

  it("shows send icon when text is entered", async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message");
    await user.type(input, "Hello");

    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /mic/i })).not.toBeInTheDocument();
  });

  it("updates input value when typing", async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message");
    await user.type(input, "Hello world");

    expect(input).toHaveValue("Hello world");
  });

  it("handles emoji selection", async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message");
    await user.type(input, "Hello");

    const emojiButton = screen.getByTestId("emoji-picker");
    await user.click(emojiButton);

    expect(input).toHaveValue("Hello😊");
  });

  it("sends message when form is submitted with text", async () => {
    mockSendTextMessage.mockResolvedValue(true);
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message");
    await user.type(input, "Hello world");

    const sendButton = screen.getByRole("button", { name: /send/i });
    await user.click(sendButton);

    expect(mockSendTextMessage).toHaveBeenCalledWith("Hello world", "conv1");
  });

  it("clears input after successful message send", async () => {
    mockSendTextMessage.mockResolvedValue(true);
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message");
    await user.type(input, "Hello world");

    const sendButton = screen.getByRole("button", { name: /send/i });
    await user.click(sendButton);

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("does not send message when input is empty", async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    const sendButton = screen.getByRole("button", { name: /mic/i });
    await user.click(sendButton);

    expect(mockSendTextMessage).not.toHaveBeenCalled();
  });

  it("does not send message when input only contains whitespace", async () => {
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message");
    await user.type(input, "   ");

    const sendButton = screen.getByRole("button", { name: /send/i });
    await user.click(sendButton);

    expect(mockSendTextMessage).not.toHaveBeenCalled();
  });

  it("does not send message when no conversation is selected", () => {
    const chatStore = require("@/store/chat-store");
    chatStore.useConversationStore.mockReturnValue({
      selectedConversation: null,
    });

    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message");
    user.type(input, "Hello");

    const sendButton = screen.getByRole("button", { name: /send/i });
    user.click(sendButton);

    expect(mockSendTextMessage).not.toHaveBeenCalled();
  });

  it("handles failed message send", async () => {
    mockSendTextMessage.mockResolvedValue(false);
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message");
    await user.type(input, "Hello world");

    const sendButton = screen.getByRole("button", { name: /send/i });
    await user.click(sendButton);

    expect(mockSendTextMessage).toHaveBeenCalledWith("Hello world", "conv1");
    // Input should not be cleared on failure
    expect(input).toHaveValue("Hello world");
  });

  it("submits form when Enter key is pressed", async () => {
    mockSendTextMessage.mockResolvedValue(true);
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message");
    await user.type(input, "Hello world");
    await user.keyboard("{Enter}");

    expect(mockSendTextMessage).toHaveBeenCalledWith("Hello world", "conv1");
  });

  it("trims whitespace from message before sending", async () => {
    mockSendTextMessage.mockResolvedValue(true);
    const user = userEvent.setup();
    render(<MessageInput />);

    const input = screen.getByPlaceholderText("Type a message");
    await user.type(input, "  Hello world  ");

    const sendButton = screen.getByRole("button", { name: /send/i });
    await user.click(sendButton);

    expect(mockSendTextMessage).toHaveBeenCalledWith("Hello world", "conv1");
  });
});
