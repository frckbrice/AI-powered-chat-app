import { useState } from "react";
import { Bot } from "lucide-react";
import { useConversationStore } from "@/store/chat-store";
import { IMessage, IUser } from "../../../types";
import ChatBubbleAvatar from "./chat-bubble-avatar";
import DateIndicator from "./date-indicator";
import ChatAvatarActions from "./chat-avatar-action";
import { VideoMessage } from "./video-message";
import { ImageMessage } from "./image-message";
import { TextMessage } from "./text-message";
import { ImageDialog } from "./image-dialog";
import { MessageTime } from "./message-time";
import { formatMessageTime, getMessageBackgroundClass } from "../api/message-utils";

interface ChatBubbleProps {
  message: IMessage;
  me: IUser;
  previousMessage?: IMessage;
}

const ChatBubble = ({ me, message, previousMessage }: ChatBubbleProps) => {
  const time = formatMessageTime(message._creationTime);
  const { selectedConversation } = useConversationStore();
  const isMember = selectedConversation?.participants.includes(message.sender?._id) || false;
  const isGroup = selectedConversation?.isGroup;
  const fromMe = message.sender?._id === me._id;
  const fromAI = message.sender?.name === "ChatGPT";
  const bgClass = getMessageBackgroundClass(fromMe, fromAI);

  const [open, setOpen] = useState(false);

  const renderMessageContent = () => {
    switch (message.messageType) {
      case "text":
        return <TextMessage message={message} />;
      case "image":
        return <ImageMessage message={message} handleClick={() => setOpen(true)} />;
      case "video":
        return <VideoMessage message={message} />;
      default:
        return null;
    }
  };

  if (!fromMe) {
    return (
      <>
        <DateIndicator message={message} previousMessage={previousMessage} />
        <div className="flex gap-3 w-full max-w-4xl">
          <ChatBubbleAvatar
            isGroup={isGroup}
            isMember={isMember}
            message={message}
            fromAI={fromAI}
          />
          <div className="flex flex-col flex-1 max-w-2xl">
            {/* Message Header */}
            <div className="flex items-center gap-2 mb-1">
              {!fromAI && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {message.sender?.name || "Unknown User"}
                </span>
              )}
              {fromAI && (
                <div className="flex items-center gap-2">
                  <Bot size={14} className="text-blue-500" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    ChatGPT
                  </span>
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className="relative group mb-2">
              <div
                className={`inline-block max-w-full px-4 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${bgClass} transition-all duration-200 hover:shadow-md`}
              >
                {isGroup && <ChatAvatarActions message={message} me={me} />}
                {renderMessageContent()}
              </div>

              {/* Message Footer */}
              <div className="flex items-center justify-between px-1">
                <MessageTime time={time} fromMe={fromMe} />
              </div>
            </div>
          </div>
        </div>

        {/* Image Dialog */}
        {open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
      </>
    );
  }

  return (
    <>
      <DateIndicator message={message} previousMessage={previousMessage} />
      <div className="flex justify-end w-full max-w-4xl">
        <div className="flex flex-col items-end max-w-2xl">
          {/* Message Content */}
          <div className="relative group mb-2">
            <div
              className={`inline-block max-w-full px-4 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${bgClass} transition-all duration-200 hover:shadow-md`}
            >
              {renderMessageContent()}
            </div>
          </div>

          {/* Message Footer */}
          <div className="flex items-center gap-2 px-1">
            <MessageTime time={time} fromMe={fromMe} />
            <div className="text-xs text-gray-500 dark:text-gray-400">You</div>
          </div>
        </div>
      </div>

      {/* Image Dialog */}
      {open && <ImageDialog src={message.content} open={open} onClose={() => setOpen(false)} />}
    </>
  );
};

export default ChatBubble;
