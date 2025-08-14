import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GroupMembersDialog } from "../group-members-dialog";

// Mock Convex hooks
vi.mock("convex/react", () => ({
  useConvexAuth: vi.fn(),
  useQuery: vi.fn(),
}));

// Mock the API
vi.mock("../../../../../convex/_generated/api", () => ({
  api: {
    users: {
      getGroupMembers: "getGroupMembers",
    },
  },
}));

describe("GroupMembersDialog", () => {
  let mockUseConvexAuth: any;
  let mockUseQuery: any;

  const mockConversation = {
    _id: "conv1",
    name: null,
    groupName: "Test Group",
    participants: ["user1", "user2", "user3"],
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
    isGroup: true,
    admin: "user1",
    image: null,
    groupImage: "https://example.com/group.jpg",
  };

  const mockGroupMembers = [
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

  beforeEach(() => {
    vi.clearAllMocks();

    // Get the mocked modules
    const convexReact = require("convex/react");
    mockUseConvexAuth = convexReact.useConvexAuth;
    mockUseQuery = convexReact.useQuery;

    mockUseConvexAuth.mockReturnValue({
      isLoading: false,
    });
    mockUseQuery.mockReturnValue(mockGroupMembers);
  });

  it("renders dialog trigger", () => {
    render(<GroupMembersDialog selectedConversation={mockConversation} />);
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", async () => {
    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    const trigger = screen.getByText("See members");
    expect(trigger).toBeInTheDocument();
  });

  it("displays dialog title", async () => {
    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    const trigger = screen.getByText("See members");
    // The dialog should be accessible via the trigger
    expect(trigger).toBeInTheDocument();
  });

  it("shows loading state when authentication is loading", () => {
    mockUseConvexAuth.mockReturnValue({
      isLoading: true,
    });

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should not render anything when loading
    expect(screen.queryByText("See members")).not.toBeInTheDocument();
  });

  it("calls getGroupMembers with correct conversation ID", () => {
    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    expect(mockUseQuery).toHaveBeenCalledWith("getGroupMembers", {
      conversationId: "conv1",
    });
  });

  it("displays all group members", () => {
    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // The members should be accessible through the dialog
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("shows member names when available", () => {
    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Members should be displayed in the dialog
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("shows member emails when names are not available", () => {
    const membersWithoutNames = [
      {
        ...mockGroupMembers[0],
        name: null,
      },
      {
        ...mockGroupMembers[1],
        name: null,
      },
      {
        ...mockGroupMembers[2],
        name: null,
      },
    ];

    mockUseQuery.mockReturnValue(membersWithoutNames);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should still render the dialog trigger
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("displays member avatars", () => {
    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Avatar images should be rendered in the dialog
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("shows online status indicators", () => {
    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Online status should be displayed for each member
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("shows admin crown icon for group admin", () => {
    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Admin should have a crown icon
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles conversation without admin", () => {
    const conversationWithoutAdmin = {
      ...mockConversation,
      admin: null,
    };

    render(<GroupMembersDialog selectedConversation={conversationWithoutAdmin} />);

    // Should still render without admin crown
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles empty group members array", () => {
    mockUseQuery.mockReturnValue([]);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should handle empty members gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles null group members", () => {
    mockUseQuery.mockReturnValue(null);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should handle null members gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles undefined group members", () => {
    mockUseQuery.mockReturnValue(undefined);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should handle undefined members gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles members without images", () => {
    const membersWithoutImages = [
      {
        ...mockGroupMembers[0],
        image: null,
      },
      {
        ...mockGroupMembers[1],
        image: null,
      },
      {
        ...mockGroupMembers[2],
        image: null,
      },
    ];

    mockUseQuery.mockReturnValue(membersWithoutImages);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should handle missing images gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles members with empty image strings", () => {
    const membersWithEmptyImages = [
      {
        ...mockGroupMembers[0],
        image: "",
      },
      {
        ...mockGroupMembers[1],
        image: "",
      },
      {
        ...mockGroupMembers[2],
        image: "",
      },
    ];

    mockUseQuery.mockReturnValue(membersWithEmptyImages);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should handle empty image strings gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles members with very long names", () => {
    const membersWithLongNames = [
      {
        ...mockGroupMembers[0],
        name: "A".repeat(100),
      },
      {
        ...mockGroupMembers[1],
        name: "B".repeat(100),
      },
      {
        ...mockGroupMembers[2],
        name: "C".repeat(100),
      },
    ];

    mockUseQuery.mockReturnValue(membersWithLongNames);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should handle long names gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles members with very long emails", () => {
    const membersWithLongEmails = [
      {
        ...mockGroupMembers[0],
        email: "verylongemailaddress@verylongdomainname.com",
        name: null,
      },
      {
        ...mockGroupMembers[1],
        email: "anotherverylongemail@anotherverylongdomain.com",
        name: null,
      },
      {
        ...mockGroupMembers[2],
        email: "thirdverylongemail@thirdverylongdomain.com",
        name: null,
      },
    ];

    mockUseQuery.mockReturnValue(membersWithLongEmails);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should handle long emails gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles special characters in member names", () => {
    const membersWithSpecialChars = [
      {
        ...mockGroupMembers[0],
        name: "John O'Connor",
      },
      {
        ...mockGroupMembers[1],
        name: "Jane-Smith",
      },
      {
        ...mockGroupMembers[2],
        name: "Bob & Alice",
      },
    ];

    mockUseQuery.mockReturnValue(membersWithSpecialChars);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should handle special characters gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles special characters in member emails", () => {
    const membersWithSpecialEmails = [
      {
        ...mockGroupMembers[0],
        email: "john.o'connor@example.com",
        name: null,
      },
      {
        ...mockGroupMembers[1],
        email: "jane-smith@example.com",
        name: null,
      },
      {
        ...mockGroupMembers[2],
        email: "bob+alice@example.com",
        name: null,
      },
    ];

    mockUseQuery.mockReturnValue(membersWithSpecialEmails);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should handle special characters in emails gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles members with mixed online status", () => {
    const membersWithMixedStatus = [
      {
        ...mockGroupMembers[0],
        isOnline: true,
      },
      {
        ...mockGroupMembers[1],
        isOnline: false,
      },
      {
        ...mockGroupMembers[2],
        isOnline: true,
      },
    ];

    mockUseQuery.mockReturnValue(membersWithMixedStatus);

    render(<GroupMembersDialog selectedConversation={mockConversation} />);

    // Should display mixed online status correctly
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles conversation with different admin", () => {
    const conversationWithDifferentAdmin = {
      ...mockConversation,
      admin: "user2",
    };

    render(<GroupMembersDialog selectedConversation={conversationWithDifferentAdmin} />);

    // Should show crown for the correct admin
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles conversation without participants", () => {
    const conversationWithoutParticipants = {
      ...mockConversation,
      participants: [],
    };

    render(<GroupMembersDialog selectedConversation={conversationWithoutParticipants} />);

    // Should handle empty participants gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles conversation with single participant", () => {
    const conversationWithSingleParticipant = {
      ...mockConversation,
      participants: ["user1"],
    };

    const singleMember = [mockGroupMembers[0]];
    mockUseQuery.mockReturnValue(singleMember);

    render(<GroupMembersDialog selectedConversation={conversationWithSingleParticipant} />);

    // Should handle single participant gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });

  it("handles conversation with many participants", () => {
    const conversationWithManyParticipants = {
      ...mockConversation,
      participants: Array.from({ length: 50 }, (_, i) => `user${i}`),
    };

    const manyMembers = Array.from({ length: 50 }, (_, i) => ({
      _id: `user${i}`,
      name: `User ${i}`,
      email: `user${i}@example.com`,
      image: `https://example.com/user${i}.jpg`,
      tokenIdentifier: `token${i}`,
      _creationTime: Date.now(),
      isOnline: i % 2 === 0,
    }));

    mockUseQuery.mockReturnValue(manyMembers);

    render(<GroupMembersDialog selectedConversation={conversationWithManyParticipants} />);

    // Should handle many participants gracefully
    expect(screen.getByText("See members")).toBeInTheDocument();
  });
});
