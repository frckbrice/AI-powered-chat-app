import { render, screen } from "@testing-library/react";
import ChatBubbleAvatar from "../chat-bubble-avatar";
import { IMessage } from "../../../../types";
import { describe, expect, it } from "vitest";

describe("ChatBubbleAvatar", () => {
  const mockMessage: IMessage = {
    _id: "1",
    content: "Hello world",
    messageType: "text",
    sender: { 
      _id: "user1", 
      name: "Test User",
      image: "https://example.com/avatar.jpg",
      isOnline: true
    },
    conversationId: "conv1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("renders nothing when not group and not from AI", () => {
    const { container } = render(
      <ChatBubbleAvatar 
        message={mockMessage} 
        isMember={false} 
        isGroup={false} 
        fromAI={false} 
      />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it("renders avatar when in group", () => {
    const { container } = render(
      <ChatBubbleAvatar 
        message={mockMessage} 
        isMember={true} 
        isGroup={true} 
        fromAI={false} 
      />
    );
    
    const avatar = container.querySelector('[data-slot="avatar"]');
    expect(avatar).toBeInTheDocument();
  });

  it("renders avatar when from AI", () => {
    const { container } = render(
      <ChatBubbleAvatar 
        message={mockMessage} 
        isMember={false} 
        isGroup={false} 
        fromAI={true} 
      />
    );
    
    const avatar = container.querySelector('[data-slot="avatar"]');
    expect(avatar).toBeInTheDocument();
  });

  it("shows online indicator when user is online and is member", () => {
    render(
      <ChatBubbleAvatar 
        message={mockMessage} 
        isMember={true} 
        isGroup={true} 
        fromAI={false} 
      />
    );
    
    const onlineIndicator = document.querySelector(".bg-green-500");
    expect(onlineIndicator).toBeInTheDocument();
  });

  it("does not show online indicator when user is not online", () => {
    const offlineMessage: IMessage = {
      ...mockMessage,
      sender: { ...mockMessage.sender, isOnline: false }
    };
    
    render(
      <ChatBubbleAvatar 
        message={offlineMessage} 
        isMember={true} 
        isGroup={true} 
        fromAI={false} 
      />
    );
    
    const onlineIndicator = document.querySelector(".bg-green-500");
    expect(onlineIndicator).not.toBeInTheDocument();
  });

  it("does not show online indicator when not a member", () => {
    render(
      <ChatBubbleAvatar 
        message={mockMessage} 
        isMember={false} 
        isGroup={true} 
        fromAI={false} 
      />
    );
    
    const onlineIndicator = document.querySelector(".bg-green-500");
    expect(onlineIndicator).not.toBeInTheDocument();
  });

  it("applies correct styling to avatar fallback", () => {
    const { container } = render(
      <ChatBubbleAvatar 
        message={mockMessage} 
        isMember={true} 
        isGroup={true} 
        fromAI={false} 
      />
    );
    
    const avatarFallback = container.querySelector('[data-slot="avatar-fallback"]');
    expect(avatarFallback).toHaveClass("bg-muted", "flex", "items-center", "justify-center", "rounded-full", "w-8", "h-8");
  });

  it("applies correct styling to container", () => {
    const { container } = render(
      <ChatBubbleAvatar 
        message={mockMessage} 
        isMember={true} 
        isGroup={true} 
        fromAI={false} 
      />
    );
    
    const avatarContainer = container.firstChild as HTMLElement;
    expect(avatarContainer).toHaveClass("overflow-visible", "relative");
  });
});
