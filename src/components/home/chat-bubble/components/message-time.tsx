import { MessageSeenSvg } from "../../../ui/svgs";

interface MessageTimeProps {
  time: string;
  fromMe: boolean;
}

export const MessageTime = ({ time, fromMe }: MessageTimeProps) => {
  return (
    <div
      className={`flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400 mt-1 ${
        fromMe ? "justify-end" : "justify-start"
      }`}
    >
      <span className="font-medium">{time}</span>
      {fromMe && (
        <div data-testid="message-seen-container" className="flex items-center">
          <MessageSeenSvg data-testid="message-seen-svg" />
        </div>
      )}
    </div>
  );
};
