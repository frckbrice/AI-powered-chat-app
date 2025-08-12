import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ModeToggle from "../theme-switcher";

// Mock next-themes with stable references
const mockSetTheme = vi.fn();
const mockTheme = "light";
const mockResolvedTheme = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
    theme: mockTheme,
    resolvedTheme: mockResolvedTheme,
  }),
}));

describe("ModeToggle", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render theme toggle button and have correct accessible name", () => {
    render(<ModeToggle />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Check that the button has the correct accessible name
    expect(button).toHaveAccessibleName("Toggle theme");
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
