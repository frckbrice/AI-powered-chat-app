import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock the chat store globally for all tests
vi.mock("@/store/chat-store", () => ({
  useConversationStore: vi.fn(),
}));

// Mock the message utils globally for all tests
vi.mock("@/components/home/chat-bubble/api/message-utils", () => ({
  formatMessageTime: vi.fn(() => "12:00 PM"),
  getMessageBackgroundClass: vi.fn(() => "bg-white dark:bg-gray-primary"),
}));

// Also mock the relative path used by the chat bubble component
vi.mock("../../api/message-utils", () => ({
  formatMessageTime: vi.fn(() => "12:00 PM"),
  getMessageBackgroundClass: vi.fn(() => "bg-white dark:bg-gray-primary"),
}));
