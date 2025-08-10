import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateMs: number) {
  const inputDate = new Date(dateMs);

  const startOfDay = (d: Date) => {
    const s = new Date(d);
    s.setHours(0, 0, 0, 0);
    return s;
  };

  const today = startOfDay(new Date());
  const provided = startOfDay(inputDate);

  const msInDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((provided.getTime() - today.getTime()) / msInDay);

  if (diffDays === 0) {
    return inputDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  if (diffDays === -1) {
    return "Yesterday";
  }
  if (diffDays >= -6 && diffDays <= -1) {
    return inputDate.toLocaleDateString(undefined, { weekday: "long" });
  }
  return inputDate.toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export const isSameDay = (timestamp1: number, timestamp2: number): boolean => {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Define getRelativeDateTime function
export interface MessageLike {
  _creationTime: number;
}
export const getRelativeDateTime = (message: MessageLike, previousMessage?: MessageLike) => {
  const startOfDay = (d: Date) => {
    const s = new Date(d);
    s.setHours(0, 0, 0, 0);
    return s;
  };

  const today = startOfDay(new Date());
  const yesterday = startOfDay(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const oneWeekAgo = startOfDay(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const messageDate = new Date(message._creationTime);
  const messageDay = startOfDay(messageDate);

  if (!previousMessage || !isSameDay(previousMessage._creationTime, messageDay.getTime())) {
    if (isSameDay(messageDay.getTime(), today.getTime())) {
      return "Today";
    }
    if (isSameDay(messageDay.getTime(), yesterday.getTime())) {
      return "Yesterday";
    }
    if (messageDay.getTime() > oneWeekAgo.getTime()) {
      return messageDate.toLocaleDateString(undefined, { weekday: "long" });
    }
    return messageDate.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

// Fix dead code and improve randomness in randomID
export function randomID(len = 5) {
  const chars = "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
  const maxPos = chars.length;
  let result = "";

  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const bytes = new Uint32Array(len);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < len; i++) {
      result += chars[bytes[i] % maxPos];
    }
    return result;
  }

  for (let i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}
