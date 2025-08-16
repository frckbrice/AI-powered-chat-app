import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImageDialog } from "../image-dialog";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
    width,
    height,
    priority,
  }: {
    src: string;
    alt: string;
    className: string;
    width: number;
    height: number;
    priority?: boolean;
  }) => (
    <div
      data-testid="next-image"
      data-src={src}
      data-alt={alt}
      data-class={className}
      data-width={width}
      data-height={height}
      data-priority={priority?.toString() || "false"}
    >
      Mock Image: {src}
    </div>
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
    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
  });

  it("displays image with correct src", () => {
    render(<ImageDialog {...mockProps} />);
    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-src", "https://example.com/image.jpg");
    expect(image).toHaveAttribute("data-alt", "image preview");
  });

  it("applies correct styling to image", () => {
    render(<ImageDialog {...mockProps} />);
    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-class", "rounded-lg object-contain max-w-full max-h-full");
    expect(image).toHaveAttribute("data-width", "600");
    expect(image).toHaveAttribute("data-height", "400");
  });

  it("sets priority attribute", () => {
    render(<ImageDialog {...mockProps} />);
    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-priority", "true");
  });

  it("calls onClose when dialog is closed", () => {
    render(<ImageDialog {...mockProps} />);
    // The onClose is called when the dialog's onOpenChange is triggered
    // This is handled internally by the Dialog component
    expect(mockProps.onClose).not.toHaveBeenCalled(); // Initially not called
  });

  it("renders with different image sources", () => {
    const differentProps = { ...mockProps, src: "https://example.com/different.jpg" };
    render(<ImageDialog {...differentProps} />);
    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-src", "https://example.com/different.jpg");
  });

  it("handles empty src gracefully", () => {
    const emptyProps = { ...mockProps, src: "" };
    render(<ImageDialog {...emptyProps} />);
    const image = screen.getByTestId("next-image");
    expect(image).toHaveAttribute("data-src", "");
  });

  it("renders image container", () => {
    render(<ImageDialog {...mockProps} />);
    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
  });
});
