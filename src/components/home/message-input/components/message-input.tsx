import { useState } from "react";
import { Mic, Send } from "lucide-react";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { useConversationStore } from "../../../../store/chat-store";
import { EmojiPickerComponent } from "./emoji-picker";
import { useMessageAPI } from "../api/message-api";
import { MediaDropdown } from "../../media-dropdown";

const MessageInput = () => {
  const [msgText, setMsgText] = useState("");
  const { selectedConversation } = useConversationStore();
  const { sendTextMessage } = useMessageAPI();

  const handleSendTextMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !selectedConversation) return;

    const success = await sendTextMessage(msgText.trim(), selectedConversation._id);
    if (success) {
      setMsgText("");
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMsgText((prev) => prev + emoji);
  };

  return (
    <div className="bg-gray-primary p-2 flex gap-4 items-center">
      <div className="relative flex gap-2 ml-2">
        <EmojiPickerComponent onEmojiSelect={handleEmojiSelect} />
        <MediaDropdown />
      </div>
      <form onSubmit={handleSendTextMsg} className="w-full flex gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Type a message"
            className="py-2 text-sm w-full rounded-xl shadow-sm bg-gray-tertiary focus-visible:ring-transparent"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
          />
        </div>
        <div className="mr-4 flex items-center gap-3">
          {msgText.length > 0 ? (
            <Button
              type="submit"
              size={"sm"}
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Send />
            </Button>
          ) : (
            <Button
              type="submit"
              size={"sm"}
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Mic />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
