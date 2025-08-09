export interface LastMessage {
  _id: string;
  messageType: "text" | "image" | "video";
  content?: string;
  sender: string;
  _creationTime?: number;
}

export interface ConversationType {
  _id: string;
  admin: string | null;
  groupImage: string | null;
  groupName: string | null;
  participants: string[];
  _creationTime: number;
  lastMessage?: LastMessage | null;
  sender: string;
  isOnline?: boolean;
  isGroup?: boolean;
}
