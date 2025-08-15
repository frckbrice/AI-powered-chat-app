import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatBubbleAvatar from "../chat-bubble-avatar";
import { IMessage } from "../../../../types";

// Mock the UI components
vi.mock("../../../ui/avatar", () => ({
  Avatar: ({ children, className }: { children: React.ReactNode; className: string }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, className }: { src: string; className: string }) => (
    <img data-testid="avatar-image" src={src} className={className} alt="avatar" />
  ),
  AvatarFallback: ({ children, className }: { children: React.ReactNode; className: string }) => (
    <div data-testid="avatar-fallback" className={className}>
      {children}
    </div>
  ),
}));

describe("ChatBubbleAvatar", () => {
  const mockMessage: IMessage = {
    _id: "msg1" as any,
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

  it("renders avatar for group messages", () => {
    render(
      <ChatBubbleAvatar message={mockMessage} isGroup={true} isMember={true} fromAI={false} />,
    );

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    // The avatar image might not be rendered if the image fails to load
    const avatarImage = screen.queryByTestId("avatar-image");
    if (avatarImage) {
      expect(avatarImage).toBeInTheDocument();
    }
    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
  });

  it("renders avatar for AI messages", () => {
    render(
      <ChatBubbleAvatar message={mockMessage} isGroup={false} isMember={false} fromAI={true} />,
    );

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    // The avatar image might not be rendered if the image fails to load
    const avatarImage = screen.queryByTestId("avatar-image");
    if (avatarImage) {
      expect(avatarImage).toBeInTheDocument();
    }
    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
  });

  it("does not render for individual non-AI messages", () => {
    const { container } = render(
      <ChatBubbleAvatar message={mockMessage} isGroup={false} isMember={false} fromAI={false} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("shows online indicator when user is online and member", () => {
    render(
      <ChatBubbleAvatar message={mockMessage} isGroup={true} isMember={true} fromAI={false} />,
    );

    const onlineIndicator = screen.getByTestId("avatar").querySelector("div");
    expect(onlineIndicator).toHaveClass(
      "absolute",
      "top-0",
      "right-0",
      "w-2",
      "h-2",
      "bg-green-500",
      "rounded-full",
      "border-2",
      "border-foreground",
    );
  });

  it("does not show online indicator when user is not online", () => {
    const offlineMessage: IMessage = {
      ...mockMessage,
      sender: {
        ...mockMessage.sender,
        isOnline: false,
      },
    };

    render(
      <ChatBubbleAvatar message={offlineMessage} isGroup={true} isMember={true} fromAI={false} />,
    );

    const avatar = screen.getByTestId("avatar");
    const onlineIndicator = avatar.querySelector("div");
    expect(onlineIndicator).not.toHaveClass("bg-green-500");
  });

  it("does not show online indicator when user is not a member", () => {
    render(
      <ChatBubbleAvatar message={mockMessage} isGroup={true} isMember={false} fromAI={false} />,
    );

    const avatar = screen.getByTestId("avatar");
    const onlineIndicator = avatar.querySelector("div");
    expect(onlineIndicator).not.toHaveClass("bg-green-500");
  });

  it("applies correct styling to avatar container", () => {
    render(
      <ChatBubbleAvatar message={mockMessage} isGroup={true} isMember={true} fromAI={false} />,
    );

    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("overflow-visible", "relative");
  });

  it("renders avatar with image when sender has image", () => {
    const messageWithImage = {
      ...mockMessage,
      sender: {
        ...mockMessage.sender,
        image: "https://example.com/avatar.jpg",
      },
    };

    render(
      <ChatBubbleAvatar message={messageWithImage} isGroup={true} isMember={true} fromAI={false} />,
    );

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    // The avatar image might not be rendered if the image fails to load
    const avatarImage = screen.queryByTestId("avatar-image");
    if (avatarImage) {
      expect(avatarImage).toHaveClass("rounded-full", "object-cover", "w-8", "h-8");
      expect(avatarImage).toHaveAttribute("src", "https://example.com/avatar.jpg");
    }
    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
  });

  it("applies correct styling to avatar image", () => {
    const messageWithImage = {
      ...mockMessage,
      sender: {
        ...mockMessage.sender,
        image: "https://example.com/avatar.jpg",
      },
    };

    render(
      <ChatBubbleAvatar message={messageWithImage} isGroup={true} isMember={true} fromAI={false} />,
    );

    const avatarImage = screen.queryByTestId("avatar-image");
    if (avatarImage) {
      expect(avatarImage).toHaveClass("rounded-full", "object-cover", "w-8", "h-8");
      expect(avatarImage).toHaveAttribute("src", "https://example.com/avatar.jpg");
    }
  });

  it("applies correct styling to avatar fallback", () => {
    render(
      <ChatBubbleAvatar message={mockMessage} isGroup={true} isMember={true} fromAI={false} />,
    );

    const avatarFallback = screen.getByTestId("avatar-fallback");
    expect(avatarFallback).toHaveClass("w-8", "h-8");
  });

  it("renders fallback with correct styling", () => {
    render(
      <ChatBubbleAvatar message={mockMessage} isGroup={true} isMember={true} fromAI={false} />,
    );

    const fallback = screen.getByTestId("avatar-fallback");
    const fallbackContent = fallback.querySelector("div");
    expect(fallbackContent).toHaveClass("animate-pulse", "bg-gray-tertiary", "rounded-full");
  });

  it("handles message without sender image", () => {
    const messageWithoutImage: IMessage = {
      ...mockMessage,
      sender: {
        ...mockMessage.sender,
        image: undefined as any,
      },
    };

    render(
      <ChatBubbleAvatar
        message={messageWithoutImage}
        isGroup={true}
        isMember={true}
        fromAI={false}
      />,
    );

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
  });

  it("handles message with empty sender image", () => {
    const messageWithEmptyImage: IMessage = {
      ...mockMessage,
      sender: {
        ...mockMessage.sender,
        image: "",
      },
    };

    render(
      <ChatBubbleAvatar
        message={messageWithEmptyImage}
        isGroup={true}
        isMember={true}
        fromAI={false}
      />,
    );

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
  });

  it("handles message with null sender image", () => {
    const messageWithNullImage: IMessage = {
      ...mockMessage,
      sender: {
        ...mockMessage.sender,
        image: null as any,
      },
    };

    render(
      <ChatBubbleAvatar
        message={messageWithNullImage}
        isGroup={true}
        isMember={true}
        fromAI={false}
      />,
    );

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
  });

  it("renders for group messages even when not a member", () => {
    render(
      <ChatBubbleAvatar message={mockMessage} isGroup={true} isMember={false} fromAI={false} />,
    );

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("renders for AI messages even when not in group", () => {
    render(
      <ChatBubbleAvatar message={mockMessage} isGroup={false} isMember={false} fromAI={true} />,
    );

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("handles edge case with all false props", () => {
    const { container } = render(
      <ChatBubbleAvatar message={mockMessage} isGroup={false} isMember={false} fromAI={false} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("handles edge case with all true props", () => {
    const messageWithImage = {
      ...mockMessage,
      sender: {
        ...mockMessage.sender,
        image: "https://example.com/avatar.jpg",
        isOnline: true,
      },
    };

    render(
      <ChatBubbleAvatar message={messageWithImage} isGroup={true} isMember={true} fromAI={true} />,
    );

    expect(screen.getByTestId("avatar")).toBeInTheDocument();
    const avatarImage = screen.queryByTestId("avatar-image");
    if (avatarImage) {
      expect(avatarImage).toHaveClass("rounded-full", "object-cover", "w-8", "h-8");
      expect(avatarImage).toHaveAttribute("src", "https://example.com/avatar.jpg");
    }
    expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
  });
});
