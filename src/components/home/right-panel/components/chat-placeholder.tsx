"use client";

import { Lock } from "lucide-react";
import Image from "next/image";

const ChatPlaceHolder = () => {
  return (
    <div className="w-3/4 bg-gray-secondary flex flex-col items-center justify-center py-10">
      <div className="flex flex-col items-center w-full justify-center py-10 gap-4">
        <Image src={"/desktop-hero.png"} alt="Hero" width={320} height={188} property={"75%"} />
        <p className="text-3xl font-extralight mt-5 mb-2">Welcome to Chat</p>
        <p className="w-1/2 text-center text-gray-primary text-sm text-muted-foreground">
          Select a conversation from the sidebar to start chatting with your contacts.
        </p>
        <p className="w-1/2 text-center text-gray-primary text-sm text-muted-foreground">
          Click the video icon with the chat page, to start a video call with your contacts by
          sending them links to join the call.
          <br />
          <span className="text-xs text-gray-primary mt-2">
            Note: Video calls are currently in beta and may not work as expected.
          </span>
        </p>
      </div>
      {/* blink this message after 5 seconds */}
      <p className="w-1/2 mt-auto text-center text-gray-primary text-xs text-muted-foreground flex items-center justify-center gap-1 ">
        <Lock size={10} /> Start communicating with chatgpt by starting the message with &quot;@gpt
        &apos;your message&apos;&quot;
      </p>
    </div>
  );
};
export default ChatPlaceHolder;
