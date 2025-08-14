import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextMessage } from "../text-message";
import { IMessage } from "../../../../types";

// Mock Next.js Link component
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    target,
    rel,
    className,
    children,
  }: {
    href: string;
    target: string;
    rel: string;
    className: string;
    children: React.ReactNode;
  }) => (
    <a href={href} target={target} rel={rel} className={className} data-testid="link">
      {children}
    </a>
  ),
}));

describe("TextMessage", () => {
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

  it("renders text message when content is not a link", () => {
    render(<TextMessage message={mockMessage} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders link when content is a valid URL", () => {
    const linkMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com",
    };
    render(<TextMessage message={linkMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders link with correct styling when content is a URL", () => {
    const linkMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com",
    };
    render(<TextMessage message={linkMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toHaveClass("mr-2", "text-sm", "font-light", "text-blue-400", "underline");
  });

  it("renders text with correct styling when content is not a URL", () => {
    render(<TextMessage message={mockMessage} />);

    const text = screen.getByText("Hello world");
    expect(text).toHaveClass("mr-2", "text-sm", "font-light");
  });

  it("handles HTTP URLs", () => {
    const httpMessage: IMessage = {
      ...mockMessage,
      content: "http://example.com",
    };
    render(<TextMessage message={httpMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("href", "http://example.com");
  });

  it("handles FTP URLs", () => {
    const ftpMessage: IMessage = {
      ...mockMessage,
      content: "ftp://example.com",
    };
    render(<TextMessage message={ftpMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("href", "ftp://example.com");
  });

  it("does not render link for invalid URLs", () => {
    const invalidUrlMessage: IMessage = {
      ...mockMessage,
      content: "not-a-url",
    };
    render(<TextMessage message={invalidUrlMessage} />);

    expect(screen.queryByTestId("link")).not.toBeInTheDocument();
    expect(screen.getByText("not-a-url")).toBeInTheDocument();
  });

  it("does not render link for URLs with spaces", () => {
    const spacedUrlMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com with spaces",
    };
    render(<TextMessage message={spacedUrlMessage} />);

    expect(screen.queryByTestId("link")).not.toBeInTheDocument();
    expect(screen.getByText("https://example.com with spaces")).toBeInTheDocument();
  });

  it("handles empty content", () => {
    const emptyMessage: IMessage = {
      ...mockMessage,
      content: "",
    };
    const { container } = render(<TextMessage message={emptyMessage} />);

    const textElement = container.querySelector("p");
    expect(textElement).toBeInTheDocument();
    expect(textElement?.textContent).toBe("");
  });

  it("handles special characters in non-URL content", () => {
    const specialMessage: IMessage = {
      ...mockMessage,
      content: "Hello @world! #test",
    };
    render(<TextMessage message={specialMessage} />);

    expect(screen.getByText("Hello @world! #test")).toBeInTheDocument();
    expect(screen.queryByTestId("link")).not.toBeInTheDocument();
  });

  it("handles URLs with query parameters", () => {
    const queryUrlMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com?param=value&another=123",
    };
    render(<TextMessage message={queryUrlMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com?param=value&another=123");
  });

  it("handles URLs with fragments", () => {
    const fragmentUrlMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com#section",
    };
    render(<TextMessage message={fragmentUrlMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com#section");
  });

  it("handles URLs with subdomains", () => {
    const subdomainMessage: IMessage = {
      ...mockMessage,
      content: "https://sub.example.com",
    };
    render(<TextMessage message={subdomainMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://sub.example.com");
  });

  it("handles URLs with ports", () => {
    const portMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com:8080",
    };
    render(<TextMessage message={portMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com:8080");
  });

  it("does not render link for URLs with leading/trailing whitespace", () => {
    const whitespaceMessage: IMessage = {
      ...mockMessage,
      content: "  https://example.com  ",
    };
    render(<TextMessage message={whitespaceMessage} />);

    expect(screen.queryByTestId("link")).not.toBeInTheDocument();
    // Use a more flexible text matcher since the text might be normalized
    expect(screen.getByText(/https:\/\/example\.com/)).toBeInTheDocument();
  });

  it("handles very long text content", () => {
    const longText = "a".repeat(1000);
    const longMessage: IMessage = {
      ...mockMessage,
      content: longText,
    };
    render(<TextMessage message={longMessage} />);

    expect(screen.getByText(longText)).toBeInTheDocument();
    expect(screen.queryByTestId("link")).not.toBeInTheDocument();
  });

  it("handles very long URL content", () => {
    const longUrl = "https://example.com/" + "a".repeat(1000);
    const longUrlMessage: IMessage = {
      ...mockMessage,
      content: longUrl,
    };
    render(<TextMessage message={longUrlMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", longUrl);
  });

  it("ensures link has proper accessibility attributes", () => {
    const linkMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com",
    };
    render(<TextMessage message={linkMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("handles mixed content with URL at end", () => {
    const mixedMessage: IMessage = {
      ...mockMessage,
      content: "Check out this link: https://example.com",
    };
    render(<TextMessage message={mixedMessage} />);

    // Should not render as link since it's not a pure URL
    expect(screen.queryByTestId("link")).not.toBeInTheDocument();
    expect(screen.getByText("Check out this link: https://example.com")).toBeInTheDocument();
  });

  it("handles URLs with special characters in path", () => {
    const specialPathMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com/path/with/special-chars!@#$%^&*()",
    };
    render(<TextMessage message={specialPathMessage} />);

    const link = screen.getByTestId("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com/path/with/special-chars!@#$%^&*()");
  });
});
