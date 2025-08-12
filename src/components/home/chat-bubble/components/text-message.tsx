import Link from "next/link";
import { IMessage } from "../../../types";

interface TextMessageProps {
  message: IMessage;
}

export const TextMessage = ({ message }: TextMessageProps) => {
  const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content);

  return (
    <div>
      {isLink ? (
        <Link
          href={message.content}
          target="_blank"
          rel="noopener noreferrer"
          className={`mr-2 text-sm font-light text-blue-400 underline`}
        >
          {message.content}
        </Link>
      ) : (
        <p className={`mr-2 text-sm font-light`}>{message.content}</p>
      )}
    </div>
  );
};
