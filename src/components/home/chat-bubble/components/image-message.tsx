import Image from "next/image";
import { IMessage } from "../../../types";

interface ImageMessageProps {
  message: IMessage;
  handleClick: () => void;
}

export const ImageMessage = ({ message, handleClick }: ImageMessageProps) => {
  return (
    <div className="w-[250px] h-[250px] relative">
      <Image
        src={message.content}
        fill
        className="cursor-pointer object-cover rounded"
        alt="image"
        onClick={handleClick}
      />
    </div>
  );
};
