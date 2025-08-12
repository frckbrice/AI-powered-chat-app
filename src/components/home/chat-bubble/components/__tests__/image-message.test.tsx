import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ImageMessage } from "../image-message";
import { IMessage } from "../../../../types";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, onClick, className, fill }: any) => (
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      className={className}
      data-fill={fill}
      data-testid="next-image"
    />
  ),
}));

describe("ImageMessage", () => {
  const mockMessage: IMessage = {
    _id: "1",
    content: "https://example.com/image.jpg",
    messageType: "image",
    sender: { _id: "user1", name: "Test User" },
    conversationId: "conv1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockHandleClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders image message correctly", () => {
    render(<ImageMessage message={mockMessage} handleClick={mockHandleClick} />);
    
    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(image).toHaveAttribute("alt", "image");
    expect(image).toHaveAttribute("data-fill", "true");
  });

  it("applies correct styling to container", () => {
    const { container } = render(
      <ImageMessage message={mockMessage} handleClick={mockHandleClick} />
    );
    
    const imageContainer = container.firstChild as HTMLElement;
    expect(imageContainer).toHaveClass("w-[250px]", "h-[250px]", "relative");
  });

  it("applies correct styling to image", () => {
    render(<ImageMessage message={mockMessage} handleClick={mockHandleClick} />);
    
    const image = screen.getByTestId("next-image");
    expect(image).toHaveClass("cursor-pointer", "object-cover", "rounded");
  });

  it("calls handleClick when image is clicked", () => {
    render(<ImageMessage message={mockMessage} handleClick={mockHandleClick} />);
    
    const image = screen.getByTestId("next-image");
    image.click();
    
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });

  it("handles different image URLs", () => {
    const imageUrls = [
      "https://example.com/photo.jpg",
      "https://cdn.example.com/image.png",
      "https://images.example.com/photo.gif"
    ];
    
    imageUrls.forEach((url, index) => {
      const messageWithUrl: IMessage = {
        ...mockMessage,
        content: url,
      };
      
      const { getByTestId } = render(
        <ImageMessage message={messageWithUrl} handleClick={mockHandleClick} />
      );
      
      const image = getByTestId("next-image");
      expect(image).toHaveAttribute("src", url);
      
      // Clean up after each test to avoid multiple elements
      document.body.innerHTML = "";
    });
  });

  it("renders with correct dimensions", () => {
    const { container } = render(
      <ImageMessage message={mockMessage} handleClick={mockHandleClick} />
    );
    
    const imageContainer = container.firstChild as HTMLElement;
    expect(imageContainer).toHaveClass("w-[250px]", "h-[250px]");
  });
});
