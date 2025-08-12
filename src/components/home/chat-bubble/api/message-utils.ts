import { IMessage } from "../../../types";

export const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

export const isLinkMessage = (content: string): boolean => {
  return /^(ftp|http|https):\/\/[^ "]+$/.test(content);
};

export const getMessageBackgroundClass = (fromMe: boolean, fromAI: boolean): string => {
  if (fromMe) return "bg-green-chat";
  if (fromAI) return "bg-blue-500 text-white";
  return "bg-white dark:bg-gray-primary";
};

export const shouldShowDateIndicator = (message: IMessage, previousMessage?: IMessage): boolean => {
  if (!previousMessage) return true;

  const currentDate = new Date(message._creationTime);
  const previousDate = new Date(previousMessage._creationTime);

  return currentDate.toDateString() !== previousDate.toDateString();
};
