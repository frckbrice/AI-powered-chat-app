import { render, screen } from "@testing-library/react";
import { MessageTime } from "../message-time";

describe("MessageTime", () => {
  const mockTime = "10:30 AM";

  it("renders time correctly", () => {
    render(<MessageTime time={mockTime} fromMe={false} />);

    expect(screen.getByText("10:30 AM")).toBeInTheDocument();
    expect(screen.getByText("10:30 AM")).toHaveClass("font-medium");
  });

  it("applies correct styling for non-own message", () => {
    const { container } = render(<MessageTime time={mockTime} fromMe={false} />);

    const timeContainer = container.firstChild as HTMLElement;
    expect(timeContainer).toHaveClass(
      "flex",
      "items-center",
      "gap-1",
      "text-[10px]",
      "text-gray-500",
      "dark:text-gray-400",
      "mt-1",
      "justify-start",
    );
  });

  it("applies correct styling for own message", () => {
    const { container } = render(<MessageTime time={mockTime} fromMe={true} />);

    const timeContainer = container.firstChild as HTMLElement;
    expect(timeContainer).toHaveClass(
      "flex",
      "items-center",
      "gap-1",
      "text-[10px]",
      "text-gray-500",
      "dark:text-gray-400",
      "mt-1",
      "justify-end",
    );
  });

  it("shows seen indicator for own message", () => {
    render(<MessageTime time={mockTime} fromMe={true} />);

    // The MessageSeenSvg should be rendered
    const seenIndicator = screen.getByTestId("message-seen-svg");
    expect(seenIndicator).toBeInTheDocument();
  });

  it("does not show seen indicator for non-own message", () => {
    render(<MessageTime time={mockTime} fromMe={false} />);

    // The MessageSeenSvg should not be rendered
    const seenIndicator = screen.queryByTestId("message-seen-svg");
    expect(seenIndicator).not.toBeInTheDocument();
  });

  it("handles different time formats", () => {
    const timeFormats = ["12:00 PM", "23:45", "00:00", "11:59 PM"];

    timeFormats.forEach((time) => {
      const { getByText } = render(<MessageTime time={time} fromMe={false} />);
      expect(getByText(time)).toBeInTheDocument();
    });
  });
});
