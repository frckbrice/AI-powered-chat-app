import { render, screen } from "@testing-library/react";
import React from "react";
import Conversation from "@/components/home/conversation";

const baseConversation = {
  _id: "1",
  admin: null,
  groupImage: null,
  groupName: "Group A",
  participants: [],
  _creationTime: Date.now(),
  lastMessage: {
    _id: "m1",
    messageType: "text" as const,
    content: "Hello world",
    sender: "user1",
    _creationTime: Date.now(),
  },
  sender: "user1",
  isOnline: true,
  isGroup: true,
};

describe("Conversation", () => {
  it("renders conversation name and last message text", () => {
    render(<Conversation conversation={baseConversation} />);
    expect(screen.getByText("Group A")).toBeInTheDocument();
    expect(screen.getByText(/Hello world/)).toBeInTheDocument();
  });

  it("renders media icon when last message is image", () => {
    render(
      <Conversation
        conversation={{
          ...baseConversation,
          lastMessage: { ...baseConversation.lastMessage!, messageType: "image" },
        }}
      />,
    );
    // the text is not shown for a non-text message
    expect(screen.queryByText(/Hello world/)).not.toBeInTheDocument();
  });
});
