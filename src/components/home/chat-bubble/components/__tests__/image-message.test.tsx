import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ImageMessage } from "../image-message";
import { IMessage } from "../../../../types";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    fill,
    className,
    alt,
    onClick,
  }: {
    src: string;
    fill: boolean;
    className: string;
    alt: string;
    onClick: () => void;
  }) => (
    <div
      data-testid="next-image"
      data-src={src}
      data-fill={fill.toString()}
      data-class={className}
      data-alt={alt}
      onClick={onClick}
      style={{ width: "100%", height: "100%" }}
    >
      Mock Image: {src}
    </div>
  ),
}));

describe("ImageMessage", () => {
  const mockMessage: IMessage = {
    _id: "1" as any,
    content: "https://example.com/image.jpg",
    messageType: "image",
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

  const mockHandleClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders image message", () => {
    render(<ImageMessage message={mockMessage} handleClick={mockHandleClick} />);
    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
  });

  it("displays image with correct src", () => {
    render(<ImageMessage message={mockMessage} handleClick={mockHandleClick} />);
    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-src", "https://example.com/image.jpg");
  });

  it("applies correct styling to container", () => {
    const { container } = render(
      <ImageMessage message={mockMessage} handleClick={mockHandleClick} />,
    );
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass("w-[250px]", "h-[250px]", "relative");
  });

  it("applies correct styling to image", () => {
    render(<ImageMessage message={mockMessage} handleClick={mockHandleClick} />);
    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-class", "cursor-pointer object-cover rounded");
  });

  it("sets fill property to true", () => {
    render(<ImageMessage message={mockMessage} handleClick={mockHandleClick} />);
    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-fill", "true");
  });

  it("sets correct alt text", () => {
    render(<ImageMessage message={mockMessage} handleClick={mockHandleClick} />);
    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-alt", "image");
  });

  it("calls handleClick when image is clicked", () => {
    render(<ImageMessage message={mockMessage} handleClick={mockHandleClick} />);
    const image = screen.getByTestId("next-image");

    fireEvent.click(image);
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with different image sources", () => {
    const differentMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com/different.jpg",
    };
    render(<ImageMessage message={differentMessage} handleClick={mockHandleClick} />);

    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-src", "https://example.com/different.jpg");
  });

  it("handles empty image source", () => {
    const emptyMessage: IMessage = {
      ...mockMessage,
      content: "",
    };
    render(<ImageMessage message={emptyMessage} handleClick={mockHandleClick} />);

    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-src", "");
  });

  it("handles special characters in image URL", () => {
    const specialMessage: IMessage = {
      ...mockMessage,
      content: "https://example.com/image with spaces.jpg",
    };
    render(<ImageMessage message={specialMessage} handleClick={mockHandleClick} />);

    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-src", "https://example.com/image with spaces.jpg");
  });

  it("maintains container dimensions", () => {
    const { container } = render(
      <ImageMessage message={mockMessage} handleClick={mockHandleClick} />,
    );
    const containerDiv = container.firstChild as HTMLElement;

    expect(containerDiv).toHaveClass("w-[250px]", "h-[250px]");
  });
});
