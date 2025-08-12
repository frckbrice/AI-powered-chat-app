import EmojiPicker, { Theme } from "emoji-picker-react";
import useComponentVisible from "@/hooks/useComponentVisible";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export const EmojiPickerComponent = ({ onEmojiSelect }: EmojiPickerProps) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} onClick={() => setIsComponentVisible(true)}>
      {isComponentVisible && (
        <EmojiPicker
          theme={Theme.DARK}
          onEmojiClick={(emojiObject) => {
            onEmojiSelect(emojiObject.emoji);
          }}
          style={{ position: "absolute", bottom: "1.5rem", left: "1rem", zIndex: 50 }}
        />
      )}
      <svg
        className="w-6 h-6 text-gray-600 dark:text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
};
