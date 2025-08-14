import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DateIndicator from "../date-indicator";
import { IMessage } from "../../../../types";

// Mock the utils functions
vi.mock("@/lib/utils", () => ({
  getRelativeDateTime: vi.fn(() => "Today"),
  isSameDay: vi.fn(),
}));

import { getRelativeDateTime, isSameDay } from "@/lib/utils";

describe("DateIndicator", () => {
  const mockMessage: IMessage = {
    _id: "1" as any,
    content: "Hello world",
    messageType: "text",
    sender: {
      _id: "user1" as any,
      name: "Test User",
      image: "https://example.com/avatar.jpg",
      tokenIdentifier: "test-token",
      email: "test@example.com",
      _creationTime: 1234567890,
      isOnline: true,
    },
    _creationTime: 1234567890,
  };

  const mockPreviousMessage: IMessage = {
    _id: "2" as any,
    content: "Previous message",
    messageType: "text",
    sender: {
      _id: "user2" as any,
      name: "Test User 2",
      image: "https://example.com/avatar2.jpg",
      tokenIdentifier: "test-token-2",
      email: "test2@example.com",
      _creationTime: 1234567890,
      isOnline: false,
    },
    _creationTime: 1234567890,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders date indicator when no previous message", () => {
    (isSameDay as any).mockReturnValue(false);
    (getRelativeDateTime as any).mockReturnValue("Today");

    render(<DateIndicator message={mockMessage} />);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("renders date indicator when different days", () => {
    (isSameDay as any).mockReturnValue(false);
    (getRelativeDateTime as any).mockReturnValue("Yesterday");

    render(<DateIndicator message={mockMessage} previousMessage={mockPreviousMessage} />);
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
  });

  it("does not render when same day", () => {
    (isSameDay as any).mockReturnValue(true);

    const { container } = render(
      <DateIndicator message={mockMessage} previousMessage={mockPreviousMessage} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("calls isSameDay with correct parameters", () => {
    (isSameDay as any).mockReturnValue(false);
    (getRelativeDateTime as any).mockReturnValue("Today");

    render(<DateIndicator message={mockMessage} previousMessage={mockPreviousMessage} />);
    expect(isSameDay).toHaveBeenCalledWith(
      mockPreviousMessage._creationTime,
      mockMessage._creationTime,
    );
  });

  it("calls getRelativeDateTime with correct parameters", () => {
    (isSameDay as any).mockReturnValue(false);
    (getRelativeDateTime as any).mockReturnValue("Today");

    render(<DateIndicator message={mockMessage} previousMessage={mockPreviousMessage} />);
    expect(getRelativeDateTime).toHaveBeenCalledWith(mockMessage, mockPreviousMessage);
  });

  it("renders with correct container styling", () => {
    (isSameDay as any).mockReturnValue(false);
    (getRelativeDateTime as any).mockReturnValue("Today");

    const { container } = render(<DateIndicator message={mockMessage} />);
    const dateContainer = container.querySelector("div");
    expect(dateContainer).toHaveClass("flex", "justify-center");
  });

  it("renders with correct text styling", () => {
    (isSameDay as any).mockReturnValue(false);
    (getRelativeDateTime as any).mockReturnValue("Today");

    render(<DateIndicator message={mockMessage} />);
    const dateText = screen.getByText("Today");
    expect(dateText).toHaveClass(
      "text-sm",
      "text-gray-500",
      "dark:text-gray-400",
      "mb-2",
      "p-1",
      "z-50",
      "rounded-md",
      "bg-white",
      "dark:bg-gray-primary",
    );
  });

  it("handles different date formats", () => {
    (isSameDay as any).mockReturnValue(false);
    (getRelativeDateTime as any).mockReturnValue("Last week");

    render(<DateIndicator message={mockMessage} />);
    expect(screen.getByText("Last week")).toBeInTheDocument();
  });

  it("handles edge case with null previous message", () => {
    (isSameDay as any).mockReturnValue(false);
    (getRelativeDateTime as any).mockReturnValue("Today");

    render(<DateIndicator message={mockMessage} previousMessage={undefined} />);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });

  it("handles edge case with empty previous message", () => {
    (isSameDay as any).mockReturnValue(false);
    (getRelativeDateTime as any).mockReturnValue("Today");

    render(<DateIndicator message={mockMessage} previousMessage={{} as IMessage} />);
    expect(screen.getByText("Today")).toBeInTheDocument();
  });
});
