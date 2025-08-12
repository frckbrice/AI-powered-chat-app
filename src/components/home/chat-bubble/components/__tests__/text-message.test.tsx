import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { TextMessage } from "../text-message";
import { IMessage } from "../../../../types";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("TextMessage", () => {
  const mockMessage: IMessage = {
    _id: "1",
    content: "Hello world",
    messageType: "text",
    sender: { _id: "user1", name: "Test User" },
    conversationId: "conv1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("renders text message correctly", () => {
    render(<TextMessage message={mockMessage} />);
    
    expect(screen.getByText("Hello world")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toHaveClass("mr-2", "text-sm", "font-light");
  });

  it("renders link message correctly", () => {
    const linkMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com",
    };
    
    render(<TextMessage message={linkMessage} />);
    
    const link = screen.getByRole("link", { name: "https://example.com" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveClass("mr-2", "text-sm", "font-light", "text-blue-400", "underline");
  });

  it("handles different link protocols", () => {
    const protocols = ["http://", "https://", "ftp://"];
    
    protocols.forEach(protocol => {
      const linkMessage: IMessage = {
        ...mockMessage,
        content: `${protocol}example.com`,
      };
      
      const { container } = render(<TextMessage message={linkMessage} />);
      expect(container.querySelector("a")).toBeInTheDocument();
    });
  });

  it("handles non-link text", () => {
    const nonLinkMessage: IMessage = {
      ...mockMessage,
      content: "This is not a link",
    };
    
    render(<TextMessage message={nonLinkMessage} />);
    
    expect(screen.getByText("This is not a link")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
