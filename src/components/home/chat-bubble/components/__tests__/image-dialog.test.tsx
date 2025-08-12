import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ImageDialog } from "../image-dialog";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  default: ({ src, alt, className, fill }: any) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-fill={fill}
      data-testid="next-image"
    />
  ),
}));

describe("ImageDialog", () => {
  const mockProps = {
    src: "https://example.com/image.jpg",
    open: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when open is true", () => {
    render(<ImageDialog {...mockProps} />);
    
    // Check that the image is rendered
    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
  });

  it("displays image with correct src", () => {
    render(<ImageDialog {...mockProps} />);
    
    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(image).toHaveAttribute("alt", "image");
  });

  it("applies correct styling to image", () => {
    render(<ImageDialog {...mockProps} />);
    
    const image = screen.getByTestId("next-image");
    expect(image).toHaveClass("rounded-lg", "object-contain");
    expect(image).toHaveAttribute("data-fill", "true");
  });
});
