import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import MessageInput from "../message-input";

// Mock the EmojiPickerComponent
vi.mock("./emoji-picker", () => ({
  EmojiPickerComponent: ({ onEmojiSelect }: any) => (
    <button data-testid="emoji-picker" onClick={() => onEmojiSelect("😊")}>
      😊
    </button>
  ),
}));

// Mock the MediaDropdown component
vi.mock("../../media-dropdown", () => ({
  default: () => <div data-testid="media-dropdown">Mock Media Dropdown</div>,
}));

// Mock the Input component
vi.mock("../../../ui/input", () => ({
  Input: ({ value, onChange, placeholder, className }: any) => (
    <input
      data-testid="message-input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  ),
}));

// Mock the Button component
vi.mock("../../../ui/button", () => ({
  Button: ({ children, type, onClick, className }: any) => (
    <button data-testid="button" type={type} onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

// Mock the store
vi.mock("../../../../store/chat-store", () => ({
  useConversationStore: vi.fn(() => ({
    selectedConversation: {
      _id: "conv1",
      name: "Test Conversation",
      participants: ["user1", "user2"],
      isGroup: false,
    },
  })),
}));

// Mock the message API hook
vi.mock("../api/message-api", () => ({
  useMessageAPI: vi.fn(() => ({
    sendTextMessage: vi.fn(() => Promise.resolve(true)),
    me: { _id: "user1", name: "Test User" },
    isLoading: false,
  })),
}));

describe("MessageInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders message input", () => {
    render(<MessageInput />);
    
    expect(screen.getByTestId("message-input")).toBeInTheDocument();
    expect(screen.getByTestId("emoji-picker")).toBeInTheDocument();
    expect(screen.getByTestId("media-dropdown")).toBeInTheDocument();
  });

  it("renders input with correct placeholder", () => {
    render(<MessageInput />);
    
    const input = screen.getByTestId("message-input");
    expect(input).toHaveAttribute("placeholder", "Type a message");
  });

  it("shows mic button when no text is entered", () => {
    render(<MessageInput />);
    
    const micButton = screen.getByTestId("button");
    expect(micButton).toBeInTheDocument();
  });

  it("shows send button when text is entered", () => {
    render(<MessageInput />);
    
    const input = screen.getByTestId("message-input");
    fireEvent.change(input, { target: { value: "Hello" } });
    
    const sendButton = screen.getByTestId("button");
    expect(sendButton).toBeInTheDocument();
  });

  it("updates input value when typing", () => {
    render(<MessageInput />);
    
    const input = screen.getByTestId("message-input");
    fireEvent.change(input, { target: { value: "Hello world" } });
    
    expect(input).toHaveValue("Hello world");
  });

  it("adds emoji to input when emoji is selected", () => {
    render(<MessageInput />);
    
    const emojiButton = screen.getByTestId("emoji-picker");
    fireEvent.click(emojiButton);
    
    const input = screen.getByTestId("message-input");
    expect(input).toHaveValue("😊");
  });

  it("applies correct styling to container", () => {
    const { container } = render(<MessageInput />);
    
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass("bg-gray-primary", "p-2", "flex", "gap-4", "items-center");
  });

  it("applies correct styling to input", () => {
    render(<MessageInput />);
    
    const input = screen.getByTestId("message-input");
    expect(input).toHaveClass("py-2", "text-sm", "w-full", "rounded-xl", "shadow-sm", "bg-gray-tertiary");
  });
});
