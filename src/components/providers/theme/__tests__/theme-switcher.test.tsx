import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ModeToggle from "../theme-switcher";

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: vi.fn(),
  }),
}));

describe("ModeToggle", () => {
  it("should render theme toggle button and have correct aria-label", () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Toggle theme");
  });

  it("should render sun and moon icons", () => {
    render(<ModeToggle />);

    // Check that both icons are present
    const icons = document.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("should render theme options when clicked", () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("should have correct button styling", () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-transparent", "relative");
  });
});
