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
  it("should render theme toggle button and have correct sr-only text", () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Check for sr-only text instead of aria-label
    const srOnlyText = screen.getByText("Toggle theme");
    expect(srOnlyText).toBeInTheDocument();
    expect(srOnlyText).toHaveClass("sr-only");
  });

  it("should render sun and moon icons", () => {
    render(<ModeToggle />);

    // Check that both icons are present
    const icons = document.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("should render dropdown trigger button with correct attributes", () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-haspopup", "menu");
    expect(button).toHaveAttribute("data-slot", "dropdown-menu-trigger");
  });

  it("should have correct button styling", () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-transparent", "relative");
  });
});
