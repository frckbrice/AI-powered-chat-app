import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatPlaceHolder from "../chat-placeholder";

// Mock Next.js Image component
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => <img src={src} alt={alt} width={width} height={height} data-testid="hero-image" />,
}));

describe("ChatPlaceHolder", () => {
  it("renders the welcome message", () => {
    render(<ChatPlaceHolder />);
    expect(screen.getByText("Welcome to Chat")).toBeInTheDocument();
  });

  it("renders the hero image", () => {
    render(<ChatPlaceHolder />);
    const heroImage = screen.getByTestId("hero-image");
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("src", "/desktop-hero.png");
    expect(heroImage).toHaveAttribute("alt", "Hero");
  });

  it("renders the instruction text", () => {
    render(<ChatPlaceHolder />);
    expect(
      screen.getByText(
        "Select a conversation from the sidebar to start chatting with your contacts.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the encryption message", () => {
    render(<ChatPlaceHolder />);
    expect(screen.getByText("Your personal messages are end-to-end encrypted")).toBeInTheDocument();
  });

  it("renders the lock icon", () => {
    render(<ChatPlaceHolder />);
    const lockIcon = screen.getByRole("img", { hidden: true });
    expect(lockIcon).toBeInTheDocument();
  });

  it("applies correct styling to main container", () => {
    const { container } = render(<ChatPlaceHolder />);
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass(
      "w-3/4",
      "bg-gray-secondary",
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "py-10",
    );
  });

  it("applies correct styling to content container", () => {
    const { container } = render(<ChatPlaceHolder />);
    const contentContainer = container.querySelector(
      ".flex.flex-col.items-center.w-full.justify-center.py-10.gap-4",
    );
    expect(contentContainer).toBeInTheDocument();
  });

  it("applies correct styling to welcome text", () => {
    render(<ChatPlaceHolder />);
    const welcomeText = screen.getByText("Welcome to Chat");
    expect(welcomeText).toHaveClass("text-3xl", "font-extralight", "mt-5", "mb-2");
  });

  it("applies correct styling to instruction text", () => {
    render(<ChatPlaceHolder />);
    const instructionText = screen.getByText(
      "Select a conversation from the sidebar to start chatting with your contacts.",
    );
    expect(instructionText).toHaveClass(
      "w-1/2",
      "text-center",
      "text-gray-primary",
      "text-sm",
      "text-muted-foreground",
    );
  });

  it("applies correct styling to encryption message", () => {
    render(<ChatPlaceHolder />);
    const encryptionText = screen.getByText("Your personal messages are end-to-end encrypted");
    expect(encryptionText).toHaveClass(
      "w-1/2",
      "mt-auto",
      "text-center",
      "text-gray-primary",
      "text-xs",
      "text-muted-foreground",
      "flex",
      "items-center",
      "justify-center",
      "gap-1",
    );
  });
});
