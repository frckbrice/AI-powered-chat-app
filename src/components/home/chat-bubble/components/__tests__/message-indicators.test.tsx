import { render } from "@testing-library/react";
import { OtherMessageIndicator, SelfMessageIndicator } from "../message-indicators";

describe("MessageIndicators", () => {
  describe("OtherMessageIndicator", () => {
    it("renders with correct styling", () => {
      const { container } = render(<OtherMessageIndicator />);
      
      const indicator = container.firstChild as HTMLElement;
      expect(indicator).toHaveClass(
        "absolute",
        "bg-white",
        "dark:bg-gray-primary",
        "top-0",
        "-left-[4px]",
        "w-3",
        "h-3",
        "rounded-bl-full"
      );
    });

    it("renders as a div element", () => {
      const { container } = render(<OtherMessageIndicator />);
      
      const indicator = container.firstChild as HTMLElement;
      expect(indicator.tagName).toBe("DIV");
    });
  });

  describe("SelfMessageIndicator", () => {
    it("renders with correct styling", () => {
      const { container } = render(<SelfMessageIndicator />);
      
      const indicator = container.firstChild as HTMLElement;
      expect(indicator).toHaveClass(
        "absolute",
        "bg-green-chat",
        "top-0",
        "-right-[3px]",
        "w-3",
        "h-3",
        "rounded-br-full",
        "overflow-hidden"
      );
    });

    it("renders as a div element", () => {
      const { container } = render(<SelfMessageIndicator />);
      
      const indicator = container.firstChild as HTMLElement;
      expect(indicator.tagName).toBe("DIV");
    });
  });
});
